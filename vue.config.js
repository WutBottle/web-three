const path = require('path');
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions:{
          modifyVars: {
            'primary-color': '#888',
            'link-color': '#1DA57A',
          },
          javascriptEnabled: true,
        }
      }
    }
  },
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets',resolve('src/assets'))
      .set('@components',resolve('src/components'))
      .set('@api',resolve('src/api'))
      .set('@routers',resolve('src/routers'))
      .set('@js',resolve('src/js'))
      .set('@data',resolve('src/data'))
      .set('@C_CPP',resolve('src/C_CPP'));
  },
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.(c|cpp)$/,
      use: [{
        loader: 'wasm-loader',
      }, {
        loader: 'c-cpp-modules-webpack-loader',
        options: {
          compiller: '-Os -s WASM=1 -s SIDE_MODULE=1'
        }
      }]
    })
  }
};