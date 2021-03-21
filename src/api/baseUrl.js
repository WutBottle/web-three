'use strict';

/**
 * 接口域名的管理
 */
//设置分服务设置服务器地址，蒲公英地址:http://172.15.67.120:8083/，服务器:http://106.75.182.176:3000/
const serverBaseUrl = 'http://10.11.29.54:3000/';
const distributeUrl = {
  serverBaseController: serverBaseUrl,
  tokensController: serverBaseUrl + 'tokens',   // 用户数据接口
  modelController: serverBaseUrl + 'model', // 模型数据接口
};

export default distributeUrl;