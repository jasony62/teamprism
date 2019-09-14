const { Base: MatterBase } = require('../base')

class User extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_enroll_user', { debug })
    }

	async detail(oApp, who, oEnrolledData = null) {
		let oUser = who;

        return oUser;
    }
}

function create({ debug = false } = {}) {
    return new User({ debug })
}

module.exports = { User, create }