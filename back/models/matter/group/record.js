const { Base: MatterBase } = require('../base')
/**
 * 处理从数据库获得的数据
 */
class DbRecordHandler {
    constructor(host, appId = null) {
        this.host = host
        this.appId = appId
    }
    /**
     * 数据
     */
    data(rec) {
        if (Reflect.has(rec, 'data')) {
            if (typeof rec.data === 'string' && rec.data.length)
                rec.data = JSON.parse(rec.data)
            else
                rec.data = {}
        }
        return rec
    }
    role_teams(rec) {
        if (Reflect.has(rec, 'role_teams')) {
            if (typeof rec.role_teams === 'string' && rec.role_teams.length)
                rec.role_teams = JSON.parse(rec.role_teams)
            else
                rec.role_teams = {}
        }
        return rec
    }

    async leave(rec) {
        let appId = Reflect.has(rec, 'aid') ? rec.aid : this.appId
        if (!appId) return rec

        if (Reflect.has(rec, 'userid')) {
            if (undefined === this._moGrpLev)
                this._moGrpLev = this.host.model('matter/group/leave')
            let leaves = this._moGrpLev.byUser(appId, rec.userid, { fields: 'id,begin_at,end_at' })
            rec.leaves = leaves
        }

        return rec
    }
    async handle(rec) {
        console.log('xxxxxxx')
        rec = this.data(rec)
        rec = this.role_teams(rec)
        rec = await this.leave(rec)

        return rec
    }
}
class Record extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_group_record', { debug })
    }
    /**
     * 用户端可见字段
     */
    get fields_ue() {
        return ['id', 'userid', 'nickname', 'is_leader', 'group_id', 'role_group_id']
    }
    /**
     * 
     * @param {object} app 
     * @param {string} app.id 
     * @param {string} userid 
     * @param {object} options 
     * @param {string=} options.fields 
     * @param {string=} options.onlyOne 
     */
    async byUser(app, userid, { fields = '*', onlyOne = false } = {}) {
        if (typeof app !== 'object' || !app.id) return false
        if (typeof userid !== 'string' || userid.length === 0) return false

        let sqlWhere = [
            ['fieldMatch', 'state', '=', 1],
            ['fieldMatch', 'aid', '=', app.id],
            ['fieldMatch', 'userid', '=', userid],
        ]
        let sqlOptions = {
            orderby: 'enroll_at desc'
        }
        if (onlyOne) {
            sqlOptions.limit = [0, 1]
        }

        let handler = new DbRecordHandler(this, app.id)
        let rowOptions = {
            fnForEach: handler.handle
        }

        let recs = await this.select(fields, sqlWhere, sqlOptions, rowOptions)

        if (onlyOne === true)
            return recs.length ? recs[0] : false

        return recs
    }
}

function create({ debug = false } = {}) {
    return new Record({ debug })
}

module.exports = { Record, create }