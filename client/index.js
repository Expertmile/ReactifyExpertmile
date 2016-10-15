import 'babel-polyfill'
import React from 'react/lib/React'
import { render } from 'react/lib/ReactDOM'
import Router from 'react-router/lib/Router'
import history from 'react-router/lib/browserHistory'
import match from 'react-router/lib/match'
import Provider from 'react-redux/lib/components/Provider'

import * as reducers from 'reducers'

import injectStoreAndGetRoutes from '../shared/routes'
import createStore from 'redux/lib/createStore'
import combineReducers from 'redux/lib/combineReducers'
import applyMiddleware from 'redux/lib/applyMiddleware'
import axios from 'axios/lib/axios'
import immutifyState from 'lib/immutifyState'
import injectAxiosAndGetMiddleware from 'lib/promiseMiddleware'
import * as MoreActions from '../shared/actions/MoreActions'

axios.interceptors.request.use((axiosConfig) => {
  if (axiosConfig.url[0] === '/') {
    axiosConfig.url = '/api/1' + axiosConfig.url; // eslint-disable-line no-param-reassign
  }
  return axiosConfig
})

const initialState = immutifyState(window.__INITIAL_STATE__)

const reducer = combineReducers(reducers)

const promiseMiddleware = injectAxiosAndGetMiddleware(axios)
const store = applyMiddleware(promiseMiddleware)(createStore)(reducer, initialState)

const routes = injectStoreAndGetRoutes(store)

match({ history, routes}, () => {
  render(
    <Provider store={store}>
      <Router children={routes} history={history} />
    </Provider>,
    document.getElementById('react-view')
  )
})

// Ensure we only attempt to register the SW once.
let isAlreadyRegistered = false

// const URL = '/sw.js';
// const SCOPE = '/';

// ;(function () {
//   if (!isAlreadyRegistered) {
//     isAlreadyRegistered = true
//     if ('serviceWorker' in navigator) {
//       navigator.serviceWorker.register(URL, {
//         scope: SCOPE
//       }).then((registration) => {
//         registration.onupdatefound = function () {
//           const installingWorker = registration.installing
//           installingWorker.onstatechange = function () {
//             switch (installingWorker.state) {
//               case 'installed':
//                 if (!navigator.serviceWorker.controller) {
//                   console.log('Caching complete! Future visits will work offline.')
//                 }
//                 break

//               case 'redundant':
//                 throw Error('The installing service worker became redundant.')
//             }
//           }
//         }
//       }).catch(function (e) {
//         console.log('navigator.serviceWorker.register() error', e)
//         console.error('Service worker registration failed:', e)
//       })
//     }
//   }

//   if (navigator.serviceWorker && navigator.serviceWorker.controller) {
//     navigator.serviceWorker.controller.onstatechange = function (event) {
//       if (event.target.state === 'redundant') {
//         // Define a handler that will be used for the next io-toast tap, at which point it
//         // be automatically removed.
//         console.log('A new version of this app is available.', 'Refresh'); // duration 0 indications shows the toast indefinitely.
//       }
//     }
//   }

//   navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
//     if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
//       console.warn('Notifications arent supported.')
//       return
//     }

//     // Check if push messaging is supported  
//     if (!('PushManager' in window)) {
//       console.warn('Push messaging isnt supported.')
//       return
//     }

//     // Check the current Notification permission.  
//     // If its denied, it's a permanent block until the  
//     // user changes the permission  
//     if (Notification.permission === 'denied') {
//       console.warn('The user has blocked notifications.')
//       return
//     }

//     let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
//     let ua = navigator.userAgent.toLowerCase()
//     let isAndroid = ua.indexOf('android') > -1
//     if (isAndroid && isChrome) {
//       if (!window.matchMedia('(display-mode: standalone)').matches) {
//           let homeBanner = document.querySelector('.home__banner')
//           let ringtimeout = setTimeout(() => {
//           homeBanner.classList.add('home__banner--visible')
//           navigator.vibrate([80, 150, 80, 150, 80])
//           clearTimeout(ringtimeout);
//           },2000)
          
//       }
//     }

