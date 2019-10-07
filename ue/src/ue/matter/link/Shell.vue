<template>
  <skeleton id="link" :site="site" :matter="matter">
    <template v-slot:matterCard>
      <matter-card :matter="matter"></matter-card>
    </template>
    <template v-slot:others v-if="matter&&matter.config">
      <van-panel title="相关资料">
        <van-cell v-for="app in matter.config.nav.app" :key="app.id">
          <a href="javascript:void(0)" v-on:click="gotoNavApp(app)">
            <tms-text :lines="1">{{app.title}}</tms-text>
          </a>
        </van-cell>
      </van-panel>
    </template>
  </skeleton>
</template>
<script>
import Vue from 'vue'
import { Panel, Cell } from 'vant'
import { Text } from 'tms-vue-ui'
Vue.use(Panel)
  .use(Cell)
  .use(Text)

import mxnShell from '@/ue/matter/_mixin/shell'
import MatterCard from '@/ue/matter/_components/MatterCard.vue'
import apis from '@/apis/matter/link'

export default {
  mixins: [mxnShell],
  components: {
    MatterCard
  },
  methods: {
    apis() {
      return apis
    }
  }
}
</script>