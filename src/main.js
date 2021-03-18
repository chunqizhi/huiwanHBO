import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@assets/style/common/reset.css';
import rem from '@assets/libs/rem.js'
import FastClick from 'fastclick'
import i18n from '@assets/local/index.js' 
FastClick.attach(document.body);
rem()
Vue.config.productionTip = false

import './apis/index'
import {
  Icon,
  Popover,
  Toast,
  Loading,
  Dialog 
} from "vant";

Vue.use(Icon);
Vue.use(Popover);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Dialog )
new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
