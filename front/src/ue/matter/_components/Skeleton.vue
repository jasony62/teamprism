<template>
    <div class="skeleton">
        <div class="loading" v-if="loading">
            <div>Loading...</div>
        </div>
        <div v-else>
            <navbar-top></navbar-top>
            <div class="content">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3 col-md-push-9 col-xs-12">
                            <site-card :site="site"></site-card>
                            <div class="qrcode hidden-xs hidden-sm">
                                <canvas ref="matterQrcode"></canvas>
                            </div>
                        </div>
                        <div class="col-md-9 col-md-pull-3 col-xs-12">
                            <router-view :matter="matter" :user="user"></router-view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NavbarTop from '@/ue/matter/_components/NavbarTop.vue'
import SiteCard from '@/ue/matter/_components/SiteCard.vue'

import apis from '@/apis/site'

export default {
    props: ['site', 'matter', 'user'],
    components: {
        NavbarTop,
        SiteCard
    },
    mounted() {},
    watch: {
        matter: {
            async handler(nv) {
                if (nv && nv.id) {
                    let QRCode = require('qrcode')
                    let canvas = this.$refs.matterQrcode
                    if (canvas) QRCode.toCanvas(canvas, location.href)
                }
            }
        }
    }
}
</script>
<style lang="less">
@import '../../../assets/css/bootstrap.css';
</style>
<style lang='less' scoped>
.skeleton {
    background-color: #f5f5f5;
    .qrcode {
        text-align: center;
    }
}
</style>