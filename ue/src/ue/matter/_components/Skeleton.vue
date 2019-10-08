<template>
  <div class="skeleton">
    <div class="loading" v-if="loading">
      <div>Loading...</div>
    </div>
    <div v-else>
      <tms-frame
        :display="{header:true,footer:true,right:true}"
        :display-sm="{header:true,footer:true,right:true}"
        main-direction-sm="column-reverse"
        center-margin-sm="8px 0 0"
      >
        <template v-slot:header>
          <navbar-top></navbar-top>
        </template>
        <template v-slot:center>
          <router-view :matter="matter"></router-view>
        </template>
        <template v-slot:right>
          <tms-flex direction="column" align-items="center">
            <site-card :site="site"></site-card>
            <slot name="matterCard"></slot>
            <div class="qrcode hidden-sm">
              <canvas ref="matterQrcode"></canvas>
            </div>
            <div class="hidden-sm">
              <slot name="others"></slot>
            </div>
          </tms-flex>
        </template>
      </tms-frame>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Flex, Frame } from 'tms-vue-ui'
Vue.use(Flex).use(Frame)

import NavbarTop from '@/ue/matter/_components/NavbarTop.vue'
import SiteCard from '@/ue/matter/_components/SiteCard.vue'

export default {
  props: ['site', 'matter'],
  components: {
    NavbarTop,
    SiteCard
  },
  watch: {
    matter: {
      async handler(nv) {
        if (nv && nv.id) {
          let QRCode = require('qrcode')
          let canvas = this.$refs.matterQrcode
          if (canvas) QRCode.toCanvas(canvas, location.href)
        }
      }
    }
  }
}
</script>
<style lang="less">
.tms-frame {
  align-items: center;
  .tms-frame__main {
    width: 960px;
  }
}
@media (max-width: 768px) {
  .tms-frame {
    .tms-frame__main {
      width: 100%;
    }
  }
  .hidden-sm {
    display: none !important;
  }
}
</style>