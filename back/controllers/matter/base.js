const _ = require('underscore')
const { TpCtrl } = require('../../tms/ctrl')

class Base extends TpCtrl {
    constructor(...args) {
        super(...args)
    }
    /**
     * 检查进入规则
     */
    async entryCheck(entryRule) {
        let userid = this.client.id
        let dmRule = this.model('matter/entry_rule')
        dmRule.rule = entryRule
        let result = await dmRule.check(userid)
        if (result.size === 0)
            return false

        return _.object([...result.keys()], [...result.values()])
    }
}

module.exports = Base