<template>
  <div class="hello">
    <input type="button" value="打印" @click="printGraph()">
    <Graphics v-if="value" :value="value"></Graphics>
    <h1 v-else>接口请求数据中</h1>
  </div>
</template>

<script>
import Graphics from './temperature/graphics'
import dataModel from './data'
let PRINT_ID = 0
export default {
  name: 'HelloWorld',
  components: {
    Graphics
  },
  data () {
    return {
      value: null
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 模拟后端数据请求
    getData () {
      setTimeout(() => {
        this.value = dataModel
      }, 1000)
    },
    // 打印体温单
    printGraph () {
      // 打印单周还是打印全部
      const weekList = [this.value]
      window.localStorage.setItem('printItemData', JSON.stringify(weekList))
      const iframe = document.createElement('iframe')
      const id = 'print_' + PRINT_ID++
      iframe.setAttribute(
        'style',
        'position:absolute;width:0px;height:0px;border: 0;'
      )
      iframe.setAttribute('id', id)
      iframe.setAttribute('src', this.computedPrintSrc(id))
      console.log('printGraph', id)
      document.body.appendChild(iframe)
    },
    // 计算需要跳转到的打印地址
    computedPrintSrc (id) {
      const path = `/printgraphics?id=${id}`
      const topLoc = window.top.location
      const port = topLoc.port ? `:${topLoc.port}` : ''
      const href = topLoc.protocol + '//' + topLoc.hostname + port + path
      return href
    }
  }
}
</script>
