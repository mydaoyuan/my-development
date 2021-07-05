<template>
  <div>
    <div id="box"></div>
  </div>
</template>

<script>
import TreeChart from './treeChart'
import STATIC_DATA from './data'
const d3Loding = () => import('../../../assets/d3.v3.min.js')
export default {
  data () {
    return {
    }
  },
  mounted () {
    d3Loding().then(() => {
      const data = STATIC_DATA
      var d3GenerationChart = new TreeChart(window.d3)
      d3GenerationChart.drawChart(data)
    })
  }
}

</script>

<style>
svg {
  cursor: all-scroll;
  /* border: solid 1px red; */
}

.centralText {
  font: 32px sans-serif;
  fill: #222;
}

.downwardNode text,
.upwardNode text {
  font: 20px sans-serif;
}

.downwardLink {
  fill: none;
  stroke: #ccc;
  stroke-width: 1px;
  opacity: 0.5;
}

.upwardLink {
  fill: none;
  stroke: #37592b;
  stroke-width: 1px;
  opacity: 0.5;
}
.isEmyp {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  transform: translate(-50%, 50%);
}
</style>
