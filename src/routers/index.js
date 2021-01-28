import Vue from 'vue'
import vueRouter from 'vue-router'

Vue.use(vueRouter);

export default new vueRouter({
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/login',
  }, {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@components/LoginPage/LoginPage'),
  }, {
    path: '/work',
    name: 'WorkPage',
    component: () => import('@components/WorkPage/WorkPage'),
  }, {
    path: '/file',
    name: 'FilePage',
    component: () => import('@components/FilePage/FilePage'),
  }, {
    path: '/worker',
    name: 'WorkerPage',
    component: () => import('@components/WorkerPage/WorkerPage'),
  }]
})