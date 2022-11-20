import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartView from '../components/chartView.vue'
import Graphics from '../components/temperature-plus/components/graphics'
import Printgraphics from '../components/temperature-plus/print'
import PrintView from '../components/printView.vue'
import TreeGraph from '../components/graph/treeGraph/graph.vue'
import LineGraph from '../components/graph/lineGraph/index.vue'
import MapGraph from '../components/graph/mapGraph/map.vue'
const { VUE_APP_PATH } = process.env
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ChartView',
    component: ChartView
  },
  {
    path: '/treeGraph',
    name: 'TreeGraph',
    component: TreeGraph
  },
  {
    path: '/lineGraph',
    name: 'LineGraph',
    component: LineGraph
  },
  {
    path: '/mapGraph',
    name: 'MapGraph',
    component: MapGraph
  },
  {
    path: '/printgraphics',
    name: 'printgraphics',
    component: PrintView
  },
  {
    path: '/graphicsPuls',
    name: 'graphicsPuls',
    component: Graphics
  },
  {
    path: '/printgraphicsPuls',
    name: 'printgraphicsPuls',
    component: Printgraphics
  }
]

const router = new VueRouter({
  base: VUE_APP_PATH,
  mode: 'history',
  routes
})

export default router
