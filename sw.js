<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2685.3">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 12.0px Helvetica; min-height: 14.0px}
  </style>
</head>
<body>
<p class="p1">const CACHE_NAME = 'love-hunt-cache-v7';</p>
<p class="p1">const ASSETS = [</p>
<p class="p1"><span class="Apple-converted-space">  </span>'./',</p>
<p class="p1"><span class="Apple-converted-space">  </span>'./index.html',</p>
<p class="p1"><span class="Apple-converted-space">  </span>'./manifest.webmanifest',</p>
<p class="p1"><span class="Apple-converted-space">  </span>'./sw.js'</p>
<p class="p1">];</p>
<p class="p2"><br></p>
<p class="p1">self.addEventListener('install', (event) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">  </span>event.waitUntil(</p>
<p class="p1"><span class="Apple-converted-space">    </span>caches.open(CACHE_NAME).then((cache) =&gt; cache.addAll(ASSETS))</p>
<p class="p1"><span class="Apple-converted-space">  </span>);</p>
<p class="p1"><span class="Apple-converted-space">  </span>self.skipWaiting();</p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">self.addEventListener('activate', (event) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">  </span>event.waitUntil(</p>
<p class="p1"><span class="Apple-converted-space">    </span>caches.keys().then((keys) =&gt;</p>
<p class="p1"><span class="Apple-converted-space">      </span>Promise.all(keys.map((k) =&gt; (k !== CACHE_NAME ? caches.delete(k) : null)))</p>
<p class="p1"><span class="Apple-converted-space">    </span>)</p>
<p class="p1"><span class="Apple-converted-space">  </span>);</p>
<p class="p1"><span class="Apple-converted-space">  </span>self.clients.claim();</p>
<p class="p1">});</p>
<p class="p2"><br></p>
<p class="p1">self.addEventListener('fetch', (event) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">  </span>const req = event.request;</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>// Network-first for navigation (صفحات)</p>
<p class="p1"><span class="Apple-converted-space">  </span>if (req.mode === 'navigate') {</p>
<p class="p1"><span class="Apple-converted-space">    </span>event.respondWith(</p>
<p class="p1"><span class="Apple-converted-space">      </span>fetch(req).then((res) =&gt; {</p>
<p class="p1"><span class="Apple-converted-space">        </span>const copy = res.clone();</p>
<p class="p1"><span class="Apple-converted-space">        </span>caches.open(CACHE_NAME).then((cache) =&gt; cache.put('./index.html', copy));</p>
<p class="p1"><span class="Apple-converted-space">        </span>return res;</p>
<p class="p1"><span class="Apple-converted-space">      </span>}).catch(() =&gt; caches.match('./index.html'))</p>
<p class="p1"><span class="Apple-converted-space">    </span>);</p>
<p class="p1"><span class="Apple-converted-space">    </span>return;</p>
<p class="p1"><span class="Apple-converted-space">  </span>}</p>
<p class="p2"><br></p>
<p class="p1"><span class="Apple-converted-space">  </span>// Cache-first for everything else</p>
<p class="p1"><span class="Apple-converted-space">  </span>event.respondWith(</p>
<p class="p1"><span class="Apple-converted-space">    </span>caches.match(req).then((cached) =&gt; cached || fetch(req))</p>
<p class="p1"><span class="Apple-converted-space">  </span>);</p>
<p class="p1">});</p>
</body>
</html>
