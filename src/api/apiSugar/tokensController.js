/*
 * 用户中心接口调用
 * By ZP
 */

'use strict';
import baseUrl from '../baseUrl'; // 导入接口域名列表
import axios from '../axiosService';

const tokensController = {
  // 登录用户
  loginUser(params) {
    return axios.post(`${baseUrl.tokensController}/login`, params);
  },
  // 注销用户
  logout(params) {
    return axios.get(`${baseUrl.tokensController}/logout`, {params});
  },
  // 注册用户
  registerUser(params) {
    return axios.post(`${baseUrl.tokensController}/register`, params)
  }
};

export default tokensController;