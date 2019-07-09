import Vue from "vue"
import Enroll from "./Main.vue"

Vue.config.productionTip = false

new Vue({
    render: h => h(Enroll)
}).$mount("#app")