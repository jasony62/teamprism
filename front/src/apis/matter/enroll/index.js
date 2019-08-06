import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得记录活动
     * 
     * @param {String} appId 
     */
    getApp(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/enroll/get?app=${appId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
    /**
     * 指定活动的进入规则以及当前用户的匹配情况
     * 
     * @param {String} appId 
     */
    checkEntryRule(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/enroll/entryRule?app=${appId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    }
}