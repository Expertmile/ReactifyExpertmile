import express                     from 'express/lib/express';
import bodyParser                  from 'body-parser';
import axios                       from 'axios/lib/axios';
import React                       from 'react/lib/React';
import { renderToString }          from 'react/lib/ReactDOMServer';
import RouterContext               from 'react-router/lib/RouterContext';
import match                       from 'react-router/lib/match';
import injectStoreAndGetRoutes     from 'routes';
import Provider                    from 'react-redux/lib/components/Provider';
import * as reducers               from 'reducers';
import compression                 from 'compression';
import  createStore  			         from 'redux/lib/createStore';
import  combineReducers  		       from 'redux/lib/combineReducers';
import applyMiddleware 			       from 'redux/lib/applyMiddleware'; 
import path                        from 'path';

import fetchComponentData          from 'lib/fetchComponentData';
import injectAxiosAndGetMiddleware from 'lib/promiseMiddleware';
import apiRouter                   from './api';

const app = express();

app.disable('x-powered-by');

if (process.env.NODE_ENV !== 'production') {
  require('./webpack.dev').default(app);
}

// compress all requests
app.use(compression());
app.use(express.static(__dirname + '/dist'));
console.log(__dirname + '/dist')
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

app.use('/api/1', apiRouter);

app.use((req, res) => {
  res.contentType('text/html');
  const client = axios.create();
  client.interceptors.request.use(function (config) {
    if (config.url[0] === '/') {
      config.url = 'http://localhost:3000/api/1/' + config.url; 
      config.headers = req.headers;
    }
    return config;
  });

  const reducer = combineReducers(reducers);
  const promiseMiddleware = injectAxiosAndGetMiddleware(client);

  const store = applyMiddleware(promiseMiddleware)(createStore)(reducer);
  const routes = injectStoreAndGetRoutes(store);

  match({routes, location: req.url}, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }
    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps)
      return res.status(404).end('Not found');

    function renderView() {
      const InitialView = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      const componentHTML = renderToString(InitialView);

      const initialState = store.getState();

      const html = `
       <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
            <meta name="author" content="Vaibhav Satam" />
            <link rel="canonical" href="https://www.expertmile.com">
            <meta name="viewport" content="width=device-width,minimum-scale=1,user-scalable=no">
            <meta id="theme-color" name="theme-color" content="#006cb4">
            <title>Expertmile Timeline</title>
            <link rel="manifest" href="/manifest.json">
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
            </script>
            <style>
            .side-nav:before,body:after{content:''}.header,body:after{position:fixed;top:0;width:100%}*{box-sizing:border-box;-webkit-user-select: none;-webkit-tap-highlight-color: transparent}body,html{padding:0;margin:0;height:100%;width:100%;background-color:#e7e9ec!important;font-family: Roboto, Helvetica, Arial, sans-serif;font-weight:400;color:#444;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}body{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch;-webkit-align-content:stretch;align-content:stretch;background:#ececec}body:after{left:0;height:100%;pointer-events:none;background:#FAFAFA;opacity:0;will-change:transform,opacity;transition:opacity 333ms cubic-bezier(0,0,.21,1) .4s}.app-deeplink:after{opacity:1;pointer-events:auto}.hidden{display:none}a{text-decoration:none;color:#006cb4}hr{border:.5px solid #ddd}button::-moz-focus-inner{border:0}.header{z-index:2;height:56px;color:#FFF;background:#006cb4;font-size:20px;box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 2px 9px 1px rgba(0,0,0,.12),0 4px 2px -2px rgba(0,0,0,.2);padding:16px 16px 0;will-change:transform;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch;-webkit-align-content:center;-ms-flex-line-pack:center;align-content:center;-webkit-transition:-webkit-transform 233ms cubic-bezier(0,0,.21,1) .1s;transition:-webkit-transform 233ms cubic-bezier(0,0,.21,1) .1s;transition:transform 233ms cubic-bezier(0,0,.21,1) .1s;transition:transform 233ms cubic-bezier(0,0,.21,1) .1s,-webkit-transform 233ms cubic-bezier(0,0,.21,1) .1s}.bookmark__icon,.header-button__login,.header__menu{opacity:1;transition:opacity 333ms cubic-bezier(0,0,.21,1);border:none;overflow:hidden;outline:0}.main{z-index:0}.new-recording-btn{z-index:3}.view-underpanel{z-index:4}.details-view__box-reveal{z-index:5}.details-view__panel{z-index:6}.details-view__playback{z-index:1}body:after{z-index:100}.side-nav{z-index:200}.dialog-view{z-index:250}.toast-view{z-index:300}@font-face{font-family:Roboto;font-weight:400;font-style:normal;src:url(/Roboto/NotoSans-Regular-webfont.eot);src:url(/Roboto/NotoSans-Regular-webfont.woff) format('woff')}.content{position:relative;width:100%;padding-top:56px}.header__menu{width:20px;height:2px;box-shadow:inset 0 0 0 32px,0 -6px,0 6px;color:#FFF;cursor:pointer;text-indent:-30000px}.header-button__login{ background: #FFF;margin: 5px;cursor: pointer;position: relative;top: -4px;margin-top: 0px;padding: 8px 15px 8px 15px;color: #333;}.bookmark__icon{background:0 0;margin-top:-8px}@keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-4px,0,0)}40%,60%{transform:translate3d(4px,0,0)}}.detect_header_menu{padding:20px;margin-top:-15px;margin-left:-15px;cursor:pointer}.header__title{font-weight:400;font-size:20px;margin:0;-webkit-flex:1;-ms-flex:1;flex:1}@media (max-width:600px){.mdl-tabs{display:block;width:100%}.mdl-tabs__tab-bar{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-content:space-between;-ms-flex-line-pack:justify;align-content:space-between;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;width:100%;height:48px;box-shadow:4px 4px 5px 5px rgba(0,0,0,.14),10px 1px 10px 10px rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);padding:0;position:fixed;background:#FFF;z-index:2;bottom:0}.mdl-share-tabs__tab,.mdl-tabs__tab{position:relative;text-align:center;font-weight:700}.mdl-tabs__tab{margin-left:30px;border:none;display:block;text-decoration:none;height:48px;line-height:48px;font-size:14px;color:#333;overflow:hidden}.mdl-tabs__panel{display:block}.mdl-share-tabs{display:block;width:100%}.mdl-share-tabs-bar{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-content:space-between;-ms-flex-line-pack:justify;align-content:space-between;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;width:100%;height:42px;background:#FFF;overflow:hidden;color:#313534;border-radius:none;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.mdl-share-tabs-bar-detailview,.mdl-share-tabs-bar__companel{width:100%;height:42px;background:#FFF;overflow:hidden;color:#313534;border-top:1px solid #ddd;border-bottom:1px solid #ddd}.mdl-share-tabs__tab{margin-left:5px;border:none;display:block;height:42px;line-height:42px;font-size:13px;color:#777}.mdl-share-tabs__tab:hover{color:#006cb4}.mdl-share-tabs__panel{display:block}}@media(min-width:960px){.side-floating__home{width:18%;position:fixed;top:12%;left:6%;overflow:hidden;color:#313534}.home-nav__analytics,.home-nav__articles,.home-nav__cards,.home-nav__delete-memos,.home-nav__inbox,.home-nav__keywords,.home-nav__miles,.home-nav__my-leads,.home-nav__new-assign,.home-nav__queries{font-family:Roboto;font-size:14px;outline:0;height:48px;padding-left:72px;width:100%;text-align:left;display:block;border:none;background:url(/images/avatar.svg) 16px 12px no-repeat;background-size:24px,24px;color:rgba(0,0,0,.87);cursor:pointer}.home-nav__my-leads{background:url(/images/bar-chart.svg) 16px 12px no-repeat;background-size:26px,26px;line-height:48px;text-decoration:none}.home-nav__articles{background-image:url(/images/edit.svg);line-height:48px;background-size:24px,24px;text-decoration:none}.home-nav__cards,.home-nav__inbox,.home-nav__new-assign,.home-nav__queries{line-height:48px;background-size:26px,26px;text-decoration:none}.home-nav__new-assign{background-image:url(/images/paper.svg)}.home-nav__inbox{background-image:url(/images/envelope.svg)}.home-nav__cards{background-image:url(/images/credit-card.svg)}.home-nav__queries{background-image:url(/images/speech-bubble.svg)}}.dialog-view,.side-nav{top:0;pointer-events:none}.side-nav{width:100%;height:100%;position:fixed;left:0;overflow:hidden}.side-nav:before{width:100%;height:100%;background:#000;opacity:0;display:block;position:absolute;will-change:opacity;transition:opacity 233ms cubic-bezier(0,0,.21,1)}.new-recording-btn,.side-nav__content{overflow:hidden;will-change:transform}.side-nav__content{background:#FAFAFA;width:304px;height:100%;outline:0;box-shadow:0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);-webkit-transform:translateX(-102%);transform:translateX(-102%)}.side-nav--visible{pointer-events: all;}.side-nav--visible:before {opacity: 0.7;}.side-nav__content--animatable {transition: -webkit-transform 0.233s cubic-bezier(0,0,0.21,1);transition: transform 0.233s cubic-bezier(0,0,0.21,1);}.new-recording-btn{width:56px;height:56px;border-radius:50%;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAEMAAABDAGWp/hQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAASxQTFRF////AAD/VVWqK1WASW2SN22SRGaIQ2uGPW2GOmiLOWiOPmSLPGmHPmeKQGaGPmaIPWmLPGeIOmqKPWaKPGaLO2mJPWiKP2mKPWmIPGeIPGiLPWiKPWeJPGmKPGeKPWmIPmeJPmeKPGiJPWiJPGiJPWiJPmeJPmiJPWmIPWiKPWiJPWeJPWiJPWiJPWiJPWmJPmiJPmiIPWiJPmmKPWiJPWeJPWiJPmiJPWmJPWiJPWeIPGiJUY+yPWiJToqtVJO1PWiJSYChV5q9RnqcPWmIXafJQ3OVPWiKPWiJQG2PZrjaPWiJPWiJP2qLPWiJPWiJPWiJbMPnPWiJPWiJPWiJPWiJPWiJPWeJb8ruPWiJPWiJPWiJPWiJPWiJPWiJPWiJPWiJc9D0PWiJc9D0BnepPAAAAGJ0Uk5TAAEDBgcODxMVFhshIiUoLS4vMDI3ODs9S01RU1RVWVxjb3t9f4KIkZKWmp6gpqeoqq6xsrO0tba3uLm6v8DAwMHBwsTIyMrM0NTX2N3g4+Xm5ufq6+zt7/H1+Pn6+/z9/v4aXhBCAAABOUlEQVQ4y3XSd1eCUBzG8Z9iQ9vDtpaVLZtqu7RhpU1zpGHDHt7/ewguKHfA8xfnfD8HuByIPDew9nqZCJPvxj9Q/UFlyq+P1bEa7Eu2v+a9+2gNSGtEs5+NCNHc7p68GnIlJuI4JXqAugujaYtNLFERw8JiutkNRwxh3wTC80eqrDtiAucScPr7/Z0lMgUsiqDTX5Bn90A2KAC3X/8xcGi+KAeUfhwiHij9zeouUDqeiAdKz7QEoHZN54HSsxrxIFRGTu4CiAKlpmHc8ucXQAJVSzzecF0AO5hOs3uwfsTOL4DnlqbZwu086EeBiInO95XADNbJFlznQRJx8yowWQdOup0HZxjsXUhVzL/xwO0cCDR+r77NWk7Fos4iAgir/7XeIzxiZVvesvQdPNcFRZ+1bbAB321Z/R9JJrNeR2M9jQAAAABJRU5ErkJggg==) center center no-repeat #FFF;background-size:28px 28px;text-indent:-4000px;position:fixed;bottom:62px;right:16px;cursor:pointer;border:none;box-shadow:0 8px 11px 1px rgba(0,0,0,.14),0 3px 16px 2px rgba(0,0,0,.12),0 5px 5px -3px rgba(0,0,0,.2)}.new-recording-btn:focus{outline:0}.new-recording-btn-hide{display:none}.new-recording-btn:hover{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}@media(min-width:600px){.new-recording-btn{right:24px}}@media(min-width:960px){.new-recording-btn{right:auto;left:50%;margin-left:392px;width:64px;height:64px}}.dialog-view{background:rgba(0,0,0,.57);position:fixed;left:0;width:100%;height:100%;visibility:hidden;opacity:0;will-change:opacity;transition:opacity 333ms cubic-bezier(0,0,.21,1)}.home__banner,.notification__panel{transition:opacity .2s,visibility .2s,transform .3s cubic-bezier(.165,.84,.44,1)}.dialog-view__panel{background:#FFF;border-radius:2px;box-shadow:0 0 14px rgba(0,0,0,.24),0 14px 28px rgba(0,0,0,.48);min-width:320px;position:absolute;left:50%;top:50%}.notification__panel{background-color:#607D8B;box-shadow:0 0 2px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.24);color:#fff;padding:0;opacity:0;height:0;transform:translateY(20px);will-change:all;visibility:hidden}.notification__panel--visible{opacity:1;height:auto;padding:16px;visibility:visible;transform:translateY(0)}.notification__panel p{color:#FFF;font-size:12px}.notification__panel_title{color:#FFF}.notification__panel button{color:#FFF;background:#4CAF50;border:none;border-radius:10px;outline:0;padding:10px 15px}.home__banner{opacity:0;will-change:opacity;visibility:hidden}.home__banner--visible{opacity:1;animation:shake .52s cubic-bezier(.36,.07,.19,.97) both;-webkit-animation:shake .52s cubic-bezier(.36,.07,.19,.97) both;-moz-animation:shake .52s cubic-bezier(.36,.07,.19,.97) both;-webkit-animation-iteration-count:2;-moz-animation-iteration-count:2;animation-iteration-count:2;transform:translate3d(0,0,0);backface-visibility:hidden;perspective:1000px;visibility:visible}.row{margin-left:-12px;margin-right:-12px}.col_lg_1,.col_lg_10,.col_lg_11,.col_lg_12,.col_lg_2,.col_lg_3,.col_lg_4,.col_lg_5,.col_lg_6,.col_lg_7,.col_lg_8,.col_lg_9,.col_md_1,.col_md_10,.col_md_11,.col_md_12,.col_md_2,.col_md_3,.col_md_4,.col_md_5,.col_md_6,.col_md_7,.col_md_8,.col_md_9,.col_sm_1,.col_sm_10,.col_sm_11,.col_sm_12,.col_sm_2,.col_sm_3,.col_sm_4,.col_sm_5,.col_sm_6,.col_sm_7,.col_sm_8,.col_sm_9,.col_xs_1,.col_xs_10,.col_xs_11,.col_xs_12,.col_xs_2,.col_xs_3,.col_xs_4,.col_xs_5,.col_xs_6,.col_xs_7,.col_xs_8,.col_xs_9{position:relative;min-height:1px;padding-left:10px;padding-right:10px}.col_xs_1,.col_xs_10,.col_xs_11,.col_xs_12,.col_xs_2,.col_xs_3,.col_xs_4,.col_xs_5,.col_xs_6,.col_xs_7,.col_xs_8,.col_xs_9{float:left}.col_xs_12{width:100%}.col_xs_11{width:91.66666666666666%}.col_xs_10{width:83.33333333333334%}.col_xs_9{width:75%}.col_xs_8{width:66.66666666666666%}.col_xs_7{width:58.333333333333336%}.col_xs_6{width:50%}.col_xs_5{width:41.66666666666667%}.col_xs_4{width:33.33333333333333%}.col_xs_3{width:25%}.col_xs_2_5{width:20%}.col_xs_2{width:16.666666666666664%}.col_xs_1{width:16.333333333333332%}@media (min-width:769px){.col_sm_1,.col_sm_10,.col_sm_11,.col_sm_12,.col_sm_2,.col_sm_3,.col_sm_4,.col_sm_5,.col_sm_6,.col_sm_7,.col_sm_8,.col_sm_9{float:left}}@media (min-width:992px){.col_md_1,.col_md_10,.col_md_11,.col_md_12,.col_md_2,.col_md_3,.col_md_4,.col_md_5,.col_md_6,.col_md_7,.col_md_8,.col_md_9{float:left}}@media (max-width:600px){.hidden_xs{display:none!important}}@media (min-width:601px) and (max-width:991px){.hidden_sm{display:none!important}}@media (min-width:992px) and (max-width:1199px){.hidden_md{display:none!important}}@media (min-width:1200px){.col_lg_1,.col_lg_10,.col_lg_11,.col_lg_12,.col_lg_2,.col_lg_3,.col_lg_4,.col_lg_5,.col_lg_6,.col_lg_7,.col_lg_8,.col_lg_9{float:left}.col_lg_12{width:100%}.col_lg_10{width:83.33333333333334%}.col_lg_9{width:75%}.col_lg_8{width:66.66666666666666%}.col_lg_6{width:50%}.col_lg_4{width:33.33333333333333%}.col_lg_3{width:25%}.col_lg_2{width:16.666666666666664%}.col_lg_1{width:8.333333333333332%}.col_lg_offset_4{margin-left:33.33333333333333%}.col_lg_offset_3{margin-left:25%}.col_lg_offset_2{margin-left:16.666666666666664%}.col_lg_offset_1{margin-left:8.333333333333332%}.hidden_lg{display:none!important}}._2wHA9viCfEpQ6jzONTEjrc{position:relative;width:100%;padding-top:56px}section{position:relative;padding:12px}.a4jyqJzgAtJRO5iXQFQn5{border-top:.5px dotted #ddd}[contentEditable=true]:empty:before{content:attr(placeholder);display:block}._3UZyZWwfmxQxJMhfa2hUnV{box-sizing:border-box;border:1px solid #ddd;cursor:text;padding:7px;border-radius:2px;font-size:13px;box-shadow:inset 0 1px 8px -3px #ababab;background:#fefefe}._1cTn2aI84cMw5ZcS-5xbhU{position:fixed;bottom:15px;background:transparent;border:none;font-size:16px;font-weight:700;color:#00a0dc;opacity:.54;text-transform:uppercase;right:10px;outline:none}._23yYSQvRdyOi1z5gusczAY{background:transparent;border:none;font-size:13px;cursor:pointer;margin-top:12px;color:#777;opacity:.74;outline:none}._23yYSQvRdyOi1z5gusczAY>img,._23yYSQvRdyOi1z5gusczAY>span{vertical-align:middle}._23yYSQvRdyOi1z5gusczAY>img{width:16px;height:16px;margin-top:-4px}._23yYSQvRdyOi1z5gusczAY:hover{opacity:1;color:#777}._3Zss2p3TfXS-b7o_X4-1k7{background:transparent;border:none;font-size:13px;margin-top:12px;color:#777;cursor:pointer;opacity:1;outline:none}._3Zss2p3TfXS-b7o_X4-1k7>img,._3Zss2p3TfXS-b7o_X4-1k7>span{vertical-align:middle}._3Zss2p3TfXS-b7o_X4-1k7>img{width:16px;height:16px;margin-top:-4px}._3Zss2p3TfXS-b7o_X4-1k7:hover{opacity:1;color:#777}._3PQNBuGxVpmjlhK9jWe152{float:right;background:#00a0dc;border:none;padding:5px;border-radius:2px;color:#fff;margin:5px;font-size:12px}._2N08bYLibHN6Bu5wrfTa3G{font-size:11px;margin-top:10px;color:#777}._2mTEbt31wA9OcVpoRyk5rG{min-height:50px}._2GCFq7vtcuUviElEHJD-_J{position:absolute;left:65px;top:15px;font-size:12.5px;color:#0c7cd5;font-weight:700}._2r-YyvFuB3SGnuBtB9BoUb{position:absolute;left:65px;top:35px;white-space:nowrap;overflow:hidden;text-transform:capitalize;margin-bottom:5px;font-size:10px}._-tuJnJEEftetdAQHSRlFL{font-size:9px;margin-left:5px;float:right;margin-top:5px}._35eotrKti2a6jTlnjl8cIk{white-space:pre-wrap;font-size:13px;font-weight:400;line-height:22px;margin-top:10px;text-shadow:0 -.5px 0 rgba(0,0,0,.2)}._2N14R6lOagTpbnkA1kRHQY{border-radius:50%;min-height:45px;min-width:45px}._20jpgwV3Yc7-zj-kCO319c{font-size:13px;font-weight:700;margin-top:2px}._3FzxiLKXs_4GERtTa3SSYT{font-weight:400;font-size:10px;color:#777;margin-top:2px}._39eLTMyR3UggvO97pLQ2EZ{font-weight:400;font-size:12.5px;margin-top:5px}._2a9VjciidaEZHOMe7zSfmN{font-weight:400}.Cv7mXouZzX2b3clDzMbUL{margin-top:5px}._2H4oxcMEOGZjjYNOFAD1QA{font-size:12px;padding:20px;margin-left:20px;cursor:pointer}._2mp5OHxItjyFeiEmt0R4Mg{margin-top:10px}._2mp5OHxItjyFeiEmt0R4Mg,._3s8P8xzKN4hr2zvWebS3Ai{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;font-size:16px;font-weight:400;overflow:hidden;width:100%;z-index:1;position:relative;background:#fff;border-radius:2px;box-sizing:border-box;box-shadow:0 0 1px rgba(0,0,0,.12),0 2px 2px rgba(0,0,0,.24)}.eX8NBL7wngYcJbx-i5fcx{padding:12px;position:relative}.eX8NBL7wngYcJbx-i5fcx:after,.eX8NBL7wngYcJbx-i5fcx:before{content:" ";display:table}.eX8NBL7wngYcJbx-i5fcx:after{clear:both}.FPDMASKI41__kITMdcoJg{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;font-size:16px;font-weight:400;overflow:hidden;width:100%;z-index:1;position:relative;background:#f1f3f5;border-radius:2px;box-sizing:border-box;box-shadow:0 0 1px rgba(0,0,0,.12),0 2px 2px rgba(0,0,0,.24)}._1TXCVk3zzdK6JX_Qliyoz5{padding:5px;position:relative}._1TXCVk3zzdK6JX_Qliyoz5:after,._1TXCVk3zzdK6JX_Qliyoz5:before{content:" ";display:table}._1TXCVk3zzdK6JX_Qliyoz5:after{clear:both}._2ReNcFze0OM7r8uq_MoGHo{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;font-size:16px;font-weight:400;overflow:hidden;width:100%;z-index:1;position:relative;background:#f1f3f5;border-radius:2px;box-sizing:border-box;box-shadow:0 0 1px rgba(0,0,0,.12),0 2px 2px rgba(0,0,0,.24);padding:5px}._2ReNcFze0OM7r8uq_MoGHo:after,._2ReNcFze0OM7r8uq_MoGHo:before{content:" ";display:table}._2ReNcFze0OM7r8uq_MoGHo:after{clear:both}._2WbftBH9QJ5otZdBsrWyoZ{position:fixed;margin:0;bottom:12px;overflow:hidden;margin-left:-32px;text-indent:-30000px;opacity:1}._3Y4aQ6ZsuyP0bdqvv-9n7w{width:3px;height:3px;cursor:pointer;box-shadow:-6px -6px 0,-6px 0 0,-6px 6px 0;display:inline-block;vertical-align:middle;position:absolute;right:15px;color:#ababab}.VB_5GweB7coqrHoFaOFIl{padding:20px;position:absolute;top:10px;right:10px;cursor:pointer}._2Fe-sraql1Z_8IbtdTjG5r,._3Y4aQ6ZsuyP0bdqvv-9n7w:hover{color:#00a0dc;cursor:pointer}._3rhDr9MV9rXjjw7XBvK954{margin-top:-10px}.LbWtJyMV4X_Pf-VFFh_oW{background:#fff;border:1px solid;border-color:#e5e6e9 #dfe0e4 #d0d1d5;border-radius:3px;padding:12px;margin-top:20px;margin-bottom:20px;min-height:200px;border-radius:2px;box-shadow:0 1px 3px 0 rgba(0,0,0,.33)}@keyframes _1-EqLd4dVnchknoOyvqUNc{0%{background-position:-468px 0}to{background-position:468px 0}}._1Y05nZOfKM_6sXotT2O0L2{position:relative;will-change:background-position;animation-duration:1s;animation-fill-mode:forwards;animation-iteration-count:infinite;animation-name:_1-EqLd4dVnchknoOyvqUNc;animation-timing-function:linear;background:linear-gradient(90deg,#eee 8%,#ddd 18%,#eee 33%);background-size:800px 104px;height:12px;margin:5px}
            </style>
          </head>
          <body class="{{ deeplink_class }}">
            <div id="react-view">${componentHTML}</div>
            <script type="application/javascript" src="/bundle.js" async defer></script>
          </body>
        </html>
      `;
      res.status(getStatus(initialState, renderProps.routes)).end(html);
    }
    fetchComponentData(store, renderProps.components, renderProps.params, renderProps.location)
      .then(renderView)
      .catch(error => {
        console.error(error.stack);
        res.sendStatus(500);
      });
  });
});

function getStatus(errOrRes, routes) {
  if (errOrRes && errOrRes.status) {
    return errOrRes.status;
  }
  return routes.reduce((prev, curr) => curr.status || prev, 200);
}

export default app;
