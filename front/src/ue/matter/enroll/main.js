import Vue from "vue"
import Enroll from "./Main.vue"
import { setupAccessToken } from '@/tms/apis/axios2'

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
    render: h => h(Enroll)
}).$mount("#app")