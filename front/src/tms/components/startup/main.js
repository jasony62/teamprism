import Vue from "vue"
import { setupAccessToken } from '@/tms/apis/axios2'
import Message from '@/tms/components/message'

function onFailure() {
    this.$eventHub.$emit('main-failed')
}

const oDefaultOptions = {
    mounted() {
        let { siteId } = this.$route.params
        if (!siteId) {
            onFailure.call(this)
        } else {
            setupAccessToken(siteId).then(() => {
                this.$eventHub.$emit('main-loaded')
            }).catch(e => {
                this.$message({
                    message: e.message,
                    type: 'error',
                    duration: 60000,
                    showClose: true
                })
                onFailure.call(this)
            })
        }
    }
}

Vue.config.productionTip = false

Vue.prototype.$message = Message
// 全局的事件广播接收机制
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()

class TmsVue extends Vue {
    constructor(oAppOptions) {
        let oOptions = {}
        Object.assign(oOptions, oDefaultOptions, oAppOptions)
        super(oOptions)
    }
}

export default TmsVue