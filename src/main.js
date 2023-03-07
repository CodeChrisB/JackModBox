import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

import router from './router'

Vue.config.productionTip = false


router.pass = (route,props)=> router.push({name:route,params:{...props}})

new Vue({
  vuetify,
  router,
  file:window.file,
  render: h => h(App)
}).$mount('#app')
