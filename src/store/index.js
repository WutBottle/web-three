import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import commonData from "@store/modules/commonData";

const store = new Vuex.Store({
  modules: {
    commonData, // 共同数据
  },
});

export default store;