import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n'
import './plugins/filters'


import router from "@/router";

Vue.config.productionTip = false

// @ts-ignore
new Vue({
  vuetify,
  i18n,
  router,
  render: (h: any) => h(App),
}).$mount('#app')
