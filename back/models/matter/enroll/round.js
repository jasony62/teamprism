const { Base: MatterBase } = require('../base')
// const { create : Mission } = require('../mission')
// const MissionRound = require('../mission/round')

class Round extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_enroll_round', { debug })
    }
    
    /**
     * 
     * @param {*} rid 
     * @param {*} aOptions 
     */
	async byId(rid, aOptions = {}) {
		let fields = 'fields' in aOptions ? aOptions.fields : '*';

        let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll_round', fields)
        dbSelect.where.fieldMatch('rid', '=', rid)
		let oRound = await dbSelect.exec()

        return oRound;
    }
    /**
     * 返回记录活动下的轮次
     *
     * @param object $oApp
     *
     */
    async byApp(oApp, aOptions = {}) {
        if (!oApp.sync_mission_round) {
            throw new Error('没有提供活动轮次设置的完整信息（1）')
        }

        let fields = aOptions.fields ? aOptions.fields : '*'
        let state = aOptions.state ? aOptions.state : false
        let oPage = aOptions.page ? aOptions.page : {}

        let oResult = {} // 返回的结果

        /* 当前激活轮次 */
        if (!aOptions.withoutActive || aOptions.withoutActive !== 'Y') {
            oResult.active = await this.getActive(oApp, {'fields' : fields})
        }

        /* 活动下已有的所有轮次 */
        let wheres = [
            ['fieldMatch', 'aid', '=', oApp.id]
        ]
        if (state)
            wheres.push(['fieldMatch', 'state', '=', state])
        /* 开始时间 */
        if (aOptions.start_at)
            wheres.push(['fieldMatch', 'start_at', '=', aOptions.start_at])
        /* 开始时间 */
        if (aOptions.end_at)
            wheres.push(['fieldMatch', 'end_at', '=', aOptions.end_at])
        /* 轮次用途 */
        if (aOptions.purpose)
            wheres.push(['fieldMatch', 'purpose', '=', aOptions.purpose])

        let sqlParts = {orderby : 'create_at desc'}
        if (oPage.at && oPage.size) {
            sqlParts.limit = [(oPage.at - 1) * oPage.size, oPage.size]
        }

        oResult.rounds = await this.select(fields, wheres, sqlParts)
        if (oPage.at && oPage.size) {
            let total = await this.selectOne('count(*) total', wheres)
            oResult.total = total.total
        }

        return oResult
    }
    /**
     * 
     */
    async getActive(oApp, aOptions = {}) {
        let fields = (aOptions['fields']) ? aOptions['fields'] : '*';

        let aRequireAppFields = []; // 应用必须包含的字段
        if (!oApp.sync_mission_round) {
            aRequireAppFields.push('sync_mission_round');
        }
        if (!oApp.mission_id) {
            aRequireAppFields.push('mission_id');
        }
        if (aRequireAppFields.length > 0) {
            let modelEnl = this.model('matter/enroll')
            let oApp2 = await modelEnl.byId(oApp.id, {'fields' : aRequireAppFields.join(','), 'notDecode' : true});
            Object.keys(oApp2).forEach((k) => {
                oApp[k] = oApp2[k];
            })
        }

        // if (oApp.sync_mission_round === 'Y') {
        //     /* 根据项目的轮次规则生成轮次 */
        //     if (!oApp.mission_id) {
        //         throw new Error('没有提供活动所属项目的信息');
        //     }
        //     let modelMission = new Mission();
        //     let oMission = await modelMission.byId(oApp.mission_id, {'fields' : 'id,siteid,round_cron'});
        //     let modelMissRoud = new MissionRound();
        //     let oMisRound = await modelMissRoud.getActive(oMission, {'fields' : 'id,rid,title,start_at,end_at'});
        //     if (oMisRound) {
        //         let oAppRound = await this.byMissionRid(oApp, oMisRound.rid, {'state' : 1, 'fields' : fields});
        //         if (false === oAppRound) {
        //             /* 创建和项目轮次绑定的轮次 */
        //             let oNewRound = {};
        //             oNewRound.title = oMisRound.title;
        //             oNewRound.start_at = oMisRound.start_at;
        //             oNewRound.end_at = oMisRound.end_at;
        //             oNewRound.state = 1;
        //             oNewRound.mission_rid = oMisRound.rid;
        //             // let oResult = await this.create(oApp, oNewRound, null, true);
        //             if (false === oResult[0]) {
        //                 throw new Error(oResult[1]);
        //             }
        //             oAppRound = oResult[1];
        //         }
        //         return oAppRound;
        //     }
        // }

        /* 已经存在的，用户指定的当前轮次 */
        let oAppRound = await this.getAssignedActive(oApp, aOptions)
        if (oAppRound) {
            return oAppRound;
        }
        /* 有效的定时规则 */
        if (!oApp.roundCron) {
            let enabledRules = await this.getEnabledRules(oApp.roundCron);
        }

        if (enabledRules) {
            /* 根据轮次开始时间获得轮次，但是必须是常规轮次 */
            let current = Data.parse(new Data()).toString.substr(0,10);

            let db = await this.db()
            let dbSelect = db.newSelect('xxt_enroll_round', fields)
            dbSelect.where.and("aid = '" + oApp.id + "' and state = 1 and purpose = 'C' and start_at <= " + current);
            // $q2 = [
            //     'o' => 'start_at desc',
            //     'r' => ['o' => 0, 'l' => 1],
            // ];
            let rounds = await dbSelect.exec()
            let oAppRound = rounds.length === 1 ? rounds[0] : false;
        } else {
            /* 根据定时规则获得轮次 */
            // let rst = await this._getRoundByCron(oApp, enabledRules, aOptions);
            if (false === rst[0]) {
                return false;
            }
            oAppRound = rst[1];
        }

        return oAppRound;
    }
    /**
     * 
     */
    async getAssignedActive() {
        // $fields = isset($aOptions['fields']) ? $aOptions['fields'] : '*';

        // $q = [
        //     $fields,
        //     'xxt_enroll_round',
        //     ['aid' => $oApp->id, 'purpose' => 'C', 'start_at' => 0, 'end_at' => 0, 'state' => 1],
        // ];
        // $oRound = $this->query_obj_ss($q);

        // return $oRound;
        return {}
    }
}

function create({ debug = false } = {}) {
    return new Round({ debug })
}

module.exports = { Round, create }