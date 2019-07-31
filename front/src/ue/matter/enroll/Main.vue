<template>
    <div id="enroll">
        <div>记录活动</div>
        <div>
            <button id="checkEntryRule" v-on:click="checkEntryRule">第一步：获取活动进入规则，根据进入规则提示用户进行下一步操作</button>
        </div>
        <div>
            <button id="wxOAuth2" v-on:click="wxOAuth2">微信网页授权获得用户信息</button>
        </div>
    </div>
</template>

<script>
import apiApp from '@/apis/matter/enroll/main'
import apiWx from '@/apis/sns/wx/main'
import qs from 'query-string'
import Vue from 'vue'
import NoticeBox from '@/tms/components/NoticeBox'

export default {
    name: 'enroll',
    methods: {
        checkEntryRule: () => {
            let params = qs.parse(location.search)
            if (params.app) {
                apiApp.getEntryRule(params.app).then(rsp => {
                    const nbox = new Vue(NoticeBox).$mount()
                    nbox.confirm(JSON.stringify(rsp), [
                        { label: '关闭', value: 'close' }
                    ])
                })
            }
        },
        wxOAuth2: async () => {
            try {
                let params = qs.parse(location.search)
                const { site } = params
                let appid = await apiWx.appid(site)
                const redirect_uri = encodeURIComponent(
                    `http://${location.host}/ue/wx/oauth2?site=${site}`
                )
                const state = encodeURIComponent(location.href)
                const uri = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
                location.href = uri
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style>
#enroll {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
