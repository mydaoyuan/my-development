import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { init } from 'console-ban'

Vue.config.productionTip = false

if (process.env.NODE_ENV !== 'development') {
  init({
    write: `<h1> QQ:${process.env.VUE_APP_QQ} 获取帮助 </h1>`
  })
}

new Vue({
  router,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
  }
}).$mount('#app')
