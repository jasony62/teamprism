const { DbModel } = require('../../tms/model')

/**
 * 记录日志时需要的列
 */
const LOG_FIELDS = 'siteid,id,title,summary,pic,mission_id'

class Enroll extends DbModel {
    /**
     *
     */
    async table() {
        return 'xxt_enroll';
    }
    /**
     * 活动进入链接
     */
    async getEntryUrl(siteId, id, oParams = null) {
        if (siteId === 'platform') {
            let oApp = this.byId(id, {'cascaded' : 'N', 'notDecode' : true})
            if (!oApp) {
                return "http://" + "localhost" + '/404.html'
            } else {
                siteId = oApp.siteid
            }
        }

        let url = "http://" + "localhost"
        url += "/rest/site/fe/matter/enroll"
        url += "?site=" + siteId + "&app=" + id

        if (oParams && Object.prototype.toString.call(oParams) === "[object Object]") {
            Object.keys(oParams).forEach((k) => {
                if (typeof oParams[k] === "string") {
                    url += "&" + k + "=" + oParams[k]
                }
            })
        }

        return url;
    }
    /**
     * 返回指定活动的数据
     *
     * @param string $aid
     * @param array $options
     *
     */
    async byId(appId, options = {}) {
        let fields = (options.fields) ? options.fields : '*';

        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll', fields)
        dbSelect.where.fieldMatch('id', '=', appId);
        let oApp = await dbSelect.exec()
        if (!oApp)
            throw new Error('记录活动不存在')

        let toJsonProps = ['entry_rule'];
        toJsonProps.forEach((p) => {
            let p2 = p.replace(/_(\w)/g, ws => ws[1].toUpperCase())
            oApp[p2] = JSON.parse(oApp[p])
            delete oApp[p]
        })

        return oApp;
    }
}
module.exports = function() {
    return new Enroll()
}