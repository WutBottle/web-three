/*
* Author: 张鹏
* 模型相关参数
*/

const state = {
  indexData: [], // 需导出图层树形索引名称
};

const mutations = {
  updateIndexData(state, data) {
    state.indexData = data;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}