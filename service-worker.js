"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["324705b2610d4468dfaa.worker.js","f0abbf7c2b5335cc40bda0de04e9202b"],["a1f6d22e9ad9ad3c3548.worker.js","8220c59a1876d384112ab8032c57a971"],["e56bdeffcdb837c76b7e.worker.js","fc9eaed50fbee0aa20793fbffc14a9fc"],["f8c944a200d09a8e94c8.worker.js","9767ca71341f9aafb73ad5fd9af1e553"],["index.html","b8aae39798f1a2580038bc0418020585"],["service-worker.js","f4cca185863d2938b283b921f17bc9e2"],["static/css/app.535cd582c019a4233132d8ae17654531.css","f6eb3a062cc0ee2b899e91deea7ca873"],["static/js/0.17be539e689cbc455744.js","b4171f7a3351f6d39bfb1184b30ce198"],["static/js/app.0ac0b1fe542ad1e03a79.js","9ca129b952b80044c92a410ce4482844"],["static/js/manifest.59dca6306ec231d4b2f9.js","21cead3acdf5c2053c56c5c48b562620"],["static/js/vendor.285e34c4f0726b58a727.js","0e7b4e1df2a650c69d1abef576d5b78b"]],cacheName="sw-precache-v3-loklok-shader-lab-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,t,n,r){var a=new URL(e);return r&&a.pathname.match(r)||(a.search+=(a.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),a.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],r=new URL(t,self.location),a=createCacheKey(r,hashParamName,n,!1);return[r.toString(),a]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var r=new Request(n,{credentials:"same-origin"});return fetch(r).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});