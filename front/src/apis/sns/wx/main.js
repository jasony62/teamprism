import axios from '@/tms/apis/axios2'

export default {
    appid: function(siteid) {
        return new Promise(async (resolve, reject) => {
            try {
                let oResult = await axios.get(`/ue/api/sns/wx/appid?site=${siteid}`)
                resolve(oResult.data.result)
            } catch (e) {
                reject(e)
            }
        })
    }
}