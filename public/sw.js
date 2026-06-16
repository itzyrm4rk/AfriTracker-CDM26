self.addEventListener("install", (event) => {
  console.log("Service Worker installed.")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.")
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
  // PWA requirement: having a fetch handler. We just let the network handle it.
  return
})
