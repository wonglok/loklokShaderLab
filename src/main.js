// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSession from 'vue-session'
import AsyncComputed from 'vue-async-computed'
import Vuex from 'vuex'
import store from '@/store'
Vue.use(AsyncComputed)
Vue.use(VueSession)
Vue.use(Vuex)

var VueTouch = require('vue-touch-easyhi')
Vue.use(VueTouch)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
