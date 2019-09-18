import axios from '@/tms/apis/axios2'

export default {
    /**
     * 获得记录
     * 
     * @param {String} appId 
     * @param {String} ek  
     */
    getRecord(appId, ek) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/ue/matter/enroll/record/get?app=${appId}&ek=${ek}`).then(rst => {
                resolve(rst.data.result)
            }).catch(err => {
                reject(err)
            })
        })
    }
}