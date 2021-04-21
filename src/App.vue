<template>
  <div id="app">
    <HelloWorld v-if="!needPrint" msg="Welcome to Your Vue.js App" />
    <Print v-if="needPrint"></Print>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Print from './components/printView'
export default {
  name: 'App',
  components: {
    HelloWorld,
    Print
  },
  data () {
    return {
      needPrint: false
    }
  },
  created () {
    // 只是为了区分打印还是展示
    if (location.search.includes('id')) {
      this.needPrint = true
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
