import Vue from "vue"
import Enroll from "./Main.vue"
import axios2 from '@/apis/axios2'

Vue.config.productionTip = false

async function initAxios() {
    try {
        await axios2()
    } catch (e) {
        console.log(e)
    }
}
initAxios()

new Vue({
    render: h => h(Enroll)
}).$mount("#app")