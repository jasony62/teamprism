<template>
  <van-panel class="matter-card" :title="matter.title">
    <div>
      <van-cell v-if="matter.hide_pic!=='Y'">
        <van-image :src="matter.pic" fit="contain"></van-image>
      </van-cell>
      <van-cell class="summary" :value="matter.summary"></van-cell>
    </div>
  </van-panel>
</template>
<script>
import Vue from 'vue'
import { Panel, Cell, Image } from 'vant'
Vue.use(Panel)
  .use(Cell)
  .use(Image)

export default {
  props: {
    matter: {
      type: Object,
      default: function() {
        return { title: '', pic: '', summary: '' }
      }
    }
  }
}
</script>