import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得频道
     * 
     * @param {String} appId 
     */
    skeleton(appId) {
        return axios.get(`/api/ue/matter/channel/get?app=${appId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))
    },
    mattersGet(channelId) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/ue/matter/channel/mattersGet?app=${channelId}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
}