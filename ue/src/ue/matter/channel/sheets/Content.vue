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
        matter: Object
    },
    data() {
        return {
            matters: null
        }
    },
    components: {
        MatterItem
    },
    mounted() {
        this.$tmsOn('shell-loaded', async channel => {
            try {
                let matters = await apis.mattersGet(channel.id)
                let moment = require('moment')
                matters.forEach(m => {
                    m._createAt = moment(m.create_at * 1000).format(
                        'YYYY-MM-DD'
                    )
                })
                this.matters = matters
            } catch (e) {
                this.$message({
                    message: e,
                    type: 'error',
                    duration: 60000,
                    showClose: true
                })
            }
        })
    },
    methods: {
        gotoMatter(oMatter) {}
    }
}
</script>
<style lang="less" scoped>
.content {
    background-color: #fff;
}
</style>