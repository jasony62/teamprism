<template>
    <div id="content">
        <div class="container">
            <div class="row">
                <div class="col-md-3 col-md-push-9 col-xs-12">
                    <div class="qrcode hidden-xs hidden-sm">
                        <canvas ref="matterQrcode"></canvas>
                    </div>
                </div>
                <div class="matters col-md-9 col-md-pull-3 col-xs-12">
                    <div class="media-list">
                        <matter-item
                            :matter="m"
                            v-for="m in matters"
                            :key="m.id"
                            :click="gotoMatter(m)"
                        ></matter-item>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import MatterItem from '@/ue/matter/_components/MatterItem.vue'

import apis from '@/apis/matter/channel'

export default {
    props: {
        matter: {
            type: Object,
            default: () => {
                return { title: 'wait main loading...' }
            }
        }
    },
    data() {
        return {
            matters: null
        }
    },
    components: {
        MatterItem
    },
    computed: {
        channelId() {
            return this.matter.id
        }
    },
    mounted() {
        let QRCode = require('qrcode')
        let canvas = this.$refs.matterQrcode
        if (canvas) QRCode.toCanvas(canvas, location.href)
    },
    methods: {
        gotoMatter(oMatter) {}
    },
    watch: {
        channelId: {
            async handler(nv) {
                try {
                    if (nv) {
                        let matters = await apis.mattersGet(nv)
                        let moment = require('moment')
                        matters.forEach(m => {
                            m._createAt = moment(m.create_at * 1000).format(
                                'YYYY-MM-DD'
                            )
                        })
                        this.matters = matters
                    }
                } catch (e) {
                    this.$message({
                        message: e,
                        type: 'error',
                        duration: 60000,
                        showClose: true
                    })
                }
            },
            immediate: true
        }
    }
}
</script>