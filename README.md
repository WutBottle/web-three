# web-three
## 1.项目说明
&emsp;&emsp;基于Web的增材制造预处理平台前端代码，该项目使用到的是Vue+Vuex+Vue-router+Three.js+ant-design-vue+axios来完成前端部分的搭建。  
&emsp;&emsp;项目完成的功能有用户信息管理、模型信息管理、STL模型导出和导入、模型数据拓扑重建、模型分层切片、切片轮廓水平填充、三维场景创建与交互。

## 2.项目安装
安装完node环境后在命令行里执行该指令完成项目依赖包的安装。
```
npm install
```

## 3.项目开发环境
运行该指令可以实时进行热更新开发。
```
npm run serve
```

## 4.生产环境部署打包
在项目部署服务器需要使用到该指令，打包前先去api/baseUrl.js文件里修改serverBaseUrl为当前后端服务地址，并将src/main.js里的标注代码给注释掉，再执行打包指令。
```
npm run build
```

## 5.代码规范性检查(可以忽略)
```
npm run lint
```

## 6.详细依赖
项目依赖开发包详细信息请到[package.json](./package.json)查看
