/*
 * 考勤数据格式转换
 * By ZP
 */

'use strict';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import axios from '../axiosService';

const workerController = {
  // 上传文件
  upload(params) {
    return axios.post(`${baseUrl.workerController}/upload`, params);
  },
};

export default workerController;