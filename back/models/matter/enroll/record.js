const { Base: MatterBase } = require('../base')
const { getDeepValue } = require('../../../tms/utilities')
const { create : Enroll } = require('../../../models/matter/enroll')
const { create : Data } = require('../../../models/matter/enroll/data')
const { create : Round } = require('../../../models/matter/enroll/round')
const { create : Schema } = require('../../../models/matter/enroll/schema')
// const GroupRecord = require('../../../models/matter/group/record')()
// const Groupteam = require('../../../models/matter/group/team')

class Record extends MatterBase {

	constructor({ debug = false } = {}) {
		super('xxt_enroll_record', { debug })
		
		this.REPOS_FIELDS = 'id,enroll_key,aid,rid,purpose,userid,nickname,group_id,first_enroll_at,enroll_at,enroll_key,data,agreed,agreed_log,dislike_data_num,dislike_log,dislike_num,favor_num,like_data_num,like_log,like_num,rec_remark_num,remark_num,score,supplement,tags,vote_cowork_num,vote_schema_num'
	}
	
    async byId(ek, aOptions = {}) {
		let fields = "fields" in aOptions ? aOptions.fields : '*';
		let verbose = "verbose" in aOptions ? aOptions.verbose : 'N';

		let db = await this.db()
        let dbSelect = db.newSelectOne('xxt_enroll_record', fields)
        dbSelect.where.fieldMatch('enroll_key', '=', ek)
		if (aOptions.state) {
			dbSelect.where.fieldMatch('state', '=', aOptions.state)
		}

		let oRecord = await dbSelect.exec()

		if (oRecord) {
			oRecord = await this._processRecord(oRecord, fields, verbose)
		}

		return oRecord
	}
	/**
	 * 处理从数据库中取出的数据
	 */
	async _processRecord(oRecord, fields, verbose = 'Y') {
		if (fields === '*' || "data" in oRecord) {
			oRecord.data = oRecord.data == '' ? {} : JSON.parse(oRecord.data);
		}
		if (fields === '*' || 'supplement' in oRecord) {
			oRecord.supplement = oRecord.supplement == '' ? {} : JSON.parse(oRecord.supplement);
		}
		if (fields === '*' || 'score' in oRecord) {
			oRecord.score = oRecord.score ? {} : JSON.parse(oRecord.score);
		}
		if (fields === '*' || 'agreed_log' in oRecord) {
			oRecord.agreed_log = oRecord.agreed_log ? {} : JSON.parse(oRecord.agreed_log);
		}
		if (fields === '*' || 'like_log' in oRecord) {
			oRecord.like_log = oRecord.like_log ? {} : JSON.parse(oRecord.like_log);
		}
		if (fields === '*' || 'dislike_log' in oRecord) {
			oRecord.dislike_log = oRecord.dislike_log ? {} : JSON.parse(oRecord.dislike_log);
		}
		if (verbose === 'Y' && "enroll_key" in oRecord) {
			let modelData = Data()
			oRecord.verbose = await modelData.byRecord(oRecord.enroll_key)
		}
		if (oRecord.rid) {
			let modelRound = Round()
			let oRound = await modelRound.byId(oRecord.rid, {'fields' : 'id,rid,title,state,start_at,end_at,purpose'})
			if (oRound) {
				oRecord.round = oRound;
			} else {
				oRecord.round = {};
				oRecord.round.title = '';
			}
		}
		
		return oRecord;
	}
	/**
	 * 记录清单
	 *
	 * @param object/string 记录活动/记录活动的id
	 * @param object/array $oOptions
	 * --page
	 * --size
	 * --kw 检索关键词
	 * --by 检索字段
	 * @param object $oCriteria 记录数据过滤条件
	 * @param object $oUser ['uid','group_id']
	 *
	 * @return object
	 * records 数据列表
	 * total 数据总条数
	 */
	async byApp(oApp, oOptions = null, oCriteria = null, oUser = null) {
		if (!oOptions) oOptions = {}
		if (!oCriteria) oCriteria = {}
		if (typeof oApp === "string") {
			let modelEnroll = Enroll()
			oApp = await modelEnroll.byId(oApp, {'cascaded' : 'N'})
		}
		if (false === oApp && !oApp.dynaDataSchemas) {
			return false
		}

		let modelSchema = Schema()
		let aSchemasById = await modelSchema.asAssoc(oApp.dynaDataSchemas)

		// 指定记录活动下的记录记录
		let w = "r.state=1 and r.aid='" + oApp.id + "'"

		/* 指定轮次，或者当前激活轮次 */
		if (!oCriteria.record || !oCriteria.record.rid) {
			if (oApp.appRound && oApp.appRound.rid) {
				let rid = oApp.appRound.rid
				w += " and (r.rid='" + rid + "')"
			}
		} else if (oCriteria.record && oCriteria.record.rid) {
			if (typeof oCriteria.record.rid === 'string') {
				if (oCriteria.record.rid.toLowerCase() !== 'all') {
					let rid = oCriteria.record.rid
					w += " and (r.rid='" + rid + "')"
				}
			} else if (Array.isArray(oCriteria.record.rid)) {
				let rids = oCriteria.record.rid
				w += " and r.rid in('" + rids.join("','") + "')"
			}
		}

		if (oCriteria.record) {
			// 根据用户分组过滤
			if (oCriteria.record.group_id) {
				w += " and r.group_id='" + oCriteria.record.group_id + "'"
			}
			// 根据填写人筛选（填写端列表页需要）
			if (oCriteria.record.userid) {
				w += " and r.userid='" + oCriteria.record.userid + "'"
			}
			// 记录是否通过审核
			if (oCriteria.record.verified) {
				w += " and r.verified='" + oCriteria.record.verified + "'"
			}
			// 指定了专题的
			if (oCriteria.record.topic) {
				w += " and exists(select 1 from xxt_enroll_topic_record t where r.id=t.record_id and t.topic_id='{$oCriteria.record.topic}')"
			}
			// 指定了记录标签
			if (oCriteria.record.tags) {
				if (Array.isArray(oCriteria.record.tags)) {
					oCriteria.record.tags.forEach((tagId) => {
						w += " and exists(select 1 from xxt_enroll_tag_target tt where tt.target_id=r.id and tt.target_type=1 and tt.tag_id=" + tagId + ")"
					})
				} else {
					w += " and exists(select 1 from xxt_enroll_tag_target tt where tt.target_id=r.id and tt.target_type=1 and tt.tag_id=" + oCriteria.record.tags + ")"
				}
			}
		}
		/**
		 * 记录推荐状态
		 */
		if (oCriteria.record && oCriteria.record.agreed) {
			w += " and r.agreed='" + oCriteria.record.agreed + "'"
		} else {
			// 屏蔽状态的记录默认不可见
			w += " and r.agreed<>'N'"
		}
		// 讨论状态的记录仅提交人，同组用户或超级用户可见
		if (oUser) {
			// 当前用户收藏的
			if (oUser.unionid && getDeepValue(oCriteria, "record.favored")) {
				w += " and exists(select 1 from xxt_enroll_record_favor f where r.id=f.record_id and f.favor_unionid='" + oUser.unionid + "' and f.state=1)"
			}
			// 当前用户角色
			if (!oUser.is_leader || oUser.is_leader !== 'S') {
				if (oUser.uid) {
					w += " and ("
					w += " (r.agreed<>'D'"
					if (oUser.is_editor && oUser.is_editor !== 'Y') {
						w += " and r.agreed<>''"  // 如果活动指定了编辑，未表态的数据默认不公开
					}
					w += ")"
					w += " or r.userid='" + oUser.uid + "'";
					if (oUser.group_id) {
						w += " or r.group_id='" + oUser.group_id + "'"
					}
					if (oUser.is_editor && oUser.is_editor === 'Y') {
						w += " or r.group_id=''"
					}
					w += ")"
				}
			}
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

		// 指定了按关键字过滤
		if (oOptions.keyword) {
			w += ' and (data like \'%' + oOptions.keyword + '%\')'
		}
		// 筛选答案
		if (oCriteria.cowork) {
			let coworkSchemaIds = []
			Object.keys(aSchemasById).forEach((oSchemaId) => {
				let oSchema = aSchemasById.oSchemaId
				if (oSchema.cowork && oSchema.cowork === 'Y') {
					coworkSchemaIds.push(oSchemaId)
				}
			})
			coworkSchemaIds = "('" + coworkSchemaIds.join("','") + "')"
			if (coworkSchemaIds) {
				if (oCriteria.cowork.agreed && !oCriteria.cowork.agreed) {
					// 如果查询未表态的问题需要所有的答案都未表态才返回
					w += " and 0 = (select count(rd.id) from xxt_enroll_record_data rd where rd.enroll_key = r.enroll_key and rd.agreed <> '' and rd.state=1 and rd.schema_id in " + coworkSchemaIds + " and rd.rid = r.rid)"
				} else if (oCriteria.cowork.agreed && oCriteria.cowork.agreed === 'answer') {
					// 如果查询已回答的问题，答案表态为A或者Y的都算已回答
					w += " and exists(select 1 from xxt_enroll_record_data rd where r.enroll_key = rd.enroll_key and (rd.agreed = 'Y' or rd.agreed = 'A') and rd.state=1 and rd.schema_id in " + coworkSchemaIds + " and rd.rid = r.rid)"
				} else if (oCriteria.cowork.agreed && oCriteria.cowork.agreed === 'unanswer') {
					// 如果查询未回答的问题需要查询所有的答案表态都不是“Y”和“A”才返回
					w += " and 0 = (select count(rd.id) from xxt_enroll_record_data rd where rd.enroll_key = r.enroll_key and (rd.agreed = 'Y' or rd.agreed = 'A') and rd.state=1 and rd.schema_id in " + coworkSchemaIds + " and rd.rid = r.rid)"
				} else if (oCriteria.cowork.agreed) {
					w += " and exists(select 1 from xxt_enroll_record_data rd where r.enroll_key = rd.enroll_key and rd.agreed = '{$oCriteria.cowork.agreed}' and rd.state=1 and rd.schema_id in " + coworkSchemaIds + " and rd.rid = r.rid)"
				}
			}
		}

		// 查询参数
		let fields
		let table = "xxt_enroll_record r"
		if (oOptions.fields) {
			fields = oOptions.fields
		} else {
			fields = 'id,state,enroll_key,rid,purpose,enroll_at,userid,group_id,nickname,verified,comment,data,score,supplement,agreed,like_num,like_log,remark_num,favor_num,dislike_num,dislike_log'
		}

		let q2 = {}
		// 查询结果分页
		if (oOptions.page && oOptions.size) {
			q2.r = {'o' : (parseInt(oOptions.page) - 1) * parseInt(oOptions.size), 'l' : parseInt(oOptions.size)}
		}

		// 查询结果排序
		if (oOptions.orderby) {
			if (oOptions.schemaId) {
				let schemaId = oOptions.schemaId
				let orderby = oOptions.orderby
				table += ",xxt_enroll_record_data d"
				w += " and r.enroll_key = d.enroll_key and d.schema_id = '$schemaId' and d.multitext_seq = 0"
				q2.o = 'd.' + orderby + ' desc'
			} else {
				let fnOrderBy = (orderbys) => {
					if(typeof orderbys === 'string') {
						orderbys = [orderbys]
					}
					let sqls = []
					orderbys.forEach ((orderby) => {
						switch (orderby) {
						case 'sum':
							sqls.push('r.score desc')
							break;
						case 'agreed':
							sqls.push('r.agreed desc')
							break;
						case 'vote_schema_num':
							sqls.push('r.vote_schema_num desc')
							break;
						case 'vote_cowork_num':
							sqls.push('r.vote_cowork_num desc')
							break;
						case 'like_num':
							sqls.push('r.like_num desc')
							break;
						case 'enroll_at':
							sqls.push('r.enroll_at desc')
							break;
						case 'enroll_at asc':
							sqls.push('r.enroll_at')
							break;
						case 'first_enroll_at desc':
							sqls.push('r.first_enroll_at desc')
							break;
						case 'first_enroll_at asc':
							sqls.push('r.first_enroll_at')
							break;
						}
					})
					return sqls.join(',')
				}
				q2.o = fnOrderBy(oOptions.orderby)
			}
		} else {
			q2.o = 'r.enroll_at desc'
		}
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
		
		let records = await dbSelect.exec()

		/* 检查题目是否可见 */
		oResult.records = await this.parse(oApp, records)

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
	async parse(oApp, records) {
		let bRequireScore = false // 数值型的填空题需要计算分值
		let visibilitySchemas = [] // 设置了可见性规则的题目
		if (oApp.dynaDataSchemas) {
			oApp.dynaDataSchemas.forEach ((oSchema) => {
				if (oSchema.requireScore && oSchema.requireScore === 'Y') {
					bRequireScore = true
				}
				if (oSchema.visibility && oSchema.visibility.rules) {
					visibilitySchemas.push(oSchema)
				}
			})
		}
		// 关联的分组题
		let modelSchema = Schema(oApp)
		let oAssocGrpTeamSchema = await modelSchema.getAssocGroupTeamSchema()
		let aGroupsById = []; // 缓存分组数据
		let aRoundsById = []; // 缓存轮次数据

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

		let aFnHandlers = []; // 记录处理函数
		// if (oApp.scenario) {
		// 	/* 记录得分 */
		// 	$aFnHandlers[] = function ($oRec) use ($oApp, $bRequireScore) {
		// 		if ($bRequireScore && !empty($oRec->score)) {
		// 			$score = str_replace("\n", ' ', $oRec->score);
		// 			$score = json_decode($score);
		// 			if ($score === null) {
		// 				$oRec->score = 'json error(' . json_last_error_msg() . '):' . $oRec->score;
		// 			} else {
		// 				$oRec->score = $score;
		// 			}
		// 		}
		// 	};
		// 	// 记录的分数
		// 	if ($oApp->scenario === 'voting' || $oApp->scenario === 'common') {
		// 		$scoreSchemas = $this->_mapOfScoreSchema($oApp);
		// 		$countScoreSchemas = count(array_keys((array) $scoreSchemas));
		// 		$aFnHandlers[] = function ($oRec) use ($scoreSchemas, $countScoreSchemas) {
		// 			$oRec->_score = $this->_calcVotingScore($scoreSchemas, oRec.data);
		// 			$oRec->_average = $countScoreSchemas === 0 ? 0 : $oRec->_score / $countScoreSchemas;
		// 		};
		// 	}
		// }
		/* 用户所属分组 */
		// if (oApp.entryRule && oApp.entryRule.group && oApp.entryRule.group.id) {
		// 	let userGroupFuc = function (oRec) {
		// 		let groupAppId = oApp.entryRule.group.id
		// 		if (oRec.userid) {
		// 			let oGrpUser = await GroupRecord.byUser((object) {'id' : groupAppId}, oRec.userid, {'fields' : 'team_id,team_title', 'onlyOne' : true});
		// 			if ($oGrpUser) {
		// 				if (!oRec.user) {
		// 					oRec.user = {}
		// 				}
		// 				oRec.user.group = {'id' : oGrpUser.team_id, 'title' : oGrpUser.team_title}
		// 			}
		// 		}
		// 	}
		// }
		// aFnHandlers.push(userGroupFuc)
		let modelRound = Round()
		for (let ri = 0; ri < records.length; ri++) {
			let oRec = records[ri]
			if (oRec.like_log) {
				oRec.like_log = !oRec.like_log ? {} : JSON.parse(oRec.like_log)
			}
			if (oRec.dislike_log) {
				oRec.dislike_log = !oRec.dislike_log ? {} : JSON.parse(oRec.dislike_log)
			}
			//附加说明
			if (oRec.supplement) {
				let supplement = oRec.supplement.replace("\n", ' ')
				supplement = JSON.parse(supplement);

				if (supplement) {
					oRec.supplement = supplement
				}
			}
			if (typeof oRec.data !== 'undefined') {
				if (oRec.data) {
					let data = oRec.data.replace("\n", ' ')
					data = JSON.parse(data)
					if (data) {
						oRec.data = data;
						/* 处理提交数据后分组的问题 */
						if (oAssocGrpTeamSchema) {
							if (oRec.group_id && !oRec.data[oAssocGrpTeamSchema.id]) {
								oRec.data[oAssocGrpTeamSchema.id] = oRec.group_id
							}
						}
						/* 处理提交数据后指定昵称题的问题 */
						if (oRec.nickname && oApp.assignedNickname && oApp.assignedNickname.valid && oApp.assignedNickname.valid === 'Y') {
							if (oApp.assignedNickname.schema.id) {
								let nicknameSchemaId = oApp.assignedNickname.schema.id;
								if (!oRec.data[nicknameSchemaId]) {
									oRec.data[nicknameSchemaId] = oRec.nickname
								}
							}
						}
						/* 根据题目的可见性处理数据 */
						if (oRec.purpose && oRec.purpose === 'C' && visibilitySchemas.length > 0) {
							fnCheckSchemaVisibility(visibilitySchemas, oRec.data)
						}
					}
				} else {
					oRec.data = {}
				}
			}
			// 记录的分组
			// if (oRec.group_id) {
			// 	if (!aGroupsById[oRec.group_id]) {
					// let modelGroupteam = new Groupteam()
			// 		let oGroup = modelGroupteam.byId(oRec.group_id, {'fields' : 'title')
			// 		delete oGroup.type
			// 		aGroupsById[oRec.group_id] = oGroup
			// 	} else {
			// 		oGroup = aGroupsById[oRec.group_id]
			// 	}
			// 	if (oGroup) {
			// 		oRec.group = oGroup
			// 	}
			// }
			// 记录的记录轮次
			if (oRec.rid) {
				let round2
				if (!aRoundsById[oRec.rid]) {
					round2 = await modelRound.byId(oRec.rid, {'fields' : 'rid,title,purpose,start_at,end_at,state'})
					aRoundsById[oRec.rid] = round2
				} else {
					round2 = aRoundsById[oRec.rid]
				}
				if (round2) {
					oRec.round = round2;
				}
			}

			for (let i = 0; i < aFnHandlers.length; i++) {
				aFnHandlers[i](oRec)
			}
		}

		return records
	}
}

function create({ debug = false } = {}) {
    return new Record({ debug })
}

module.exports = { Record, create }