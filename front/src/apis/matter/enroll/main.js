import axios2 from '@/apis/axios2'

export default {
    getEntryRule: async function(appId) {
        let axios = await axios2()
        return axios.get(`/ue/api/matter/enroll/entryRule?app=${appId}`)
    }
}