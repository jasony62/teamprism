import { TmsAxios } from 'tms-vue'

export default {
    /**
     * 获得单图文
     *
     * @param {String} appId
     */
    skeleton(appId) {
        return TmsAxios.ins('api-ue').get(`/matter/article/get?app=${appId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))
    },
    /**
     * 获得单图文封面信息
     *
     * @param {String} appId
     */
    cover(appId) {
        return TmsAxios.ins('api-ue').get(`/matter/article/cover?app=${appId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))
    }
}