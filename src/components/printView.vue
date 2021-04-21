<template>
  <Graphics
    v-if="graphicsDataDone"
    :value="resInfo"
    @done="printPage"
    print
  ></Graphics>
</template>

<script>
import Graphics from './temperature/graphics'
function removeIframe (id) {
  var child = window.parent.document.getElementById(id)
  child.parentElement.removeChild(child)
}
export default {
  components: {
    Graphics
  },
  data () {
    return {
      printData: [],
      resInfo: {},
      graphicsDataDone: false,
      // 当前页面是否完成打印的reslove函数
      printPromiseResolve: null
    }
  },
  mounted () {
    const printData = window.localStorage.getItem('printItemData')
    this.printData = JSON.parse(printData)
    this.addPrintEvent()
    this.runTask()
  },
  methods: {
    addPrintEvent () {
      window.addEventListener('afterprint', () => {
        this.printPromiseResolve()
      })
    },
    async runTask () {
      const weeks = this.printData
      for (let index = 0; index < weeks.length; index++) {
        const week = weeks[index]
        await this.getData(week)
      }
      try {
        removeIframe(this.$route.query.id)
      } catch (error) {
        window.location.href = 'about:blank'
      }
    },
    printPage () {
      window.print()
    },
    async getData (curWeekInfo) {
      // 获取对应的图信息
      this.resInfo = Object.freeze(curWeekInfo)
      if (this.graphicsDataDone) {
        this.graphicsDataDone = false
      }
      await setTime(10)
      this.graphicsDataDone = true
      return new Promise((resolve) => {
        this.printPromiseResolve = resolve
      })
    }
  }
}

function setTime (num) {
  return new Promise((resolve) => {
    setTimeout(resolve, num)
  })
}
</script>

<style>
@page {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
