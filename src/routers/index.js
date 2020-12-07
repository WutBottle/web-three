import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
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
  }]
})