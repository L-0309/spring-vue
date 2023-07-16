import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "../store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/gloable.css'
import {serverIp} from "../public/config";


import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import VuePictureSwipe from 'vue-picture-swipe';

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
Vue.use(mavonEditor);
Vue.use(VideoPlayer)

Vue.component('vue-picture-swipe', VuePictureSwipe);

// import request from "@/utils/request";

Vue.config.productionTip = false

Vue.use(ElementUI, {size: 'mini'});
// Vue.prototype.request = request
Vue.prototype.serverIp = `http://${serverIp}:8111/files/upload`

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
