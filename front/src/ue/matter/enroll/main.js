import Vue from "vue"
import Enroll from "./Main.vue"
import axios2 from '@/apis/axios2'

Vue.config.productionTip = false

async function initAxios() {
    try {
        await axios2()
    } catch (e) {
        alert('初始化axios失败')
    }
}
initAxios()

new Vue({
    render: h => h(Enroll)
}).$mount("#app")