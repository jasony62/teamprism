import axios from '@/tms/apis/axios2'

export default {
    getEntryRule: async function(appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/enroll/entryRule?app=${appId}`).then(res => {
                resolve(res.data.entryRule)
            }).catch(err => {
                reject(err)
            })
        })
    }
}