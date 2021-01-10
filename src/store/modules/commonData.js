/*
* Author: 张鹏
* 模型相关参数
*/

const state = {
  indexData: [], // 需导出图层树形索引名称
  treeData: [], // 当前图层树形菜单数据
};

const mutations = {
  // 更新当前图层索引数据
  updateIndexData(state, data) {
    state.indexData = data;
  },
  // 初始化treeData
  iniTreeData(state) {
    state.treeData = [];
  },
  // 删除某一图层数据
  deleteTreeDataItem(state, item) {
    state.treeData.splice(state.treeData.findIndex(item), 1);
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}