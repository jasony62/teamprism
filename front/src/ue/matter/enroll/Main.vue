<template>
    <div id="enroll">
        <div class="loading" v-if="loading">
            <div>Loading...</div>
        </div>
        <div v-else>
            <div>
                <router-link to="/guide">Go to Guide</router-link>
                <router-link to="/home">Go to Home</router-link>
            </div>
            <div>
                <router-view :app="app"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import qs from 'query-string'
import apis from '@/apis/matter/enroll'

export default {
    name: 'enroll',
    data() {
        return { loading: true, app: { title: 'loading' } }
    },
    mounted() {
        this.fetchApp()
    },
    methods: {
        async fetchApp() {
            let params = qs.parse(location.search)
            try {
                if (params.app) {
                    let app = await apis.getApp(params.app)
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

<style>
#main {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
