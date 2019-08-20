<template>
    <div id="enroll">
        <div class="loading" v-if="loading">
            <div>Loading...</div>
        </div>
        <div v-else>
            <router-view :app="app" :user="user"></router-view>
        </div>
    </div>
</template>

<script>
import qs from 'query-string'
import apis from '@/apis/matter/enroll'

export default {
    name: 'enroll',
    data() {
        return { loading: true, app: { title: 'loading' }, user: {} }
    },
    mounted() {
        this.fetchApp()
    },
    methods: {
        async fetchApp() {
            let params = qs.parse(location.search)
            try {
                if (params.app) {
                    let result = await apis.getApp(params.app)
                    this.app = result.app
                    this.user = result.user
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

<style>
#main {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
