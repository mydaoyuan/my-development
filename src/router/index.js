import Vue from 'vue'
import VueRouter from 'vue-router'
import ChartView from '../components/chartView.vue'
import PrintView from '../components/printView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ChartView',
    component: ChartView
  },
  {
    path: '/printgraphics',
    name: 'printgraphics',
    component: PrintView
  }
]

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes
})

export default router
