/**
 * api接口的统一出口
 */
import tokensController from './tokensController';
import modelController from "@api/apiSugar/modelController";
import workerController from "@api/apiSugar/workerController";

// 导出接口
export default {
  tokensController, // 登录管理
  modelController, // 模型数据管理
  workerController, // excel格式转换
}