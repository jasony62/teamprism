const {
    DbModel
} = require('../../../tms/model')
const utilities =  global.utilities

class User extends DbModel {
	async detail(oApp, who, oEnrolledData = null) {
		let oUser = who;

        return oUser;
    }
}

module.exports = function () {
    return new User()
}