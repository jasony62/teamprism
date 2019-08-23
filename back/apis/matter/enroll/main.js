const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('./base')
const Enroll = require('../../../models/matter/enroll')
const Record = require('../../../models/matter/enroll/record')
const Task = require('../../../models/matter/enroll/task')

class Main extends Base {
    constructor(...args) {
        super(...args)
    }
    /**
     * 获得指定记录活动的进入规则以及当前用户的匹配情况
     */
    async entryRule() {
        let { app } = this.request.query
        let modelApp = new Enroll()
        const oApp = await modelApp.byId(app)
        modelApp.end()

        if (!oApp) {
            return new ResultObjectNotFound()
        }

        return new ResultData(oApp.entryRule)
    }
    /**
     * 返回记录活动定义
     *
     * @param string $appid
     * @param string $rid
     * @param string $page page's name
     * @param string $ek record's enroll key
     * @param int $task 活动任务id
     *
     */
    // $app, $rid = '', $page = null, $ek = null, $ignoretime = 'N', $cascaded = 'N', $task = null
    async get() {
        let query = this.request.query
        if (!query.app) {
            return new ResultFault('参数错误')
        }
        let rid = (query.rid) ? query.rid : ''

        let params = {}; // 返回的结果
        /* 要打开的记录 */
        let modelRec = new Record();

        let oOpenedRecord
        if (query.ek) {
            oOpenedRecord = await modelRec.byId(query.ek, {'verbose' : 'Y', 'state' : 1});
        }

        /* 要打开的应用 */
        let aOptions = {'cascaded' : query.cascaded, 'fields' : '*', 'appRid' : (oOpenedRecord && oOpenedRecord.rid) ? oOpenedRecord.rid : rid};
        // if (query.task) {
        //     let modelTask = new Task();
        //     let oTask = await modelTask.byId(query.task);
        //     if (oTask) {
        //         aOptions.task = oTask;
        //     }
        // }

        let modelEnl = new Enroll()
        let oApp = await modelEnl.byId(query.app, aOptions);
        if (!oApp || oApp.state != '1') {
            return new ResultObjectNotFound();
        }
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
        

        modelEnl.end()
        return new ResultData(params)
    }
}

module.exports = Main