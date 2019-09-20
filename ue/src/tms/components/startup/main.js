import Vue from "vue"
import { TmsEventPlugin, TmsAxiosPlugin } from "tms-vue"
import Message from '@/tms/components/message'

function onFailure() {
    this.$tmsEmit('main-failed')
}

const oDefaultOptions = {
    mounted() {
        let { siteId } = this.$route.params
        if (!siteId) {
            onFailure.call(this)
        } else {
            Vue.TmsAxios({ name: 'auth', config: { baseURL: '/ue/auth/' } }).get(`/token?site=${siteId}`)
                .then((res) => {
                    let { access_token: accessToken, expire_in } = res.data.result
                    // 记录过期时间
                    let expireAt = parseInt(new Date / 1000) + expire_in - 120
                    let rule = Vue.TmsAxios.newInterceptorRule({
                        requestParams: new Map([
                            ['access_token', accessToken]
                        ]),
                        onRetryAttempt: (res, rule) => {
                            if (res.data.code === 20001)
                                return Vue.TmsAxios('auth').get(`/token?site=${siteId}`)
                                    .then(() => {
                                        let { access_token } = res.data.result
                                        rule.requestParams.set('access_token', access_token)
                                        return true
                                    }).catch((err) => Promise.reject(err))
                            return Promise.resolve(false)
                        }
                    })
                    Vue.TmsAxios({ name: 'api-ue', rules: [rule], config: { baseURL: '/api/ue/' } })
                    this.$tmsEmit('main-loaded')
                })
        }
    }
}

Vue.config.productionTip = false

Vue.prototype.$message = Message

// 全局的事件广播接收机制
Vue.use(TmsEventPlugin)
Vue.use(TmsAxiosPlugin)

class TmsVue extends Vue {
    constructor(oAppOptions) {
        let oOptions = {}
        Object.assign(oOptions, oDefaultOptions, oAppOptions)
        super(oOptions)
    }
}

export default TmsVue