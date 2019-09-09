const { Base: MatterBase } = require('../base')
const { create : Schema } = require('./schema')
const { getDeepValue, replaceHTMLTags, setDeepValue } = require('../../../tms/utilities')
const DEFAULT_FIELDS = 'id,state,value,tag,supplement,rid,enroll_key,schema_id,userid,group_id,nickname,submit_at,score,remark_num,last_remark_at,like_num,like_log,modify_log,agreed,agreed_log,multitext_seq,vote_num'

class Data extends MatterBase {
    constructor(oApp = null, { debug = false } = {}) {
        super('xxt_enroll_record_data', { debug })
        this._oApp = oApp
    }
	/**
     * 获得指定登记记录登记数据的详细信息
     */
	async byRecord(ek, aOptions = {}) {
		let fields = aOptions.fields ? aOptions.fields : DEFAULT_FIELDS
        let bExcludeRoot = aOptions.excludeRoot ? true : false

    	if (-1 === fields.indexOf('schema_id')) {
            fields += ',schema_id'
        }
        if (-1 === fields.indexOf('multitext_seq')) {
            fields += ',multitext_seq'
        }

        let db = await this.db()
        let dbSelect = db.newSelect('xxt_enroll_record_data', fields)
        dbSelect.where.fieldMatch('enroll_key', '=', ek)
        dbSelect.where.fieldMatch('state', '=', 1)

        if (bExcludeRoot) {
        	dbSelect.where.fieldMatch('is_multitext_root', '=', "N")
        } else {
        	dbSelect.where.fieldMatch('is_multitext_root', '=', 0)
        }

        let fnHandleData = async (oData) => {
            if (oData.tag)
                oData.tag = oData.tag ? [] : JSON.stringify(oData.tag)

            if (oData.like_log)
                oData.like_log = oData.like_log ? {} : JSON.stringify(oData.like_log)

            if (oData.agreed_log)
                oData.agreed_log = oData.agreed_log ? {} : JSON.stringify(Data.agreed_log)
        }
        let fnHandleResult = async (data, bExcludeRoot, fnHandleData) => {
            let oResult = {}
            if (data.length) {
                for (let oSchemaData of data) {
                    await fnHandleData(oSchemaData)
                    let schemaId = oSchemaData.schema_id
                    delete oSchemaData.schema_id
                    if (bExcludeRoot) {
                        if (oSchemaData.multitext_seq > 0) {
                            if (!oResult[schemaId]) {
                                oResult[schemaId] = []
                            }
                            oResult[schemaId].push(oSchemaData)
                        } else {
                            delete oSchemaData.multitext_seq
                            oResult[schemaId] = oSchemaData
                        }
                    } else {
                        oResult[schemaId] = oSchemaData
                    }
                }
            }

            return oResult
        }

        let mixResult
        if (!aOptions.schema || Array.isArray(aOptions.schema)) {
	        if (aOptions.schema && Array.isArray(aOptions.schema)) {
                dbSelect.where.fieldIn('schema_id', aOptions.schema)
	        }
			let data = await dbSelect.exec()

	        mixResult = await fnHandleResult(data, bExcludeRoot, fnHandleData)
	    } else {
        	dbSelect.where.fieldMatch('schema_id', '=', aOptions.schema)
	        if (bExcludeRoot) {
				let data = await dbSelect.exec()
                await data.forEach(v => fnHandleData(v))
                if (data.length === 1 && data[0].multitext_seq === 0) {
	                await fnHandleData(data)
	                mixResult = data[0]
	            } else {
	                mixResult = data
	            }
	        } else {
				let data = await dbSelect.exec()
	            if (data) {
	                await fnHandleData(data)
	            }
	            mixResult = data
	        }
	    }

        return mixResult
    }
    /**
     * 答案清单
     */
    async coworkDataByApp(oOptions = null, oCriteria = null, oUser = null, coworkSchemaIds = []) {
        let oApp = this._oApp
        // 活动中是否存在协作填写题
        let oSchemasById = {} // 方便查找题目
        let oCoworkSchemaIds = []
        for (let oSchema of oApp.dynaDataSchemas) {
            oSchemasById[oSchema.id] = oSchema
            if (getDeepValue(oSchema, 'cowork') === 'Y') {
                oCoworkSchemaIds.push(oSchema.id)
            }
        }
        if (coworkSchemaIds.length === 0) {
            if (oCoworkSchemaIds.length === 0) {
                return false
            }
            coworkSchemaIds = oCoworkSchemaIds
        }

        // 指定记录活动下的记录
        let w = "rd.state=1 and rd.aid='" + oApp.id + "' and rd.multitext_seq > 0 and rd.value<>''"
        w += " and rd.schema_id in ('" + coworkSchemaIds.join("','") + "')"

        /* 指定轮次，或者当前激活轮次 */
        if (!getDeepValue(oCriteria, 'recordData.rid')) {
            if (getDeepValue(oApp, 'appRound.rid')) {
                w += " and (rd.rid='" + oApp.appRound.rid + "')"
            }
        } else {
            if (typeof oCriteria.recordData.rid === "string") {
                if (oCriteria.recordData.rid.toLowerCase() !== 'all') {
                    w += " and (rd.rid='" + oCriteria.recordData.rid + "')"
                }
            } else if (Array.isArray(oCriteria.recordData.rid)) {
                let rid = oCriteria.recordData.rid
                w += " and rd.rid in('" + rid.join("','") + "')"
            }
        }

        // 根据用户分组过滤
        if (getDeepValue(oCriteria, "recordData.group_id")) {
            w += " and rd.group_id='" + oCriteria.recordData.group_id + "'"
        }

        // 根据填写人筛选（填写端列表页需要）
        if (getDeepValue(oCriteria, "recordData.userid")) {
            w += " and rd.userid='" + oCriteria.recordData.userid + "'"
        }

        /**
         * 推荐状态
         */
        if (getDeepValue(oCriteria, "recordData.agreed")) {
            w += " and rd.agreed='" + oCriteria.recordData.agreed + "'"
        } else {
            // 屏蔽状态的记录默认不可见
            w += " and rd.agreed<>'N'"
        }
        // 讨论状态的记录仅提交人，同组用户或超级用户可见
        if (oUser) {
            // 当前用户角色
            if (!getDeepValue(oUser, "is_leader") || getDeepValue(oUser, 'is_leader') !== 'S') {
                if (getDeepValue(oUser, 'uid')) {
                    w += " and ("
                    w += " (rd.agreed<>'D'"
                    if (getDeepValue(oUser, 'is_editor') && getDeepValue(oUser, 'is_editor') !== 'Y') {
                        w += " and rd.agreed<>''" // 如果活动指定了编辑，未表态的数据默认不公开
                    }
                    w += ")"
                    w += " or rd.userid='" + oUser.uid + "'"
                    if (getDeepValue(oUser, 'group_id')) {
                        w += " or rd.group_id='" + oUser.group_id + "'"
                    }
                    if (getDeepValue(oUser, "is_editor") === "Y") {
                        w += " or rd.group_id=''"
                    }
                    w += ")"
                    // 判断记录的状态能不能显示
                    w += " and ("
                    w += " (r.agreed<>'D'"
                    if (getDeepValue(oUser, "is_editor") && getDeepValue(oUser, "is_editor") !== 'Y') {
                        w += " and r.agreed<>''" // 如果活动指定了编辑，未表态的数据默认不公开
                    }
                    w += ")"
                    w += " or r.userid='" + oUser.uid + "'"
                    if (getDeepValue(oUser, "group_id")) {
                        w += " or r.group_id='" + oUser.group_id + "'"
                    }
                    if (getDeepValue(oUser, "is_editor") === 'Y') {
                        w += " or r.group_id=''"
                    }
                    w += ")"
                }
            }
        }

        // 指定了按关键字过滤
        if (getDeepValue(oCriteria, "keyword")) {
            w += " and (r.data like '%" + oCriteria.keyword + "%')"
        }
        // 指定了记录数据过滤条件
        if (getDeepValue(oCriteria, "data")) {
            let whereByData = ''
            for (let k in oCriteria.data) {
                let v = oCriteria.data[k]
                if (v && oSchemasById[k]) {
                    let oSchema = oSchemasById[k]
                    whereByData += ' and ('
                    if (oSchema.type === 'multiple') {
                        // 选项ID是否互斥，不存在，例如：v1和v11
                        let bOpExclusive = true
                        let strOpVals = ''
                        for (let op of oSchema.ops) {
                            strOpVals += ',' + op.v
                        }
                        for (let op of oSchema.ops) {
                            if (-1 !== strOpVals.indexOf(op.v)) {
                                bOpExclusive = false
                                break
                            }
                        }
                        // 拼写sql
                        let v2 = v.split(',')
                        for (let index in v2) {
                            let v2v = v2[index]
                            if (index > 0) {
                                whereByData += ' and '
                            }
                            // 获得和题目匹配的子字符串
                            let dataBySchema = 'substr(substr(r.data,locate(\'"' + k + '":"\',r.data)),1,locate(\'"\',substr(r.data,locate(\'"' + k + '":"\',r.data)),' + (k.length + 5) + '))'
                            whereByData += '('
                            if (bOpExclusive) {
                                whereByData += dataBySchema + ' like \'%' + v2v + '%\''
                            } else {
                                whereByData += dataBySchema + ' like \'%"' + v2v + '"%\''
                                whereByData += ' or ' + dataBySchema + ' like \'%"' + v2v + ',%\''
                                whereByData += ' or ' + dataBySchema + ' like \'%,' + v2v + ',%\''
                                whereByData += ' or ' + dataBySchema + ' like \'%,' + v2v + '"%\''
                            }
                            whereByData += ')'
                        }
                    } else if (oSchema.type === 'single'){
                        whereByData += 'r.data like \'%"' + k + '":"' + v + '"%\''
                    } else {
                        whereByData += 'r.data like \'%"' + k + '":"%' + v + '%"%\''
                    }
                    whereByData += ')'
                }
            }
            w += whereByData
        }

        w += " and rd.enroll_key = r.enroll_key and r.state = 1"

        let q2 = {}
        // 查询结果分页
		if (getDeepValue(oOptions, 'page') && getDeepValue(oOptions, 'size')) {
			q2.r = {'o' : (parseInt(oOptions.page) - 1) * parseInt(oOptions.size), 'l' : parseInt(oOptions.size)}
		}

        // 查询结果排序
        if (getDeepValue(oOptions, "orderby")) {
            let fnOrderBy = (orderbys) => {
                if (typeof orderbys === 'string')  orderbys = [orderbys]
                let sqls = []
                for (let orderby of orderbys) {
                    switch (orderby) {
                    case 'sum':
                        sqls.push('rd.score desc')
                        break
                    case 'agreed':
                        sqls.push('rd.agreed desc')
                        break
                    case 'vote_num':
                        sqls.push('rd.vote_num desc')
                        break
                    case 'like_num':
                        sqls.push('rd.like_num desc')
                        break
                    case 'submit_at':
                        sqls.push('rd.submit_at desc')
                        break
                    case 'submit_at asc':
                        sqls.push('rd.submit_at')
                        break
                    }
                }
                return sqls.join(',')
            }
            q2.o = fnOrderBy(oOptions.orderby)
        } else {
            q2.o = 'rd.submit_at desc'
        }

        // 查询参数
        let fields
        if (getDeepValue(oOptions, "fields")) {
            fields = oOptions.fields
        } else {
            fields = 'r.id record_id,rd.id data_id,rd.enroll_key,rd.rid,rd.purpose,rd.submit_at enroll_at,rd.userid,rd.group_id,rd.nickname,rd.schema_id,rd.value,rd.score,rd.agreed,rd.like_num,rd.like_log,rd.remark_num,rd.dislike_num,rd.dislike_log,r.data'
        }
        let table = "xxt_enroll_record_data rd,xxt_enroll_record r"

        /**
		 * 处理获得的数据
		 */
		let oResult = {} // 返回的结果
		let db = await this.db()
        let dbSelect = db.newSelect(table, fields)
        let where = [w]
        dbSelect.where.and(where)
		if (q2.r) {
			await dbSelect.limit(q2.r.o, q2.r.l)
		}
		if (q2.o) {
			await dbSelect.order(q2.o)
		}

        let aRecDatas = await dbSelect.exec()
        if (aRecDatas) {
            //
            oResult.recordDatas = await this._parse(aRecDatas)
        } else {
            oResult.recordDatas = []
        }

        // 符合条件的数据总数
		dbSelect = db.newSelectOneVal(table, 'count(*)')
        dbSelect.where.and(where)
		let total = await dbSelect.exec()
		oResult.total = total

        return oResult
    }
    /**
     * 解析记录的内容，将数据库中的格式转换为应用格式
     */
    async _parse(aRecDatas) {
        let oApp = this._oApp
        // 设置了可见性规则的题目
        let visibilitySchemas = oApp.dynaDataSchemas.filter(function (oSchema) {return getDeepValue(oSchema, 'visibility.rules')})
        // 关联的分组题
        let modelSchema = Schema(oApp)
        let oAssocGrpTeamSchema = await modelSchema.getAssocGroupTeamSchema()
        let aGroupsById = [] // 缓存分组数据
        let aRoundsById = [] // 缓存轮次数据
        let oGroupsByUser = [] // 缓存分组用户

        let fnCheckSchemaVisibility = (oSchemas, oRecordData) => {
			oSchemas.forEach( (oSchema) => {
				for (let oRule of oSchema.visibility.rules) {
					if (oSchema.id.indexOf('member.extattr') === 0) {
						let memberSchemaId = oSchema.id.replace('member.extattr.', '')
						if (!oRecordData.member || !oRecordData.member.extattr || !oRecordData.member.extattr[memberSchemaId] || (oRecordData.member.extattr[memberSchemaId] !== oRule.op && !oRecordData.member.extattr[memberSchemaId])) {
							delete oRecordData[oSchema.id]
							break
						}
					} else if (!oRecordData[oRule.schema] || (oRecordData[oRule.schema] !== oRule.op && !oRecordData[oRule.schema][oRule.op])) {
						delete oRecordData[oSchema.id]
						break
					}
				}
			})
		}

        let aFnHandlers = [] // 记录处理函数
        /* 用户所属分组 */
        if (getDeepValue(oApp, "entryRule.group.id")) {
            // let groupAppId = oApp.entryRule.group.id;
            // modelGrpUser = this.model('matter\group\record');
            // aFnHandlers[] = function (aRecData) use (groupAppId, modelGrpUser) {
            //     if (!empty(aRecData.userid)) {
            //         if (!isset(oGroupsByUser[aRecData.userid])) {
            //             oGrpUser = modelGrpUser.byUser((object) ['id' => groupAppId], aRecData.userid, ['fields' => 'team_id,team_title', 'onlyOne' => true]);
            //             oGroupsByUser[aRecData.userid] = oGrpUser;
            //         } else {
            //             oGrpUser = oGroupsByUser[aRecData.userid];
            //         }
            //         if (oGrpUser) {
            //             if (!isset(aRecData.user)) {
            //                 aRecData.user = new \stdClass;
            //             }
            //             aRecData.user.group = (object) ['id' => oGrpUser.team_id, 'title' => oGrpUser.team_title];
            //         }
            //     }
            // }
        }

        for (let aRecData of aRecDatas) {
            if ('like_log' in aRecData) {
                aRecData.like_log = !aRecData.like_log ? {} : JSON.parse(aRecData.like_log)
            }
            if ('dislike_log' in aRecData) {
                aRecData.dislike_log = !(aRecData.dislike_log) ? {} : JSON.parse(aRecData.dislike_log)
            }

            if (aRecData.data) {
                let data = aRecData.data.replace("\n", ' ')
                data = JSON.parse(data)
                aRecData.data = data
                /* 处理提交数据后分组的问题 */
                // if (!empty(oAssocGrpTeamSchema)) {
                //     if (!empty(aRecData.group_id) && !isset(aRecData.data.{oAssocGrpTeamSchema.id})) {
                //         aRecData.data.{oAssocGrpTeamSchema.id} = aRecData.group_id
                //     }
                // }
                /* 处理提交数据后指定昵称题的问题 */
                if (aRecData.nickname && getDeepValue(oApp, 'assignedNickname.valid') === 'Y') {
                    let nicknameSchemaId = getDeepValue(oApp, 'assignedNickname.schema.id')
                    if (nicknameSchemaId) {
                        if (null === getDeepValue(aRecData.data, nicknameSchemaId, null)) {
                            setDeepValue(aRecData.data, nicknameSchemaId, aRecData.nickname)
                        }
                    }
                }
                /* 根据题目的可见性处理数据 */
                if (visibilitySchemas.length > 0) {
                    fnCheckSchemaVisibility(visibilitySchemas, aRecData.data)
                }
            }

            // 记录的分组
            if (aRecData.group_id) {
                // if (!isset(aGroupsById[aRecData.group_id])) {
                //     if (!isset(modelGrpTeam)) {
                //         modelGrpTeam = this.model('matter\group\team')
                //     }
                //     oGroup = modelGrpTeam.byId(aRecData.group_id, ['fields' => 'title'])
                //     aGroupsById[aRecData.group_id] = oGroup
                // } else {
                //     oGroup = aGroupsById[aRecData.group_id]
                // }
                // if (oGroup) {
                //     aRecData.group = oGroup
                // }
            }

            // 记录的记录轮次
            if (aRecData.rid) {
                // if (!isset(aRoundsById[aRecData.rid])) {
                //     if (!isset(modelRnd)) {
                //         modelRnd = this.model('matter\enroll\round')
                //     }
                //     round = modelRnd.byId(aRecData.rid, ['fields' => 'rid,title,purpose,start_at,end_at,state'])
                //     aRoundsById[aRecData.rid] = round
                // } else {
                //     round = aRoundsById[aRecData.rid]
                // }
                // if (round) {
                //     aRecData.round = round
                // }
            }

            aFnHandlers.forEach((fnHandler) => {
                fnHandler(aRecData)
            })
        }

        return aRecDatas
    }
    /**
     * 获得多项填写题数据
     */
    async getCowork(ek, schemaId, oOptions = {}) {
        
        return []
    }
}

function create(oApp = null, { debug = false } = {}) {
    return new Data(oApp, { debug })
}

module.exports = { Data, create }