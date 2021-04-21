import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { init as ConsoleBan } from 'console-ban'

Vue.config.productionTip = false

ConsoleBan({
  // 重写 body 为字符串
  // callback: () => {
  //   document.write('<h1> QQ:853839625 获取Vue源码 </h1>')
  // },
  write: '<h1> QQ:853839625 获取Vue源码 </h1>'
})

new Vue({
  router,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount('#app')
