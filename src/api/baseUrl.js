'use strict';

/**
 * 接口域名的管理
 */
//设置分服务设置服务器地址，蒲公英地址:http://172.15.67.120:8083/，服务器:http://10.11.30.24:3000/
const serverBaseUrl = 'http://192.168.1.5:3000/';
const distributeUrl = {
  // 用户信息
  serverBaseController: serverBaseUrl,
  tokensController: serverBaseUrl + 'tokens',
};

export default distributeUrl;