const {
    DbModel
} = require('../../../tms/model')
const utilities =  global.utilities

class User extends DbModel {
	async detail(oApp, who, oEnrolledData = null) {
		let oUser = who;
		// let oUser = JSON.parse(JSON.stringify(who));
        // $oUser->members = new \stdClass;
        // $oEntryRule = $oApp->entryRule;

        // /* 用户通讯录数据 */
        // if ($this->getDeepValue($oEntryRule, 'scope.member') === 'Y' && isset($oEntryRule->member)) {
        //     $mschemaIds = array_keys(get_object_vars($oEntryRule->member));
        //     if (count($mschemaIds)) {
        //         $modelMem = $this->model('site\user\member');
        //         $modelAcnt = $this->model('site\user\account');
        //         $oUser->members = new \stdClass;
        //         if (empty($oUser->unionid)) {
        //             $oSiteUser = $modelAcnt->byId($oUser->uid, ['fields' => 'unionid']);
        //             if ($oSiteUser && !empty($oSiteUser->unionid)) {
        //                 $unionid = $oSiteUser->unionid;
        //             }
        //         } else {
        //             $unionid = $oUser->unionid;
        //         }
        //         if (empty($unionid)) {
        //             $aMembers = $modelMem->byUser($oUser->uid, ['schemas' => implode(',', $mschemaIds)]);
        //             foreach ($aMembers as $oMember) {
        //                 $oUser->members->{$oMember->schema_id} = $oMember;
        //             }
        //         } else {
        //             $aUnionUsers = $modelAcnt->byUnionid($unionid, ['siteid' => $oApp->siteid, 'fields' => 'uid']);
        //             foreach ($aUnionUsers as $oUnionUser) {
        //                 $aMembers = $modelMem->byUser($oUnionUser->uid, ['schemas' => implode(',', $mschemaIds)]);
        //                 foreach ($aMembers as $oMember) {
        //                     $oUser->members->{$oMember->schema_id} = $oMember;
        //                 }
        //             }
        //             /* 站点用户替换成和注册账号绑定的站点用户 */
        //             $oRegUser = $modelAcnt->byPrimaryUnionid($oApp->siteid, $unionid);
        //             if ($oRegUser && $oRegUser->uid !== $oUser->uid) {
        //                 $oUser->uid = $oRegUser->uid;
        //                 $oUser->nickname = $oRegUser->nickname;
        //             }
        //         }
        //     }
        // }
        // /*获得用户昵称*/
        // if (isset($oEnrolledData) && (isset($oApp->assignedNickname->valid) && $oApp->assignedNickname->valid === 'Y') && isset($oApp->assignedNickname->schema->id)) {
        //     /* 指定的用户昵称 */
        //     if (isset($oEnrolledData)) {
        //         $modelEnlRec = $this->model('matter\enroll\record');
        //         $oUser->nickname = $modelEnlRec->getValueBySchema($oApp->assignedNickname->schema, $oEnrolledData);
        //     }
        // } else {
        //     /* 曾经用过的昵称 */
        //     $modelEnlUsr = $this->model('matter\enroll\user');
        //     $oEnlUser = $modelEnlUsr->byId($oApp, $oUser->uid, ['fields' => 'nickname']);
        //     if ($oEnlUser) {
        //         $oUser->nickname = $oEnlUser->nickname;
        //     }
        //     if (empty($oUser->nickname) || !$oEnlUser) {
        //         $modelEnl = $this->model('matter\enroll');
        //         $userNickname = $modelEnl->getUserNickname($oApp, $oUser);
        //         $oUser->nickname = $userNickname;
        //     }
        // }

        // /* 获得用户所属分组 */
        // if (isset($oApp->entryRule->group->id)) {
        //     $modelGrpRec = $this->model('matter\group\record');
        //     $oGrpMemb = $modelGrpRec->byUser($oApp->entryRule->group, $oUser->uid, ['fields' => 'team_id,is_leader,role_teams', 'onlyOne' => true]);
        //     if ($oGrpMemb) {
        //         $oUser->group_id = $oGrpMemb->team_id;
        //         $oUser->is_leader = $oGrpMemb->is_leader;
        //         $oUser->role_teams = $oGrpMemb->role_teams;
        //     }
        // }

        // /* 当前用户是否为编辑 */
        // if (!empty($oApp->actionRule->role->editor->group)) {
        //     $oUser->is_editor = 'N';
        //     if (!empty($oUser->group_id)) {
        //         if ($oUser->group_id === $oApp->actionRule->role->editor->group) {
        //             $oUser->is_editor = 'Y';
        //         }
        //     }
        //     if ($oUser->is_editor === 'N' && !empty($oUser->role_teams)) {
        //         if (in_array($oApp->actionRule->role->editor->group, $oUser->role_teams)) {
        //             $oUser->is_editor = 'Y';
        //         }
        //     }
        // }

        return oUser;
    }
}

module.exports = function () {
    return new User()
}