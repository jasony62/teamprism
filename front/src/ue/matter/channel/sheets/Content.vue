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
                    <div class="media-item" v-for="m in matters" :key="m.id" :click="open(m)">
                        <div class="media-item-left">
                            <div
                                v-if="m.pic"
                                class="media-item-img"
                                v-bind:style="{'background-image':'url('+m.pic+')'}"
                            ></div>
                            <div v-if="!m.pic" class="media-item-img"></div>
                        </div>
                        <div class="media-item-body">
                            <div class="media-item-body-flexbox">
                                <div class="media-heading" v-once>{{m.title}}</div>
                                <div class="media-summary" v-once>{{m.summary}}</div>
                                <div class="media-attr">
                                    <div class="put_at">
                                        <span v-once>{{m.create_at}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        matter: {
            type: Object,
            default: () => {
                return { title: 'wait main loading...' }
            }
        }
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
    }
}
</script>
<style lang="less">
</style>