const { Base: MatterBase } = require('../base')

class User extends MatterBase {
    constructor({ db, debug = false } = {}) {
        super('xxt_enroll_user', { db, debug })
    }

	async detail(oApp, who, oEnrolledData = null) {
		let oUser = who;

        return oUser;
    }
}

module.exports = { User, create: User.create.bind(User) }