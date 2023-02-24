import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartView from '../components/chartView.vue'
import Graphics from '../components/temperature-plus/components/graphics'
import Printgraphics from '../components/temperature-plus/print'
import PrintView from '../components/printView.vue'
import TreeGraph from '../components/graph/treeGraph/graph.vue'
import LineGraph from '../components/graph/lineGraph/index.vue'
import MapGraph from '../components/graph/mapGraph/map.vue'
import timeChat from '../components/timeChat/timeChat.vue'
const { VUE_APP_PATH } = process.env
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ChartView',
    component: ChartView,
    config: {
      title: '体温单'
    }
  },
  {
    path: '/treeGraph',
    name: 'TreeGraph',
    component: TreeGraph,
    config: {
      title: '组织结构图'
    }
  },
  {
    path: '/lineGraph',
    name: 'LineGraph',
    component: LineGraph,
    config: {
      title: '关系图'
    }
  },
  {
    path: '/mapGraph',
    name: 'MapGraph',
    component: MapGraph,
    config: {
      title: '穿透图'
    }
  },
  {
    path: '/printgraphics',
    name: 'printgraphics',
    component: PrintView,
    config: {
      show: false
    }
  },
  {
    path: '/graphicsPuls',
    name: 'graphicsPuls',
    component: Graphics,
    config: {
      title: '新体温单'
    }
  },
  {
    path: '/printgraphicsPuls',
    name: 'printgraphicsPuls',
    component: Printgraphics,
    config: {
      show: false
    }
  },
  {
    path: '/timeChat',
    name: 'timeChat',
    component: timeChat,
    config: {
      title: '患者时间轴',
      new: true
    }
  }
]

const router = new VueRouter({
  base: VUE_APP_PATH,
  mode: 'history',
  routes
})
console.log(router)
export default router
