import Vue from "vue"
import { setupAccessToken } from '@/tms/apis/axios2'

import Main from "./Main.vue"
import router from "./router.js"

Vue.config.productionTip = false

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