<template>
  <tms-card class="matter-item" :thumb="matter.pic" :title="matter.title" :desc="matter.summary">
    <template slot="bottom">
      <span v-once>{{matter._createAt}}</span>
    </template>
  </tms-card>
</template>
<script>
import Vue from 'vue'
import { Flex, Card } from 'tms-vue-ui'
Vue.use(Flex).use(Card)

export default {
  props: ['matter']
}
</script>
<style lang="less">
.matter-item {
  height: 160px;
  padding: 8px 0;
  img {
    width: 144px;
    height: 144px;
    object-fit: cover;
  }
}
@media screen and (max-width: 768px) {
  .matter-item {
    height: 112px;
    padding: 8px 0;
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
    }
  }
}
</style>