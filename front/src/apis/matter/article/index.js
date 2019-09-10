import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得单图文
     * 
     * @param {String} appId 
     */
    skeleton(appId) {
        return axios.get(`/ue/api/matter/article/get?app=${appId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))
    }
}