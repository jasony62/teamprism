import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得单图文
     * 
     * @param {String} appId 
     */
    getApp(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/article/app?app=${appId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
}