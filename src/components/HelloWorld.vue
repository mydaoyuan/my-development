<template>
  <div class="hello">
    <input type="button" value="打印" @click="printGraph()">
    <Graphics :value="value"></Graphics>
  </div>
</template>

<script>
import Graphics from './temperature/graphics'
import dataModel from './temperature/data'
let PRINT_ID = 0
export default {
  name: 'HelloWorld',
  components: {
    Graphics
  },
  data () {
    return {
      value: dataModel
    }
  },
  methods: {
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
