import Vue from "vue"
import VueVirtualScroller from 'vue-virtual-scroller'
import { setupAccessToken } from '@/tms/apis/axios2'
import Message from '@/tms/components/message'
import "@/assets/vue-virtual-scroller.css"

import Main from "./Main.vue"
import router from "./router.js"

Vue.use(VueVirtualScroller)

Vue.config.productionTip = false

Vue.prototype.$message = Message

async function initAxios() {
    try {
        await setupAccessToken()
    } catch (e) {
        alert(`初始化失败：${e}`)
    }
}
initAxios()

new Vue({
    router,
    render: h => h(Main)
}).$mount("#app")