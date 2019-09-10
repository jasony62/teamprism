const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('./base')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    /**
     * 获得指定记录活动的进入规则以及当前用户的匹配情况
     */
    async entryRule() {
        return new ResultData(this.app.entryRule)
    }
    /**
     * 返回记录活动定义
     */
    // $app, $rid = '', $page = null, $ek = null, $ignoretime = 'N', $cascaded = 'N', $task = null
    async get() {
        let { rid, ek } = this.request.query

        let params = {}; // 返回的结果
        /* 要打开的记录 */
        let modelRec = this.model('matter/enroll/record')

        let oOpenedRecord
        if (ek) {
            oOpenedRecord = await modelRec.byId(ek, { 'verbose': 'Y', 'state': 1 });
        }

        /* 要打开的应用 */
        //let aOptions = { 'cascaded': query.cascaded, 'fields': '*', 'appRid': (oOpenedRecord && oOpenedRecord.rid) ? oOpenedRecord.rid : rid };
        // if (query.task) {
        //     let modelTask = this.model('matter/enroll/task)
        //     let oTask = await modelTask.byId(query.task);
        //     if (oTask) {
        //         aOptions.task = oTask;
        //     }
        // }
        //TODO:单独获取轮次信息，替换掉公共方法中应用数据的内容（appRound）

        let oApp = this.app
        if (oApp.appRound && oApp.appRound.rid) {
            rid = oApp.appRound.rid;
        }
        params.app = oApp;

        /* 当前访问用户的基本信息 */
        let oUser = await this.getUser(oApp)
        params.user = oUser;

        /* 进入规则 */
        let oEntryRuleResult = await this.checkEntryRule2(oApp);
        params.entryRuleResult = oEntryRuleResult;

        /* 站点页面设置 */

        /* 项目页面设置 */


        /* 要打开的页面 */


        /**
         * 获得当前活动的分组和当前用户所属的分组，是否为组长，及同组成员
         */

        return new ResultData(params)
    }
}

module.exports = Main