const path = require('path');
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // modifyVars: {
          //   'primary-color': '#888',
          //   'link-color': '#1DA57A',
          // },
          javascriptEnabled: true,
        }
      }
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      const externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'axios': 'axios',
        'ant-design-vue': 'Antd',
      }
      config.externals(externals)
      const cdn = {
        css: [
          // ant-design-vue css
          'https://cdn.bootcdn.net/ajax/libs/ant-design-vue/1.6.5/antd.min.css',
        ],
        js: [
          // vue
          'https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js',
          // vue-router
          'https://cdn.bootcdn.net/ajax/libs/vue-router/3.4.8/vue-router.min.js',
          // axios
          'https://cdn.bootcdn.net/ajax/libs/axios/0.21.0/axios.min.js',
          // ant-design-vue
          'https://cdn.bootcdn.net/ajax/libs/ant-design-vue/1.6.5/antd.min.js',
          // three.js
          // 'https://cdn.bootcdn.net/ajax/libs/three.js/r121/three.min.js',
        ]
      }
      config.plugin('html').tap(args => {
        args[0].cdn = cdn
        return args
      })
    }
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/routers/components'))
      .set('@api', resolve('src/api'))
      .set('@routers', resolve('src/routers'))
      .set('@js', resolve('src/js'))
      .set('@data', resolve('src/data'))
      .set('@C_CPP', resolve('src/C_CPP'));
  },
  configureWebpack: (config) => {
    config.module.rules.push({
      test: /\.(c|cpp)$/,
      use: [{
        loader: 'wasm-loader',
      }, {
        loader: 'c-cpp-modules-webpack-loader',
        options: {
          compiler: '-Os -s WASM=1 -s SIDE_MODULE=1'
        }
      }]
    })
    config.module.noParse = /benchmark/
  }
};