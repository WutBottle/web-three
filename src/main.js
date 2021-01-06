import Vue from 'vue';
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// Vue.use(Antd);
Vue.config.productionTip = false;
import App from './App.vue';
import routers from './routers';
import 'normalize.css/normalize.css';
import vcolorpicker from 'vcolorpicker';
Vue.use(vcolorpicker);
import store from './store';


new Vue({
  store,
  render: h => h(App),
  router: routers,
}).$mount('#app');
