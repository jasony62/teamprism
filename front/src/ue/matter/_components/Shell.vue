<template>
    <div>
        <div class="loading" v-if="loading">
            <div>Loading...</div>
        </div>
        <div v-else>
            <navbar-top></navbar-top>
            <site-card :site="site"></site-card>
            <router-view :matter="matter" :user="user"></router-view>
        </div>
    </div>
</template>
<script>
import NavbarTop from '@/ue/matter/_components/NavbarTop.vue'
import SiteCard from '@/ue/matter/_components/SiteCard.vue'

import apis from '@/apis/site'

export default {
    props: ['matter', 'user'],
    data() {
        return {
            site: {}
        }
    },
    components: {
        NavbarTop,
        SiteCard
    },
    mounted() {
        this.$eventHub.$on('main-mounted', () => {
            apis.getSite(this.$route.params.siteId).then(oSite => {
                this.site = oSite
                if (this.fetchApp) this.fetchApp()
            })
        })
        this.$eventHub.$on('main-failed', () => {
            this.loading = false
        })
    }
}
</script>
<style lang='less' scoped>
</style>