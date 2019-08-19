import axios from '@/tms/apis/axios2'

export default {
    /* 获取所有类型的记录 */
    getList(type, appId) {
        return new Promise((resolve, reject) => {
            axios.get(`/ue/api/matter/enroll/repos/${type}/list?app=${appId}`).then(rst => {
                resolve(rst.data.result);
            }).catche(err => {
                reject(err);
            })
        })
    }

}