const { Base } = require('./base')
/**
 * 进入规则
 */
const FIELD_ENTRY_RULE = Symbol('field_entry_rule')

class Rule extends Base {
    constructor({ db, debug = false } = {}) {
        super('', { db, debug })
    }
    get rule() {
        return this[FIELD_ENTRY_RULE]
    }
    set rule(entryRule) {
        this[FIELD_ENTRY_RULE] = entryRule
    }
    get scope() {
        if (!this.rule || typeof this.rule !== 'object') return false

        return this.rule.scope
    }
    get mschemas() {
        if (!this.rule.member || typeof this.rule.member !== 'object') return false

        let mschemaIds = Object.keys(this.rule.member)
        if (mschemaIds.length === 0) return false

        return Object.keys(this.rule.member)
    }
    get group() {
        if (!this.rule || typeof this.rule !== 'object') return false
        if (!this.rule.group || !this.rule.group.id) return false

        return this.rule.group
    }
    get enroll() {
        if (!this.rule || typeof this.rule !== 'object') return false
        if (!this.rule.enroll || !this.rule.enroll.id) return false

        return this.rule.enroll
    }
    /**
     * 检查是否符合注册用户规则
     */
    async checkRegister(userid) {
        if (this.scope.register !== 'Y') return null

        let moAccount = this.model('user/account')
        let account = await moAccount.byId(userid)

        return account.unionid ? true : false
    }
    /**
     * 检查是否符合通讯录规则
     */
    async checkMember(userid) {
        if (this.scope.member !== 'Y') return null

        if (!this.mschemas) return '需要填写通讯录信息，请联系活动的组织者解决。'

        let moMember = this.model('user/member')
        let members = await moMember.byUser(userid, { mschemas: this.mschemas })

        return members.length > 0
    }
    /**
     * 检查是否符合分组活动规则
     */
    async checkGroup(userid) {
        if (this.scope.group !== 'Y') return null

        if (!this.group)
            return '没有指定作为进入规则的分组活动，请联系活动的组织者解决'
        let moGroup = this.model('matter/group')
        let group = await moGroup.byId(this.group.id)
        if (false === group || group.state !== 1)
            return '指定的分组活动不可访问，请联系活动的组织者解决。'

        let bMatched = false
        let moGrpRec = this.model('matter/group/record')
        let grpRecs = await moGrpRec.byUser(group, userid)
        if (grpRecs && grpRecs.length) {
            let grpUsr = grpRecs[0]
            if (this.group.team && this.group.team.id) {
                if (grpUsr.team_id === this.group.team.id)
                    bMatched = true;
                else if (grpUsr.role_teams && grpUsr.role_teams.length && grpUsr.role_teams.contain(this.group.team.id))
                    bMatched = true;
            } else
                bMatched = true
        }

        return bMatched ? true : `您【ID:${userid}】目前的分组，不满足参与规则，无法访问，请联系活动的组织者解决。`
    }
    /**
     * 检查是否符合记录活动规则 
     */
    async checkEnroll(userid) {
        if (this.scope.enroll !== 'Y') return null

        if (!this.enroll || !this.enroll.id)
            return '没有指定作为进入规则的记录活动，请联系活动的组织者解决。'

        let moEnroll = this.model('matter/enroll')
        let enroll = await moEnroll.byId(this.enroll.id)
        if (false === enroll || enroll.state !== 1)
            return '指定作为进入规则的记录活动不存在，请联系活动的组织者解决。'

        let moEnlUsr = this.model('matter/enroll/user')
        let enlUsr = moEnlUsr.byId(enroll, userid)
        if (false === enlUsr || enlUsr.enroll_num <= 0)
            return `您【ID:${userid}】的用户信息，不在指定的记录活动中，不满足参与规则，请联系活动的组织者解决。`

        return true
    }
    /**
     * 
     * @param {*} userid 
     */
    async check(userid) {
        if (!this.rule.scope)
            return true

        let result = new Map()

        new Array('register', 'member', 'group', 'enroll').forEach(async s => {
            let method = `check${s.replace(/^(\w)/,f=>f.toUpperCase())}`
            let r = await this[method](userid)
            if (r !== null && r !== true) {
                result.set(s, r)
            }
        })

        return result
    }
}

module.exports = { Rule, create: Rule.create.bind(Rule) }