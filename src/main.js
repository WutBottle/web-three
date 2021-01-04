import Vue from 'vue'
import App from './App.vue'
import routers from './routers'
import 'normalize.css/normalize.css'
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;
// Vue.use(Antd);

new Vue({
  render: h => h(App),
  router: routers,
}).$mount('#app');
