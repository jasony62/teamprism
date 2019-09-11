import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得频道
     * 
     * @param {String} appId 
     */
    skeleton(appId) {
        return axios.get(`/ue/api/matter/link/get?app=${appId}`)
            .then(rst => rst.data.result)
            .catch(err => Promise.reject(err))

    }
}