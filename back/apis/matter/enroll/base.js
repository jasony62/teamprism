const Api = require('../../../tms/api')
const utilities =  global.utilities

class Base extends Api {
    constructor(who) {
        super(who)
    }
    /**
	 * 获得当前用户的完整信息
	 * 1、活动中指定的用户昵称
	 * 2、用户在活动中所属的分组
	 */
    async getUser(oApp, oEnrolledData = null) {
		let modelUsr = utilities.model('matter\\enroll\\user');
		let oUser = await modelUsr.detail(oApp, this.who, oEnrolledData);

		return oUser;
    }
    /**
     * 
     */
    async checkEntryRule2() {
        
    }
}

module.exports = function (who) {
    return new Base(who)
}