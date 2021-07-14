<template>
  <div id="screenArea">
    <div id="main" class="bgclass">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1910"
        height="396"
        style="fill: none; pointer-events: all;"
      ></svg>
    </div>
  </div>
</template>

<script>
import mapInit from './map'
import STATIC_DATA from './data'
const d3Loding = () => import('../../../assets/d3.v5.min.js')
export default {
  data () {
    return {
    }
  },
  mounted () {
    d3Loding().then((res) => {
      window.d3 = res
      mapInit(STATIC_DATA)
    })
  }
}
</script>

<style lang="less" scoped>
.bgclass {
  width: 100%;
  height: 100%;
}
</style>
