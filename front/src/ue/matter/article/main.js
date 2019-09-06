import TmsVue from "@/tms/components/startup"

import Main from "./Main.vue"
import router from "./router.js"

new TmsVue({
    router,
    render: h => h(Main),
}).$mount("#app")