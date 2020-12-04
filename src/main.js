import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import 'normalize.css/normalize.css'
import { Button, Menu, Icon, Select, Spin, Progress, Modal, Form, Input, Tree, Tooltip, Tabs, Alert, FormModel, message} from 'ant-design-vue'
import vcolorpicker from 'vcolorpicker'
import routers from './routers'
Vue.use(vcolorpicker)
Vue.use(VueRouter)

Vue.config.productionTip = false;
Vue.use(Button);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Spin);
Vue.use(Progress);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Input);
Vue.use(Tree);
Vue.use(Tooltip);
Vue.use(Tabs);
Vue.use(Alert);
Vue.use(FormModel);
Vue.prototype.$message = message;

new Vue({
  render: h => h(App),
  router: routers,
}).$mount('#app');
