// Service Worker للعبة رحلة حبنا
// يتيح للعبة العمل بدون إنترنت

const CACHE_NAME = 'love-hunt-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-apple-touch.png'
];

// التثبيت - حفظ الملفات في الـ Cache
self.addEventListener('install', event => {
  console.log('⚙️ Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// التفعيل - حذف الـ Caches القديمة
self.addEventListener('activate', event => {
  console.log('🔄 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// جلب الملفات - من الـ Cache أو من الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا موجود في الـ Cache، استخدمه
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        // وإلا، اجلبه من الشبكة
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).then(response => {
          // تحقق من صحة الاستجابة
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // احفظ نسخة في الـ Cache للمستقبل
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(error => {
        console.error('❌ Fetch failed:', error);
        // يمكنك إرجاع صفحة offline هنا
      })
  );
});

// الاستماع للرسائل من التطبيق
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
