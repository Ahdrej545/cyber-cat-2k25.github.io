"use strict";

const CACHE_NAME = "cyber-cat-shell-v2.0.2";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./style.css?v=2.0.2",
  "./script.js?v=2.0.2",
  "./site.webmanifest?v=2.0.2",
  "./favicon.svg",
  "./app-icon-192.png",
  "./app-icon-512.png?v=2.0.2",
  "./assets/sounds/cat-roar.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("cyber-cat-shell-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const scopePath = new URL(self.registration.scope).pathname;
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scopePath)) return;

  const isNavigation = request.mode === "navigate";
  const isAppResource = isNavigation ||
    ["style", "script", "image", "audio", "font"].includes(request.destination) ||
    url.pathname.endsWith("/site.webmanifest");
  if (!isAppResource) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    if (isNavigation) {
      try {
        const response = await fetch(request);
        if (response && response.ok) cache.put(request, response.clone()).catch(() => {});
        return response;
      } catch (error) {
        const cached = await cache.match(request) ||
          await cache.match(new URL("./index.html", self.registration.scope).href) ||
          await cache.match(new URL("./", self.registration.scope).href);
        if (cached) return cached;
        return new Response("Cyber Cat ещё не сохранён для офлайн-режима. Открой сайт один раз при подключённом интернете.", {
          status: 503,
          headers: {"Content-Type": "text/plain; charset=utf-8"}
        });
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      return new Response("Этот файл ещё не был сохранён на устройстве. Подключись к интернету и обнови страницу.", {
        status: 503,
        headers: {"Content-Type": "text/plain; charset=utf-8"}
      });
    }
  })());
});
