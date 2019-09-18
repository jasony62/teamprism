import axios from '@/tms/apis/axios2'

export default {
    /**
     * @param {String} siteId 
     */
    getSite(id) {
        return axios.get(`/api/ue/site/get?site=${id}`)
            .then(rst => rst.data.result)
            .catch(err => new Promise.reject(err))
    }
}