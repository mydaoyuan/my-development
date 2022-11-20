<template>
  <Graphics
    v-if="graphicsDataDone"
    :value="resInfo"
    @done="printPage"
    print
  ></Graphics>
</template>

<script>
import Graphics from './components/graphics'
import data from './components/temperature-chart/datas'
function removeIframe (id) {
  var child = window.parent.document.getElementById(id)
  child.parentElement.removeChild(child)
}
function setTime (num) {
  return new Promise(resolve => {
    setTimeout(resolve, num)
  })
}
export default {
  components: {
    Graphics
  },
  data () {
    return {
      printData: {},
      resInfo: {},
      graphicsDataDone: false,
      // 当前页面是否完成打印的reslove函数
      printPromiseReslove: null,
      dateClosed: {
        stopTime: true, // 控制结束日期
        stopNumber: true // 控制住院天数
      }
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
        this.printPromiseReslove()
      })
    },
    async runTask () {
      const weeks = this.printData.weekList
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
    // 获取每周数据
    async getData (curWeekInfo) {
      this.resInfo = data
      if (this.graphicsDataDone) {
        this.graphicsDataDone = false
      }
      await setTime(10)
      this.graphicsDataDone = true
      return new Promise(resolve => {
        this.printPromiseReslove = resolve
      })
    }
  }
}

</script>

<style>
@page {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
