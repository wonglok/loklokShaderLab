// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSession from 'vue-session'
import AsyncComputed from 'vue-async-computed'
Vue.use(AsyncComputed)
Vue.use(VueSession)

var VueTouch = require('vue-touch-easyhi')
Vue.use(VueTouch)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
