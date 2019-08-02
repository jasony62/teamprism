<template>
    <div id="main">
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

export default {
    name: 'main',
    data() {
        return { loading: true, app: { title: 'loading' } }
    },
    mounted() {
        this.fetchApp()
    },
    methods: {
        fetchApp() {
            setTimeout(() => {
                let params = qs.parse(location.search)
                let loadedApp = {
                    id: params.app,
                    title: '这是一个记录活动',
                    entryRule: { scope: 'group' }
                }
                this.app = loadedApp
                this.loading = false
            }, 1000)
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
