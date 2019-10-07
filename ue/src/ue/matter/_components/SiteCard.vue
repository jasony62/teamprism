<template>
  <van-panel class="site-card" :title="site.name">
    <van-cell class="summary">
      <tms-text :lines-sm="2">{{site.summary}}</tms-text>
    </van-cell>
  </van-panel>
</template>
<script>
import Vue from 'vue'
import { Panel, Cell } from 'vant'
import { Text } from 'tms-vue-ui'
Vue.use(Panel)
  .use(Cell)
  .use(Text)

export default {
  props: {
    site: {
      type: Object,
      default: function() {
        return { name: '', summary: '' }
      }
    }
  }
}
</script>