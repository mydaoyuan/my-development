<template>
  <div id="app">
    <RouterList class="router-list"></RouterList>
    <router-view/>
  </div>
</template>
<script>
import RouterList from './router-list.vue'
export default {
  components: {
    RouterList
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100vw;
  height: 100vh;
  display: flex;

}
.router-list {
  flex-basis: 150px;
  flex-shrink: 0;
}
</style>
