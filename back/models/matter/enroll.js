const { DbModel } = require('../../tms/model')
const Schema = require("./enroll/schema")
const Round = require('./enroll/round')
const config = require('../../config.js')

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
    // /**
    //  * 获得记录活动
    //  */
    // async get() {
    //     let { app } = this.request.query
    //     let modelApp = new Enroll()
    //     const oApp = await modelApp.byId(app)
    //     modelApp.end()

    //     if (!oApp) {
    //         return new ResultObjectNotFound()
    //     }

    //     return new ResultData(oApp)
    // }
    /**
     * 活动进入链接
     */
    async getEntryUrl(siteId, id, oParams = null) {
        if (siteId === 'platform') {
            let oApp = this.byId(id, {'cascaded' : 'N', 'notDecode' : true})
            if (!oApp) {
                return config.APP_PROTOCOL + config.APP_HTTP_HOST + '/404.html'
            } else {
                siteId = oApp.siteid
            }
        }

        let url = config.APP_PROTOCOL + config.APP_HTTP_HOST
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
     * @param string aid
     * @param array options
     *
     */
    async byId(appId, options = {}) {
        let fields = (options.fields) ? options.fields : '*';
        let cascaded = (options.cascaded) ? options.cascaded : 'Y';
        let appRid = (options.appRid) ? options.appRid : '';

        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll', fields)
        dbSelect.where.fieldMatch('id', '=', appId);
        let oApp = await dbSelect.exec()
        if (!oApp)
            throw new Error('记录活动不存在')

        if (options.notDecode) {
            return oApp
        }

        oApp.type = 'enroll'
        /* 自动补充信息 */
        if (!oApp.id) {
            oApp.id = appId;
        }
        /* 活动轮次 */
        // let modelRnd = new Round()
        // if (!appRid) {
        //     let oAppRnd = await modelRnd.getActive(oApp, {'fields' : 'id,rid,title,purpose,start_at,end_at,mission_rid'});
        // } else {
        //     let oAppRnd = await modelRnd.byId(appRid, {'fields' : 'id,rid,title,purpose,start_at,end_at,mission_rid'});
        // }
        // oApp.appRound = oAppRnd;

        if (oApp.siteid && oApp.id) {
            oApp.entryUrl = await this.getEntryUrl(oApp.siteid, oApp.id);
        }
        /* 对象类型 */
        let toJsonPropsObj = ['entry_rule', 'action_rule', 'scenario_config', 'notify_config', 'rp_config', 'repos_config', 'rank_config', 'absent_cause', 'assigned_nickname']
        toJsonPropsObj.forEach((p) => {
            if (oApp[p]) {
                let p2 = p.replace(/_(\w)/g, ws => ws[1].toUpperCase())
                oApp[p2] = (oApp[p]) ? JSON.parse(oApp[p]) : {}
                delete oApp[p]
            }
        })

        /* 数组类型 */
        let toJsonPropsArr = ['vote_config', 'score_config', 'question_config', 'answer_config', 'baseline_config', 'transmit_config', 'recycle_schemas']
        toJsonPropsArr.forEach((p) => {
            if (oApp[p]) {
                let p2 = p.replace(/_(\w)/g, ws => ws[1].toUpperCase())
                oApp[p2] = (oApp[p]) ? JSON.parse(oApp[p]) : []
                delete oApp[p]
            }
        })

        if (typeof(oApp.data_schemas) !== undefined) {
            if (oApp.data_schemas) {
                oApp.dataSchemas = JSON.parse(oApp.data_schemas);
                if (!oApp.dataSchemas) {
                    /* 解析失败 */
                    oApp.dataSchemas = [];
                } else {
                    /* 应用的动态题目 */
                    let oApp2 =  {'id' : oApp.id, 'appRound' : oApp.appRound, 'dataSchemas' : oApp.dataSchemas, 'mission_id' : oApp.mission_id}
                    let modelSch =new Schema()
                    // oApp2 = await modelSch.setDynaSchemas(oApp2, aOptions.task ? aOptions.task : null);
                    oApp.dynaDataSchemas = oApp2.dataSchemas;
                    /* 设置活动的动态选项 */
                    // oApp = await modelSch.setDynaOptions(oApp, oAppRnd);
                }
            } else {
                oApp.dataSchemas = oApp.dynaDataSchemas = [];
            }
            /* 清除数据 */
            delete oApp.data_schemas;
        }

        // /* 轮次生成规则 */
        // if (property_exists($oApp, 'round_cron')) {
        //     if ($this->getDeepValue($oApp, 'sync_mission_round') === 'Y') {
        //         if (!empty($oApp->mission_id)) {
        //             /* 使用项目的轮次生成规则 */
        //             $oMission = $this->model('matter\mission')->byId($oApp->mission_id, ['fields' => 'round_cron']);
        //             $oApp->roundCron = $oMission->roundCron;
        //         } else {
        //             $oApp->roundCron = [];
        //         }
        //     } else if (!empty($oApp->round_cron)) {
        //         $oApp->roundCron = json_decode($oApp->round_cron);
        //         $modelRnd = $this->model('matter\enroll\round');
        //         foreach ($oApp->roundCron as $rc) {
        //             $rules[0] = $rc;
        //             $rc->case = $modelRnd->sampleByCron($rules);
        //         }
        //     } else {
        //         $oApp->roundCron = [];
        //     }
        //     unset($oApp->round_cron);
        // }

        // if (!empty($oApp->matter_mg_tag)) {
        //     $oApp->matter_mg_tag = json_decode($oApp->matter_mg_tag);
        // }

        // $modelPage = $this->model('matter\enroll\page');
        // if (!empty($oApp->id)) {
        //     if ($cascaded === 'Y') {
        //         $oApp->pages = $modelPage->byApp($oApp->id);
        //     } else {
        //         $oApp->pages = $modelPage->byApp($oApp->id, ['cascaded' => 'N', 'fields' => 'id,name,type,title']);
        //     }
        // }

        return oApp;
    }
}
module.exports = function() {
    return new Enroll()
}