import Vue from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import { Button, Menu, Icon, Select, Spin, Progress} from 'ant-design-vue'

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Spin);
Vue.use(Progress);

new Vue({
  render: h => h(App),
}).$mount('#app');