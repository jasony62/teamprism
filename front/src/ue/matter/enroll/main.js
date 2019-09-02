import Vue from "vue"
import { setupAccessToken } from '@/tms/apis/axios2'
import Message from '@/tms/components/message'

import Main from "./Main.vue"
import router from "./router.js"

Vue.config.productionTip = false

Vue.prototype.$message = Message
// 全局的事件广播接收机制
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

async function initAxios(siteId) {
    console.log('ssss', siteId)
    try {
        await setupAccessToken(siteId)
    } catch (e) {
        alert(`初始化失败：${e}`)
    }
}

new Vue({
    router,
    render: h => h(Main),
    mounted: async function() {
        await initAxios(this.$route.params.siteId)
        this.$eventHub.$emit('main-mounted')
    }
}).$mount("#app")