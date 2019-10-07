import { TmsAxios } from 'tms-vue'

export default {
  /**
   * 获得频道
   *
   * @param {String} appId
   */
  skeleton(appId) {
    return TmsAxios.ins('api-ue')
      .get(`/matter/channel/get?app=${appId}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  /**
   * 获得频道下的素材（支持批量调用）
   *
   * @param {*} channelId
   * @param {BatchArg} batch
   */
  mattersGet(channelId, batch) {
    return TmsAxios.ins('api-ue')
      .get(`/matter/channel/mattersGet?app=${channelId}&batch=${batch}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  }
}
