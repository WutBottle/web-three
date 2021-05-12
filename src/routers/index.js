import Vue from 'vue';
import vueRouter from 'vue-router';

Vue.use(vueRouter);

export default new vueRouter({
  mode: 'history',
  routes: [{ // 根路由
    path: '/',
    redirect: '/login',
  }, { // 登录页面路由
    path: '/login',
    name: 'LoginPage',
    component: () => import('@components/LoginPage/LoginPage'),
  }, { // 文件页面路由
    path: '/file',
    name: 'FilePage',
    component: () => import('@components/FilePage/FilePage'),
  }, { // 工作台页面路由
    path: '/work',
    name: 'WorkPage',
    component: () => import('@components/WorkPage/WorkPage'),
  }, { // 系统管理界面路由
    path: '/admin',
    name: 'AdminPage',
    component: () => import('@components/AdminPage/AdminPage'),
  }]
})

