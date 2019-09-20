import { TmsAxios } from 'tms-vue'

export default {
    /**
     * 获得频道
     * 
     * @param {String} appId 
     */
    skeleton(appId) {
        return TmsAxios.ins('api-ue').get(`/matter/channel/get?app=${appId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))
    },
    mattersGet(channelId) {
        return TmsAxios.ins('api-ue').get(`/matter/channel/mattersGet?app=${channelId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))
    }
}