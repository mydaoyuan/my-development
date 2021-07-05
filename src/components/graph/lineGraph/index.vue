<template>
  <div id="screenArea" style="width: 100%;height: 100%;">
    <div id="main">
      <div id="MainCy"></div>
    </div>
    <div class="tp-foot">
      <div style="margin: 0 auto;margin-top: 7px;width:460px;">
        <div>
          <span class="fa fa-circle" style="color:#ff9e00"></span>
          <span>当前结点</span>
        </div>
        <div>
          <span class="fa fa-circle" style="color:#4ea2f0"></span>
          <span>企业</span>
        </div>
        <div>
          <span class="fa fa-circle" style="color:#FD485E"></span>
          <span>人员</span>
        </div>
        <div>
          <span class="fa fa-long-arrow-right" style="color:#fd485e"></span>
          <span>投资</span>
        </div>
        <div>
          <span class="fa fa-long-arrow-right" style="color:#4ea2f0;"></span
          ><span>任职</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import start from './index.js'
import DBJSON from './data.json'
export default {
  data () {
    return {
    }
  },
  mounted () {
    Promise.all([
      createdScript('/static/js/d3.v4.js'),
      createdScript('/static/js/cytoscape.js'),
      createdScript('/static/js/jquery.min.js')
    ]).then(() => {
      // 传入数据、和rootID
      start({ success: DBJSON }, DBJSON.results[0].data[0].graph.nodes[0].id)
    })
  }
}
function createdScript (scriptSrc) {
  // 插入script标签并监听加载
  return new Promise((resolve, reject) => {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = script.onreadystatechange = function () {
      if (
        !this.readyState ||
        this.readyState === 'loaded' ||
        this.readyState === 'complete'
      ) {
        resolve()
        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null
      }
    }
    script.src = scriptSrc
    head.appendChild(script)
  })
}

</script>

<style lang="less" scoped>
@import url('/static/js/font-awesome.min.css');
#main,
#MainCy {
  width: 100%;
  height: 100%;
  position: relative;
}
#main {
   canvas {
    left: 0;
  }
}
/*页脚*/
.tp-foot {
  width: 100%;
  height: 30px;
  position: absolute;
  bottom: 0px;
  border-top: #ccc 1px solid;
  background: white;
}
.tp-foot div > div {
  display: inline-block;
  margin-left: 30px;
}
.fa {
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.isEmyp {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  transform: translate(-50%, 50%);
}
</style>
