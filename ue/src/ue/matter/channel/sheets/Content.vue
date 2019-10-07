<template>
  <div id="content">
    <van-list
      class="matter-list"
      immediate-check="false"
      v-model="loading"
      :finished="finished"
      @load="onLoadMatter"
    >
      <matter-item :matter="m" v-for="m in matters" :key="m.id" @click.native="gotoMatter(m)"></matter-item>
    </van-list>
  </div>
</template>
<script>
import Vue from 'vue'
import { List } from 'vant'
Vue.use(List)

import MatterItem from '@/ue/matter/_components/MatterItem.vue'

import apis from '@/apis/matter/channel'
import { Batch } from 'tms-vue'

export default {
  props: {
    matter: Object
  },
  data() {
    return {
      matters: [],
      loading: false,
      finished: false,
      batchMattersGet: null
    }
  },
  components: {
    MatterItem
  },
  mounted() {
    this.$tmsOn('shell-loaded', async channel => {
      try {
        this.batchMattersGet = new Batch(apis.mattersGet.bind(apis), channel.id)
        this.batchMattersGet.size = 12
        this.onLoadMatter()
      } catch (e) {
        this.$message({
          message: e.message,
          type: 'error',
          duration: 60000,
          showClose: true
        })
      }
    })
  },
  methods: {
    appendMatters(matters) {
      let moment = require('moment')
      matters.forEach(m => {
        m._createAt = moment(m.create_at * 1000).format('YYYY-MM-DD')
        this.matters.push(m)
      })
    },
    async onLoadMatter() {
      if (this.batchMattersGet && this.batchMattersGet.hasNext()) {
        let batchResult = await this.batchMattersGet.next()
        if (batchResult.result && batchResult.result.matters)
          this.appendMatters(batchResult.result.matters)
      }
      // 加载状态结束
      this.loading = false
    },
    gotoMatter(oMatter) {
      location.href = `/ue/matter/${oMatter.matter_type}/${oMatter.siteid}/${oMatter.matter_id}/content`
    }
  }
}
</script>
<style lang="less">
.matter-list {
  background: #fff;
  padding: 0 8px;
  .matter-item {
    .tms-card__title {
      font-weight: 700;
    }
    .tms-card__desc {
      color: #666;
    }
  }
  .matter-item + .matter-item {
    border-top: 1px solid #eee;
  }
}
</style>