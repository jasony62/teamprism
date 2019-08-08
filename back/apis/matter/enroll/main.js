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
     * 获得指定记录活动的进入规则
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
        let query = this.request
        if (!query.app) {
            return new ResultFault('参数错误')
        }
        let rid = (query.rid) ? query.rid : ''

        let params = {}; // 返回的结果
        /* 要打开的记录 */
        let modelRec = new Record();

        if (query.ek) {
            let oOpenedRecord = await modelRec.byId(query.ek, {'verbose' : 'Y', 'state' : 1});
        }

        /* 要打开的应用 */
        let aOptions = {'cascaded' : query.cascaded, 'fields' : '*', 'appRid' : (oOpenedRecord && oOpenedRecord.rid) ? oOpenedRecord.rid : rid};
        if (query.task) {
            let modelTask = new Task();
            let oTask = await modelTask.byId(query.task);
            if (oTask) {
                aOptions.task = oTask;
            }
        }

        



        
        let modelEnl = new Enroll()
        let oApp = await modelEnl.byId(query.app, aOptions);
        if (!oApp || oApp.state !== '1') {
            return new ResultObjectNotFound();
        }
        if (oApp.appRound && oApp.appRound.rid) {
            rid = oApp.appRound.rid;
        }
        params.app = oApp;

        /* 当前访问用户的基本信息 */
        let oUser = await this.getUser(oApp);
        params.user = oUser;

        /* 进入规则 */
        let oEntryRuleResult = this.checkEntryRule2(oApp);
        params.entryRuleResult = oEntryRuleResult;

        /* 站点页面设置 */
        if (oApp.use_site_header === 'Y' || oApp.use_site_footer === 'Y') {
            // params.site = await utilities.model('site').byId(
            //     oApp.siteid,
            //     {
            //         'fields' : 'id,name,summary,heading_pic,header_page_name,footer_page_name',
            //         'cascaded' : 'header_page_name,footer_page_name'
            //     }
            // );
        }

        // /* 项目页面设置 */
        // if ($oApp->use_mission_header === 'Y' || $oApp->use_mission_footer === 'Y') {
        //     if ($oApp->mission_id) {
        //         $params['mission'] = $this->model('matter\mission')->byId(
        //             $oApp->mission_id,
        //             ['cascaded' => 'header_page_name,footer_page_name']
        //         );
        //     }
        // }

        // /* 要打开的页面 */
        // if (!in_array($page, ['task', 'event', 'kanban', 'repos', 'cowork', 'share', 'rank', 'score', 'votes', 'marks', 'favor', 'topic', 'stat'])) {
        //     $modelPage = $this->model('matter\enroll\page');
        //     $oUserEnrolled = $modelRec->lastByUser($oApp, $oUser, ['rid' => $rid]);
        //     /* 计算打开哪个页面 */
        //     if (empty($page)) {
        //         $oOpenPage = $this->_defaultPage($oApp, $rid, false, $ignoretime);
        //     } else {
        //         $oOpenPage = $modelPage->byName($oApp, $page);
        //     }
        //     if (empty($oOpenPage)) {
        //         return new \ResponseError('页面不存在');
        //     }
        //     /* 根据动态题目更新页面定义 */
        //     $modelPage->setDynaSchemas($oApp, $oOpenPage);
        //     /* 根据动态选项更新页面定义 */
        //     $modelPage->setDynaOptions($oApp, $oOpenPage);

        //     $params['page'] = $oOpenPage;
        // }

        // /**
        //  * 获得当前活动的分组和当前用户所属的分组，是否为组长，及同组成员
        //  */
        // if (!empty($oApp->entryRule->group->id)) {
        //     $assocGroupAppId = $oApp->entryRule->group->id;
        //     /* 获得的分组信息 */
        //     $modelGrpTeam = $this->model('matter\group\team');
        //     $groups = $modelGrpTeam->byApp($assocGroupAppId, ['fields' => "team_id,title,team_type"]);
        //     $params['groups'] = $groups;
        //     /* 用户所属分组 */
        //     $modelGrpRec = $this->model('matter\group\record');
        //     $oGrpApp = (object) ['id' => $assocGroupAppId];
        //     $oGrpUsr = $modelGrpRec->byUser($oGrpApp, $oUser->uid, ['fields' => 'is_leader,team_id,team_title,userid,nickname', 'onlyOne' => true]);
        //     if ($oGrpUsr) {
        //         $params['groupUser'] = $oGrpUsr;
        //         $params['groupOthers'] = [];
        //         if (!empty($oGrpUsr->team_id)) {
        //             $others = $modelGrpRec->byTeam($oGrpUsr->team_id, ['fields' => 'is_leader,userid,nickname']);
        //             foreach ($others as $other) {
        //                 if ($other->userid !== $oGrpUsr->userid) {
        //                     $params['groupOthers'][] = $other;
        //                 }
        //             }
        //         }
        //     }
        // }

        // return new \ResponseData($params);
    }
}

module.exports = Main