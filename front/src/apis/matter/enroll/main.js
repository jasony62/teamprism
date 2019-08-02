import axios from '@/tms/apis/axios2'

export default {
    /**
     * 指定活动的进入规则以及当前用户的匹配情况
     * 
     * @param {*} appId 
     */
    checkEntryRule: async function(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/enroll/entryRule?app=${appId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    }
}