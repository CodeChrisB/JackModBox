import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Bus from './plugins/Bus'
import Code from "@/assets/data/BusCode"
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$broadcast = (broadcastName,payload) => Bus.$emit(broadcastName,payload??null)
Vue.prototype.$listen = (broadcastName,cb) => Bus.$on(broadcastName,cb)

var filter = function(text, length, clamp){
  clamp = clamp || '...';
  var node = document.createElement('div');
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', filter);




router.pass = (route,props)=> router.push({name:route,params:{...props}})

new Vue({
  vuetify,
  router,
  file:window.file,
  render: h => h(App)
}).$mount('#app')
