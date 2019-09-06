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

export default {
    props: ['site', 'matter', 'user'],
    components: {
        NavbarTop,
        SiteCard
    }
}
</script>