//     serviceWorkerRegistration.pushManager.getSubscription().then(
//       function (pushSubscription) {
//         let notifyCard = document.querySelector('.notification__panel')
//         if (!pushSubscription) {
//           if (store.getState().auth.get('id') !== null) {
//             notifyCard.classList.add('notification__panel--visible')
//           }
//         }

//         // Enable any UI which subscribes / unsubscribes from  
//         // push messages.  
//         let viewport960px = window.matchMedia('(min-width: 960px)').matches

//         store.subscribe(() => {
//           let componentStatus = { 'state': store.getState().notification.toJS(), 'viewport': viewport960px }
//           serviceWorkerRegistration.active.postMessage(componentStatus)
//         })
//       })
//       .catch((e) => {
//         if (Notification.permission === 'denied') {
//           // The user denied the notification permission which
//           // means we failed to subscribe and the user will need
//           // to manually change the notification permission to
//           // subscribe to push messages
//           console.warn('permission for notification denied')
//         } else {
//           // A problem occurred with the subscription, this can
//           // often be down to an issue or lack of the gcm_sender_id
//           // and / or gcm_user_visible_only
//           console.error('unable to subscribe' + e)
//         }
//       })
//   })

//   // console.log(navigator.onLine)
//   function updateOnlineStatus () {
//     let online = navigator.onLine
//     if (!online) {
//       store.dispatch(MoreActions.resetAuth())
//     } else {
//       if (store.getState().auth.get('id') === null) {
//         store.dispatch(MoreActions.loadAuth())
//       }
//     }
//   }
//   window.addEventListener('online', updateOnlineStatus)
//   window.addEventListener('offline', updateOnlineStatus)
//   updateOnlineStatus()
// })()


// window.addEventListener('load', () => {
//   if (location.pathname === '/') {
//     let pushButton = document.querySelector('.js-push-button')
//     pushButton.addEventListener('click', () => {
//       subscribe()
//     })
//   }
// })

// function subscribe () {
//   // Disable the button so it can't be changed while  
//   // we process the permission request  
//   var notifyCard = document.querySelector('.notification__panel')

//   navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
//     serviceWorkerRegistration.pushManager.subscribe({
//       userVisibleOnly: true
//     })
//       .then((subscription) => {
//         // The subscription was successful
//         notifyCard.classList.remove('notification__panel--visible')
//         // TODO: Send the subscription.endpoint to your server  
//         // and save it to send a push message at a later date
//         return sendSubscriptionToServer(subscription)
//       })
//       .catch((e) => {
//         if (Notification.permission === 'denied') {
//           // The user denied the notification permission which  
//           // means we failed to subscribe and the user will need  
//           // to manually change the notification permission to  
//           // subscribe to push messages  
//           console.warn('Permission for Notifications was denied')
//           notifyCard.classList.remove('notification__panel--visible')
//         } else {
//           // A problem occurred with the subscription; common reasons  
//           // include network errors, and lacking gcm_sender_id and/or  
//           // gcm_user_visible_only in the manifest.  
//           console.error('Unable to subscribe to push.', e)
//         }
//       })
//   })
// }

// function endpointWorkaround (pushSubscription) {
//   // Make sure we only mess with GCM
//   if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
//     return pushSubscription.endpoint
//   }

//   var mergedEndpoint = pushSubscription.endpoint
//   // Chrome 42 + 43 will not have the subscriptionId attached
//   // to the endpoint.
//   if (pushSubscription.subscriptionId &&
//     pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
//     // Handle version 42 where you have separate subId and Endpoint
//     mergedEndpoint = pushSubscription.endpoint + '/' +
//     pushSubscription.subscriptionId
//   }
//   return mergedEndpoint
// }

// function sendSubscriptionToServer (subscription) {
//   var mergedEndpoint = endpointWorkaround(subscription)
//   // This is just for demo purposes / an easy to test by
//   // generating the appropriate cURL command
//   var endpointSections = mergedEndpoint.split('/')
//   var subscriptionId = endpointSections[endpointSections.length - 1]
//   var authId = store.getState().auth.get('id')
//   fetch('/api/1/pushState/', {
//     method: 'post',
//     headers: {
//       'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     },
//     body: 'authID=' + authId + '&subID=' + subscriptionId
//   })
// }
