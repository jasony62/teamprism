<template>
    <div id="guide">
        <section class="app">
            <div>活动的描述信息</div>
            <div>{{app.title}}</div>
        </section>
        <section class="entry-rule">
            <div>
                <span>获取活动进入规则，根据进入规则提示用户进行下一步操作</span>
            </div>
            <div>
                <button id="wxOAuth2" @click="wxOAuth2()">微信网页授权获得用户信息</button>
            </div>
        </section>
    </div>
</template>
<script>
import apis from '@/apis/matter/enroll/main'
import apisWx from '@/apis/sns/wx/main'

export default {
    name: 'guide',
    props: {
        app: {
            type: Object,
            default: () => {
                return { title: 'wait main loading...' }
            }
        }
    },
    data() {
        return {}
    },
    computed: {
        appid() {
            return this.app.id
        }
    },
    watch: {
        appid: {
            async handler(nv) {
                if (nv) {
                    try {
                        let rule = await apis.checkEntryRule(this.app.id)
                        this.$message({
                            message: rule,
                            duration: 60000,
                            showClose: true
                        })
                    } catch (e) {
                        this.$message({ message: e, type: 'error' })
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        wxOAuth2: function() {
            try {
                let appid = apisWx.appid(this.app.siteid)
                if (appid) {
                    const redirect_uri = encodeURIComponent(
                        `http://${location.host}/ue/wx/oauth2`
                    )
                    const state = encodeURIComponent(location.href)
                    const uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
                    location.href = uri
                }
            } catch (e) {
                this.$message({ message: e, type: 'error' })
            }
        }
    }
}
</script>
<style lang='scss' scope>
#guide {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
