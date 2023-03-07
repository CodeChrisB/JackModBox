import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingsView from '../views/SettingsView.vue'
import FileViewer from '@/views/FileViewer.vue'
import MonacoEditor from '@/views/MonacoEditor.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path:'/fileviewer/:key',
    name:'fileviewer',
    component: FileViewer
  },
  {
    path:'/monaco/:key',
    name:'MonacoEditor',
    component: MonacoEditor
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
