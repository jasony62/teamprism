<template>
  <skeleton id="link" :site="site" :matter="matter">
    <template v-slot:matterCard>
      <matter-card :matter="matter"></matter-card>
    </template>
  </skeleton>
</template>
<script>
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