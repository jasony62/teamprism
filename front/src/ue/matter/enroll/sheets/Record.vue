<template>
    <div id="record">
        <div>app.title: {{app.title}}</div>
        <div>Record</div>
        <div>
            <router-link :to="{name:'record-cowork'}">Go to Cowork</router-link>
        </div>
        <div>
            <router-link :to="{name:'record-input'}">Go to Input</router-link>
        </div>
        <div>
            <router-view :app="app" :record="record"></router-view>
        </div>
    </div>
</template>
<script>
import { Record as RecApis } from '@/apis/matter/enroll'

export default {
    props: ['ek', 'app'],
    mounted() {},
    computed: {
        appid() {
            return this.app.id
        }
    },
    watch: {
        appid: {
            async handler(nv) {
                if (nv) this.fetchRecord(nv)
            },
            immediate: true
        }
    },
    methods: {
        async fetchRecord(appid) {
            try {
                let record = await RecApis.getRecord(appid, this.ek)
                this.record = record
            } catch (e) {
                this.$message({
                    message: e,
                    type: 'error',
                    duration: 60000,
                    showClose: true
                })
            }
        }
    }
}
</script>