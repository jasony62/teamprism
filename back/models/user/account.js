const { Base } = require('../table_base')

class Account extends Base {
    constructor({ id = 'uid', debug = false } = {}) {
        super('xxt_site_account', { id, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['uid', 'siteid', 'nickname', 'unionid', 'headimgurl', 'is_wx_primary', 'is_qy_primary', 'is_reg_primary']
    }
}

function create({ debug = false } = {}) {
    return new Account({ debug })
}

module.exports = { Account, create }