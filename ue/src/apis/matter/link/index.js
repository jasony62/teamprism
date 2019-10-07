import { TmsAxios } from 'tms-vue'

export default {
  /**
   * 获得链接
   *
   * @param {String} appId
   */
  skeleton(appId) {
    return TmsAxios.ins('api-ue')
      .get(`/matter/link/get?app=${appId}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  },
  /**
   * 获得链接封面信息
   *
   * @param {String} appId
   */
  cover(appId) {
    return TmsAxios.ins('api-ue')
      .get(`/matter/link/cover?app=${appId}`)
      .then(rst => rst.data.result)
      .catch(err => Promise.reject(err))
  }
}
