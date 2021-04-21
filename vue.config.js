// const path = require('path')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
module.exports = {
  productionSourceMap: false,
  publicPath: '/temperature/',
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/temperature/'
  //   : '/',
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '三测单体温单体温图',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  }
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     // 为生产环境修改配置...
  //     return {
  //       plugins: [
  //         // 预渲染配置
  //         new PrerenderSPAPlugin({
  //           // 要求-给的WebPack-输出应用程序的路径预渲染。
  //           staticDir: path.join(__dirname, 'dist'),
  //           // 必需，要渲染的路线。
  //           routes: ['/']
  //           // 必须，要使用的实际渲染器，没有则不能预编译
  //           // renderer: new Renderer({
  //           //   headless: false, // 渲染时显示浏览器窗口。对调试很有用。
  //           //   // 等待渲染，直到检测到指定元素。
  //           //   // 例如，在项目入口使用`document.dispatchEvent(new Event('custom-render-trigger'))`
  //           //   renderAfterDocumentEvent: 'render-event'
  //           // }),
  //           // renderAfterTime: 5000
  //         })
  //       ]
  //     }
  //   } else {
  //     // 为开发环境修改配置...
  //     return {}
  //   }
  // }
}
