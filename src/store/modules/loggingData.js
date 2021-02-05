/*
* Author: 张鹏
* 日志相关数据
*/

const state = {
  logData: [], // 存放日志总数据数组，格式为{action, date}
};

const mutations = {
  // 添加新日志
  addData(state, data) {
    state.logData.push(data);
  },
  // 重置日志
  resetData(state) {
    state.logData = [];
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}