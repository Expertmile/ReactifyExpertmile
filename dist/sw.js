;(function (global) {

  importScripts('/sw-toolbox/sw-toolbox.js')
  let CACHE_VERSION = 'v1';
  global.toolbox.options.cache.name = 'expertmile-assets-' + CACHE_VERSION
  global.toolbox.options.cache.maxEntries = 150
  global.toolbox.options.cache.maxAgeSeconds = 30 * 30

  global.toolbox.precache(
    [
      './Roboto/NotoSans-Regular-webfont.eot',
      './Roboto/NotoSans-Regular-webfont.woff',

      './images/chrome-touch-icon-192x192.png',
      './images/chrome-touch-icon-384x384.png',
      './images/ic_arrow_back_24px.svg',
      './images/blank.png',
      './images/add-user.svg',
      './images/insight.svg',
      './images/edit.svg',
      './images/credit-card.svg',
      './images/speech-bubble.svg',
      './images/paper.svg',
      './images/bar-chart.svg',
      './images/avatar.svg',
      './images/side-nav-bg@2x.jpg',
      './images/nothelpful.png',
      './images/helpful.png',
      './images/next.png',
      './images/likeme.png',
      './images/chats.png',

      './styles/addhome.css',
      './styles/dialog.css',
      './styles/toaster.css',
      './styles/moreRoute.css',
      './styles/detailedPanel.css',
      './styles/sidenav.css',

      './bundle.js',
      './1.bundle.js',
      './2.bundle.js',
      './3.bundle.js',
      './4.bundle.js',
      './5.bundle.js',
      './6.bundle.js',

      '/manifest.json'
    ]
  )


  global.toolbox.router.get(/^.*bundle.*$/, function(request, values, options) {
    return self.toolbox.fastest(request, values, options); 
  });

  global.toolbox.router.get(/.\//, function(request, values, options) { 
    if (!request.url.match('/api/1/*') && request.headers.get('accept').includes('application/json')) {
      return self.toolbox.networkOnly(request, values, options);
    } else { 
      return self.toolbox.networkFirst(request, values, options);
    } 
  }, {
    networkTimeoutSeconds: 3
  });

  global.toolbox.router.get('/api/1/*', function (request, values, options) {
    if (request.headers.has('Authorization') && !request.headers.has('X-Cache-Only')) {
      return global.toolbox.networkOnly(request, values, options).then(function (response) {
        if (response) {
          return response
        } else {
          return new Response('', {
            status:     204,
            statusText: 'No cached content available.'
          })
        }
      })
    }

    if (request.headers.get('X-Cache-Only') === 'true') {
      return global.toolbox.cacheOnly(request, values, options).then(function (response) {
        if (response) {
          return response
        } else {
          return new Response('', {
            status:     204,
            statusText: 'No cached content available.'
          })
        }
      })
    }

    return global.toolbox.networkFirst(request, values, options).then(function (response) {
      if (response) {
        return response
      } else {
        return new Response('', {
          status:     204,
          statusText: 'No cached content available.'
        })
      }
    })

  }, {
    cache: {
      name:          'content-cache-' + CACHE_VERSION,
      maxEntries:    50,
      maxAgeSeconds: 30 * 30
    },
    networkTimeoutSeconds: 3
  })

  let DEFAULT_PROFILE_IMAGE_URL = '/images/blank.png'

  global.toolbox.router.get('/upload/*', function (request, values, options) {
    return global.toolbox.cacheFirst(request, values, options).then(function(response){
      if (response) {
        return response;
      } else {
        return new Response('', {
          status:     204,
          statusText: 'No cached content available.'
        })
      }
    }).catch(function () {
      return global.toolbox.cacheOnly(new Request(DEFAULT_PROFILE_IMAGE_URL, values, options))
    })
  }, {
    cache: {
      name:          'content-profile-' + CACHE_VERSION,
      maxEntries:    50,
      maxAgeSeconds: 30 * 30
    }
  }
  )

  global.toolbox.router.get('/images/*', function (request, values, options) {
    return global.toolbox.cacheFirst(request, values, options).then(function(response){
      if (response) {
        return response;
      } else {
        return new Response('', {
          status:     204,
          statusText: 'No cached content available.'
        })
      }
    }).catch(function () {
      return global.toolbox.fastest(new Request(DEFAULT_PROFILE_IMAGE_URL, values, options))
    })
  }, {
    cache: {
      name:          'content-images-' + CACHE_VERSION,
      maxEntries:    50,
      maxAgeSeconds: 30 * 30
    }
  }
  )

  global.toolbox.router.get('/Roboto/*', fontRequest)

  let DEFAULT_FONT_URL = '/Roboto/NotoSans-Regular-webfont.woff'
  function fontRequest (request) {
    return global.toolbox.cacheOnly(request).catch(function () {
      return global.toolbox.networkFirst(new Request(DEFAULT_FONT_URL))
    })
  }

  global.addEventListener('fetch', function (event) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request)
      })
    )
  });
  // push notification

  global.addEventListener('message', function (event) {
    global.viewport = event.data.viewport
    global.state = event.data.state
  })

  global.addEventListener('push', function (event) {
    event.waitUntil(
      self.registration.showNotification('Expertmile', {
        body: global.state.senderName + ' has replied on your query',
        icon: './images/blank.png',
        tag:  'expertmile-notify'
      })
    )
  })

  global.addEventListener('notificationclick', function (event) {
    event.notification.close()
    if (Notification.prototype.hasOwnProperty('data')) {
      if (global.viewport) {
        var url = 'https://expertmile.com/expert-advice.php?topic=' + global.state.postID
      } else {
        var url = 'https://expertmile.com/post/' + global.state.postID
      }
      event.waitUntil(clients.openWindow(url))
    } else {
      event.waitUntil(getIdb().get('Expertmile',
        event.notification.tag).then(function (url) {
        // At the moment you cannot open third party URL's, a simple trick
        // is to redirect to the desired URL from a URL on your domain
        var redirectUrl = '/redirect.html?redirect=' +
          url
        return clients.openWindow(redirectUrl)
      }))
    }
  })

  global.addEventListener('install',
    event => event.waitUntil(global.skipWaiting()))
  global.addEventListener('activate',
    event => event.waitUntil(global.clients.claim()))
})(self)

