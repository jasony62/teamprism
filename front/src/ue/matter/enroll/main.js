import Vue from "vue"
import { setupAccessToken } from '@/tms/apis/axios2'
import Message from '@/tms/components/message'

import Main from "./Main.vue"
import router from "./router.js"

Vue.config.productionTip = false

Vue.prototype.$message = Message

async function initAxios() {
    try {
        await setupAccessToken("359a703d0e7dcf8679182770d0fc219d")
    } catch (e) {
        alert(`初始化失败：${e}`)
    }
}
initAxios()

new Vue({
    router,
    render: h => h(Main)
}).$mount("#app")