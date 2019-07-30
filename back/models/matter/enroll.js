const {
    DbModel
} = require('../../tms/model')

class Enroll extends DbModel {
    async byId(appId, options = {}) {
        let fields = (options.fields) ? options.fields : '*';
        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll', fields)
        dbSelect.where.fieldMatch('id', '=', appId);
        let oApp = await dbSelect.exec()
        if (!oApp)
            throw new Error('对象不存在')

        let toJsonProps = ['entry_rule'];
        toJsonProps.forEach((p) => {
            let p2 = p.replace(/_(\w)/g, ws => ws[1].toUpperCase())
            oApp[p2] = JSON.parse(oApp[p])
            delete oApp[p]
        })

        return oApp;
    }
}
module.exports = function () {
    return new Enroll()
}