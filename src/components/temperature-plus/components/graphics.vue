<template>
  <div id="my_dataviz" style="width: 980px"></div>
</template>

<script>
import { init } from './temperature-chart/line'
import data from './temperature-chart/datas'
export default {
  props: {
    value: Object
  },
  data () {
    return {}
  },
  mounted () {
    init(data)
    // init(this.value)
    setTimeout(() => {
      this.$emit('done')
    })
  }
}
</script>

<style lang="less" scoped>
// body{
//   position: relative;
//   top:10;
// }
</style>
