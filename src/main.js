import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@assets/style/common/reset.css';
import rem from '@assets/libs/rem.js'
import utils from '@assets/libs/utils.js'
import FastClick from 'fastclick'
import i18n from '@assets/local/index.js' 

FastClick.attach(document.body);
rem()
Vue.config.productionTip = false

Vue.prototype.$wei=utils.wei_fn
Vue.prototype.$toWei = utils.towei_fn

import {
  Toast,
  Dialog,
} from "vant";

Vue.use(Toast);
Vue.use(Dialog )
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
