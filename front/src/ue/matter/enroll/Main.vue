<template>
    <div id="enroll">
        <div class="loading" v-if="loading">
            <div>Loading...</div>
        </div>
        <div v-else>
            <router-view :app="app"></router-view>
        </div>
    </div>
</template>

<script>
import apis from '@/apis/matter/enroll'

export default {
    data() {
        return { loading: true, app: { title: 'loading' } }
    },
    mounted() {
        this.fetchApp()
    },
    methods: {
        async fetchApp() {
            let params = this.$route.params
            try {
                if (params.appId) {
                    let app = await apis.getApp(this.$route.params.appId)
                    this.app = app
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

<style scoped>
#main {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
