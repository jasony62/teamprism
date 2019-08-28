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
import apis from '@/apis/matter/enroll'
import { Notify } from 'vant'

export default {
    data() {
        return { loading: true, app: { title: 'loading' }, user: {} }
    },
    mounted() {
        this.fetchApp()
    },
    methods: {
        async fetchApp() {
            let params = this.$route.params
            try {
                if (params.appId) {
                    let result = await apis.getApp(this.$route.params.appId)
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
