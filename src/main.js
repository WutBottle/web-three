import Vue from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;
Vue.use(Antd);
import App from './App.vue'
import routers from './routers'
import 'normalize.css/normalize.css'
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)

new Vue({
  render: h => h(App),
  router: routers,
}).$mount('#app');
