import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得频道
     * 
     * @param {String} appId 
     */
    getApp(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/link/get?app=${appId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
}