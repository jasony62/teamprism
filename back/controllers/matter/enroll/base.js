const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/ctrl')
const matterBase = require('../base')

class Base extends matterBase {
    constructor(...args) {
        super(...args)
    }
    /**
     * 在调用方法前被执行的公共方法
     */
    async tmsBeforeEach() {
        let { app } = this.request.query
        if (!app)
            return new ResultFault(`参数错误`)

        let modelApp = this.model('matter/enroll')
        let oApp = await modelApp.byId(app)
        if (!oApp || oApp.state !== 1)
            return new ResultFault(`数据错误`)

        this.app = oApp

        return true
    }
    /**
     * 获得当前用户的完整信息
     * 1、活动中指定的用户昵称
     * 2、用户在活动中所属的分组
     */
    async getUser(oEnrolledData = null) {
        let who = await this.client.data
        let modelUsr = this.model('matter/enroll/user')
        let oUser = await modelUsr.detail(this.app, who, oEnrolledData)

        return oUser
    }
    /**
     * 
     */
    async checkEntryRule2() {

        return {}
    }
    /**
     * 编辑用户的定义及用户列表
     */
    async getEditorGroup(oApp) {
        let oEditor = null;
        // $oActionRule = $oApp->actionRule;
        // if (isset($oActionRule->role->editor->group) && isset($oActionRule->role->editor->nickname)) {
        // 	$oEditor = new \stdClass;
        // 	$oEditor->group = $oActionRule->role->editor->group;
        // 	$oEditor->nickname = $oActionRule->role->editor->nickname;
        // 	// 如果记录活动指定了编辑组需要获取，编辑组中所有的用户
        // 	$modelGrpRec = $this->model('matter\group\record');
        // 	$oGrpRecResult = $modelGrpRec->byApp($oApp->entryRule->group->id, ['roleTeamId' => $oEditor->group, 'fields' => 'role_teams,userid']);
        // 	if (isset($oGrpRecResult->records)) {
        // 		$oEditor->users = new \stdClass;
        // 		foreach ($oGrpRecResult->records as $oRec) {
        // 			$oEditor->users->{$oRec->userid} = $oRec->role_teams;
        // 		}
        // 	}
        // }

        return oEditor
    }
    /**
     * 设置记录的昵称
     *
     * @param mixed $oObj 记录|数据|评论|专题
     */
    async setNickname(oObj, oUser, oEditorGrp) {
        /* 修改默认访客昵称 */
        if (oObj.userid && oObj.userid === oUser.uid) {
            oObj.nickname = '我'
        } else if (oObj.nickname && oObj.nickname.match(/用户[^\W_]{13}/)) {
            oObj.nickname = '访客'
        } else if (oEditorGrp && (!oUser.is_editor || oUser.is_editor !== 'Y')) {
            /* 设置编辑统一昵称 */
            if (oObj.group_id && oObj.group_id === oEditorGrp.group) {
                oObj.nickname = oEditorGrp.nickname
            } else if (oEditorGrp.users && oEditorGrp.users[oObj.userid]) {
                // 记录提交者是否有编辑组角色
                oObj.nickname = oEditorGrp.nickname
            }
        }

        return oObj
    }
}

module.exports = Base