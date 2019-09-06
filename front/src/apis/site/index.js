import axios from '@/tms/apis/axios2'

export default {
    /**
     * @param {String} siteId 
     */
    getSite(id) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/site?site=${id}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    },
}