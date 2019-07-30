// const Api = require('../../../tms/api')
const Api = require('base')
const Enroll = require('../../../models/matter/enroll')
const utilities =  global.utilities

class Main extends Base {
    constructor(who) {
        super(who)
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
    async get(req) {
        let query = req.query
        if (!query.app) {
            return utilities.responseError('参数错误');
        }

        let params = {}; // 返回的结果
        /* 要打开的记录 */
        let modelRec = utilities.model('matter\\enroll\\record');

        if (query.ek) {
            let oOpenedRecord = await modelRec.byId(query.ek, {'verbose' : 'Y', 'state' : 1});
        }
        /* 要打开的应用 */
        let aOptions = {'cascaded' : query.cascaded, 'fields' : '*', 'appRid' : (oOpenedRecord && oOpenedRecord.rid) ? oOpenedRecord.rid : query.rid};
        if (query.task) {
            let oTask = await utilities.model('matter\\enroll\\task').byId(query.task);
            if (oTask) {
                aOptions.task = oTask;
            }
        }
        $oApp = utilities.model('matter\\enroll').byId(query.app, aOptions);
        if (!oApp || $oApp.state !== '1') {
            return utilities.ObjectNotFoundError();
        }
        if (oApp.appRound && oApp.appRound.rid) {
            rid = oApp.appRound.rid;
        }
        params.app = oApp;

        /* 当前访问用户的基本信息 */
        let oUser = await super.getUser(oApp);
        params.user = oUser;

        /* 进入规则 */
        let oEntryRuleResult = super.checkEntryRule2(oApp);
        params.entryRuleResult = oEntryRuleResult;

        /* 站点页面设置 */
        if (oApp.use_site_header === 'Y' || oApp.use_site_footer === 'Y') {
            params.site = utilities.model('site').byId(
                oApp.siteid,
                {
                    'fields' : 'id,name,summary,heading_pic,header_page_name,footer_page_name',
                    'cascaded' : 'header_page_name,footer_page_name'
                }
            );
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
    //
    async entryRule(req) {
        let modelApp = new Enroll()
        const oApp = await modelApp.byId(req.query.app)
        modelApp.end()
        return utilities.responseData({entryRule: oApp.entryRule})
    }
}

module.exports = function (who) {
    return new Main(who)
}