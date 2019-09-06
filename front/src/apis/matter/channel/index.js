import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得频道
     * 
     * @param {String} appId 
     */
    getApp(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/channel/app?app=${appId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
    mattersGet(channelId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/channel/mattersGet?app=${channelId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
}