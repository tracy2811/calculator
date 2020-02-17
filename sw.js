self.addEventListener('install', function (event) {
	console.log('SW installed');
	event.waitUntil(
		caches.open('static').then(function (cache) {
			cache.addAll([
				'/',
				'/index.html',
				'/style.css',
				'/script.js',
				'/icon-144x144.png',
			]);
		}),
	);
});

self.addEventListener('activate', function (event) {
	console.log('SW activated');
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request).then(function (res) {
			if (res) {
				return res;
			} else {
				return fetch(event.request);
			}
		}),
	);
});

