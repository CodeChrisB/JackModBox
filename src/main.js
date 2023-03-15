import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Bus from './plugins/Bus'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$broadcast = (broadcastName,payload) => Bus.$emit(broadcastName,payload??null)
Vue.prototype.$listen = (broadcastName,cb) => Bus.$on(broadcastName,cb)

router.pass = (route,props)=> router.push({name:route,params:{...props}})

new Vue({
  vuetify,
  router,
  file:window.file,
  render: h => h(App)
}).$mount('#app')
