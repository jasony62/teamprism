<template>
    <skeleton id="article" :site="site" :matter="matter"></skeleton>
</template>
<script>
import mixin from '@/ue/matter/_mixin/main'
import apis from '@/apis/matter/article'

export default {
    mixins: [mixin],
    methods: {
        async fetchApp() {
            let matter
            let params = this.$route.params
            try {
                if (params.appId) {
                    matter = await apis.getApp(params.appId)
                    this.site = matter.site
                    this.matter = matter
                }
            } catch (e) {
                this.$message({
                    message: e,
                    type: 'error',
                    duration: 60000,
                    showClose: true
                })
            } finally {
                this.loading = false
            }
        }
    }
}
</script>