<template>
    <skeleton id="link" :site="site" :matter="matter" :user="user"></skeleton>
</template>
<script>
import mixin from '@/ue/matter/_mixin/main'
import apis from '@/apis/matter/link'

export default {
    mixins: [mixin],
    methods: {
        async fetchApp() {
            let params = this.$route.params
            try {
                if (params.appId) {
                    let matter = await apis.getApp(params.appId)
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
<style lang="less" scoped>
body {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
}
</style>
