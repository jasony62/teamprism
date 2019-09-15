const { Base } = require('../table_base')

class Account extends Base {
    constructor({ db, id = 'uid', debug = false }) {
        super('xxt_site_account', { db, id, debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['uid', 'siteid', 'nickname', 'unionid', 'headimgurl', 'is_wx_primary', 'is_qy_primary', 'is_reg_primary']
    }
}

module.exports = { Account, create: Account.create.bind(Account) }