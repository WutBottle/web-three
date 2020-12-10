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
  }
};

export default modelController;