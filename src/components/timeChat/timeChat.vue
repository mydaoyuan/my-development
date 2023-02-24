<template>
    <iframe class="iframe" :src="src"></iframe>
</template>

<script>
const { VUE_APP_PATH } = process.env
export default {
  data () {
    return {
      src: VUE_APP_PATH + '/static/assets/timeChat.html'
    }
  }
}
</script>

<style lang="less" scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

</style>
