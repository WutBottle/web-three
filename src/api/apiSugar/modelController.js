/*
 * model数据接口调用
 * By ZP
 */

'use strict';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import axios from '../axiosService';

const modelController = {
  // 获取模型列表信息
  getModelList(params) {
    return axios.get(`${baseUrl.modelController}/getModelList`, {params});
  },
  // 添加模型数据
  addModel(params) {
    return axios.post(`${baseUrl.modelController}/addModel`, params);
  },
  // 删除模型数据
  deleteModel(params) {
    return axios.post(`${baseUrl.modelController}/deleteModel`, params);
  },
  // 修改模型数据
  updateModel(params) {
    return axios.post(`${baseUrl.modelController}/updateModel`, params);
  },
  // 加入我可使用仓库
  addUsableModel(params) {
    return axios.post(`${baseUrl.modelController}/addUsableModel`, params);
  },
  // 移除我可使用仓库
  removeUsableModel(params) {
    return axios.post(`${baseUrl.modelController}/removeUsableModel`, params);
  },
};

export default modelController;