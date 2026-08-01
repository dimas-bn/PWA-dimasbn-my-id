// Service Worker sederhana untuk dimasbn.my.id
// Fungsi: menyimpan beberapa halaman/asset penting agar tetap bisa diakses saat offline
// dan menampilkan prompt "Add to Home Screen" di browser yang mendukung.

const CACHE_NAME = "dimasbn-cache-v1";

// Aset inti yang akan disimpan saat pertama kali PWA di-install.
// Silakan tambah/ubah sesuai URL asli halaman kamu.
const CORE_ASSETS = [
  "/",
  "/favicon-192x192.png",
  "/favicon-512x512.png",
];

// INSTALL: simpan aset inti ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE: bersihkan cache versi lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH: strategi "network first, fallback ke cache"
// Cocok untuk blog yang kontennya sering update, tapi tetap bisa diakses saat offline.
self.addEventListener("fetch", (event) => {
  // Hanya tangani request GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // simpan salinan terbaru ke cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // kalau offline / gagal fetch, coba ambil dari cache
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("/");
        });
      })
  );
});
