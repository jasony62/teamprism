<template>
    <div id="link">
        <div class="loading" v-if="loading">
            <div>Loading...</div>
        </div>
        <div v-else>
            <router-view :matter="matter" :user="user"></router-view>
        </div>
    </div>
</template>
<script>
import apis from '@/apis/matter/link'

export default {
    data() {
        return { loading: true, matter: { title: 'loading' }, user: {} }
    },
    mounted() {
        this.$eventHub.$on('main-mounted', () => {
            this.fetchApp()
        })
        this.$eventHub.$on('main-failed', () => {
            this.loading = false
        })
    },
    methods: {
        async fetchApp() {
            let params = this.$route.params
            try {
                if (params.appId) {
                    let result = await apis.getApp(params.appId)
                    this.matter = result
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
