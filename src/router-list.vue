<template>
  <div>
    <div v-for="item in routerList" :key="item.path">
      <div :class="['link-item',item.path === $route.path && 'current']" @click="link(item)">
        {{ (item.config && item.config.title) ||  item.name}}
      </div>
    </div>
    <div style="margin-top: 40px" class="link-item current">有偿开发\技术支持:</div>
    <div @click="addQQ"></div>
    <a :href="`tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=${qq}`"  >QQ: {{qq}}</a>
  </div>
</template>

<script>
import router from './router/index'
const qq = process.env.VUE_APP_QQ
export default {
  data () {
    return {
      qq: qq
    }
  },
  computed: {
    routerList () {
      const list = router.options.routes

      return list.filter(item => {
        return (!item.config || item.config.show !== false)
      })
    }
  },
  methods: {
    link (cur) {
      this.$router.push(cur.path)
    },
    addQQ () {
      window.open('tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=1570915261&website=www.oicqzone.com')
    }
  }
}
</script>

<style lang="less" scoped>
.link-item {
  cursor: pointer;
}
.current {
  color: #3ba776
}
</style>
