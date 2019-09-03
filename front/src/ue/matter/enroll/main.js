import Vue from "vue"
import { setupAccessToken } from '@/tms/apis/axios2'
import Message from '@/tms/components/message'

import Main from "./Main.vue"
import router from "./router.js"

Vue.config.productionTip = false

Vue.prototype.$message = Message
// 全局的事件广播接收机制
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

new Vue({
    router,
    render: h => h(Main),
    mounted() {
        function onFail() {
            if (this.$router.currentRoute.name !== 'failure')
                this.$router.push('/ue/matter/enroll/failure')
            this.$eventHub.$emit('main-failed')
        }
        let { siteId, appId } = this.$route.params
        if (!siteId || !appId) {
            onFail()
        } else {
            setupAccessToken(siteId).then(() => {
                this.$eventHub.$emit('main-mounted')
            }).catch(e => {
                this.$message({
                    message: e.message,
                    type: 'error',
                    duration: 60000,
                    showClose: true
                })
                onFail()
            })
        }
    }
}).$mount("#app")