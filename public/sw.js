// LUMI reapply reminder service worker.
// Shows reminder notifications and brings the app back when one is tapped.
const APP_PATH = "/app";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = windows.find((client) => new URL(client.url).pathname === APP_PATH);
      if (open) return open.focus();
      return self.clients.openWindow(APP_PATH);
    })(),
  );
});
