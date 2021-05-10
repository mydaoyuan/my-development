import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { init as ConsoleBan } from 'console-ban'

Vue.config.productionTip = false

ConsoleBan({
  write: `<h1> QQ:${process.env.VUE_APP_QQ} 获取Vue源码 </h1>`
})

new Vue({
  router,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount('#app')
