import Vue from "vue"
import { setupAccessToken } from '@/tms/apis/axios2'
import Message from '@/tms/components/message'

import Main from "./Main.vue"
import router from "./router.js"

Vue.config.productionTip = false

Vue.prototype.$message = Message

async function initAxios(siteId) {
    try {
        await setupAccessToken(siteId)
    } catch (e) {
        alert(`初始化失败：${e}`)
    }
}

new Vue({
    router,
    render: h => h(Main),
    created: async function() {
        await initAxios(this.$route.params.siteId)
    }
}).$mount("#app")