<template>
    <div id="content">
        <div class="media-list">
            <matter-item :matter="m" v-for="m in matters" :key="m.id" :click="gotoMatter(m)"></matter-item>
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
    mounted() {},
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
<style lang="less" scoped>
.content {
    background-color: #fff;
}
</style>