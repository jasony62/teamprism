import axios from 'axios'

export default {
    getEntryRule: function(appId) {
        return axios.get('/ue/api/matter/enroll/entryRule?app=' + appId + '&access_token=123')
    }
}