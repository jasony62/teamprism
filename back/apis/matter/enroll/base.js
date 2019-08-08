const { Api, ResultData, ResultObjectNotFound } = require('../../../tms/api')
const User = require('../../../models/matter/enroll/user')

class Base extends Api {
    constructor(...args) {
        super(...args)
    }
    /**
	 * 获得当前用户的完整信息
	 * 1、活动中指定的用户昵称
	 * 2、用户在活动中所属的分组
	 */
    async getUser(oApp, oEnrolledData = null) {
        let who = await this.client.data
		let modelUsr = new User();
		let oUser = await modelUsr.detail(oApp, who, oEnrolledData);

		return oUser;
    }
    /**
     * 
     */
    async checkEntryRule2() {
        
    }
}

module.exports = Base