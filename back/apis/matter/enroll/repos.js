const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const { getDeepValue, replaceHTMLTags } = require('../../../tms/utilities')
const Base = require('./base')
// const Tag2 = require('../../../models/matter/enroll/tag2')
// const Assoc = require('../../../models/matter/enroll/assoc')

class Repos extends Base {
    constructor(...args) {
        super(...args)
    }
    /**
     * 获得活动中作为内容分类目录使用的题目
     */
    async dirSchemasGet() {
        let oApp = this.app
        let dirSchemas = [] // 作为分类的题目
        let oSchemasById = {}
        for (let key in oApp.dataSchemas) {
            let oSchema = oApp.dataSchemas[key]
            if (oSchema.asdir && oSchema.asdir === 'Y') {
                oSchemasById[oSchema.id] = oSchema
                switch (oSchema.type) {
                case 'single':
                    if (!oSchema.optGroups) {
                        /* 根分类 */
                        oSchema.ops.forEach( (oOp) => {
                            let oRootDir = {}
                            oRootDir.schema_id = oSchema.id;
                            oRootDir.schema_type = 'single';
                            oRootDir.op = oOp;
                            dirSchemas.push(oRootDir)
                        })
                    } else {
                        for (let oOptGroup of oSchema.optGroups) {
                            if (oOptGroup.assocOp && oOptGroup.assocOp.v && oSchemasById[oOptGroup.assocOp.schemaId]) {
                                let oParentSchema = oSchemasById[oOptGroup.assocOp.schemaId]
                                for (let oAssocOp of oParentSchema.ops) {
                                    if (oAssocOp.v === oOptGroup.assocOp.v) {
                                        if (!oAssocOp.childrenDir) {
                                            oAssocOp.childrenDir = []
                                        }
                                        oSchema.ops.forEach ( (oOp) => {
                                            if (oOp.g && oOp.g === oOptGroup.i) {
                                                oAssocOp.childrenDir.push({'schema_id' : oSchema.id, 'op' : oOp})
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                    break
                case 'shorttext':
                    let modelData = this.model('matter/enroll/data')
                    modelData.setApp = oApp
                    if (!oSchema.historyAssoc) {
                        let oOptions = {}
                        oOptions.rid = !oApp.appRound ? '' : oApp.appRound.rid
                        oOptions.page = 1
                        oOptions.size = 99
                        let oResult = await modelData.bySchema(oApp, oSchema, oOptions)
                        oResult.records.forEach ((oRecData) => {
                            let oRootDir = {}
                            oRootDir.schema_id = oSchema.id
                            oRootDir.schema_type = 'shorttext'
                            oRootDir.op = {'v' : oRecData.value, 'l' : oRecData.value}
                            dirSchemas.push(oRootDir)
                        })
                    } else {
                        for (let oParentDirSchema of dirSchemas) {
                            if (oSchema.historyAssoc.includes(oParentDirSchema.schema_id)) {
                                let aChildrenDir = []
                                let oOptions = {}
                                oOptions.rid = !oApp.appRound ? '' : oApp.appRound.rid
                                oOptions.page = 1
                                oOptions.size = 99
                                oOptions.assocData = {}
                                oOptions.assocData[oParentDirSchema.schema_id] = oParentDirSchema.op.v
                                oResult = await modelData.bySchema(oApp, oSchema, oOptions)
                                oResult.records.forEach ((oRecData) => {
                                    let oChildOption = {}
                                    oChildOption = {'schema_id' : oSchema.id, 'op' : {'v' : oRecData.value, 'l' : oRecData.value}}
                                    aChildrenDir.push(oChildOption)
                                })
                                oParentDirSchema.op.childrenDir = aChildrenDir
                            }
                        }

                    }
                    break
                }
            }
        }

        return new ResultData(dirSchemas)
    }
    /**
     * 返回指定活动的填写记录的共享内容
     */
    async recordList() {
        let { page, size} = this.request.query
        if (!page || !size) {
            page = 1
            size = 12
        }
        
        let oApp = this.app
        let oUser = await this.getUser()
        // 填写记录过滤条件
        let oPosted = this.request.body ? this.request.body : {}
        // 填写记录过滤条件
        let oOptions = {}
        oOptions.page = page
        oOptions.size = size

        if (oPosted.keyword) 
            oOptions.keyword = oPosted.keyword

        if (oPosted.orderby) {
            switch (oPosted.orderby) {
            case 'earliest':
                oOptions.orderby = ['enroll_at asc']
                break;
            case 'lastest':
                oOptions.orderby = ['enroll_at'];
                break;
            case 'earliest_first':
                oOptions.orderby = ['first_enroll_at asc'];
                break;
            case 'lastest_first':
                oOptions.orderby = ['first_enroll_at desc'];
                break;
            case 'mostvoted':
                oOptions.orderby = ['vote_schema_num', 'enroll_at'];
                break;
            case 'mostliked':
                oOptions.orderby = ['like_num', 'enroll_at'];
                break;
            case 'agreed':
                oOptions.orderby = ['agreed', 'enroll_at'];
                break;
            }
        }

        // 查询结果
        let modelRec = this.model('matter/enroll/record')
        let oCriteria = {}
        oCriteria.record = {}
        oCriteria.record.rid = oPosted.rid ? oPosted.rid : 'all'

        /* 指定了分组过滤条件 */
        if (oPosted.userGroup)
            oCriteria.record.group_id = oPosted.userGroup

        /* 记录的创建人 */
        if (oPosted.mine && oPosted.mine === 'creator') {
            oCriteria.record.userid = oUser.uid
        } else if (oPosted.mine && oPosted.mine === 'favored') {
            // 当前用户收藏
            oCriteria.record.favored = true
        }
        /* 记录的表态 */
        if (oPosted.agreed && oPosted.agreed.toLowerCase() === 'all')
            oCriteria.record.agreed = oPosted.agreed
            
        /* 记录的标签 */
        if (oPosted.tags)
            oCriteria.record.tags = oPosted.tags

        if (oPosted.data)
            oCriteria.data = oPosted.data

        /* 答案的筛选 */
        if (oPosted.coworkAgreed && oPosted.coworkAgreed.toLowerCase() === 'all') {
            for (let oSchema of oApp.dynaDataSchemas) {
                if (oSchema.cowork && oSchema.cowork === 'Y') {
                    oCriteria.cowork = {}
                    oCriteria.cowork.agreed = oPosted.coworkAgreed
                    break
                }
            }
        }

        let oResult = await modelRec.byApp(oApp, oOptions, oCriteria, oUser)
        if (oResult.records) {
            await this._processDatas(oApp, oUser, oResult.records, 'recordList')
        }

        // 记录搜索事件
        // if (oPosted.keyword) {
        //     let modelSearch = new Search()
        //     let rest = await modelSearch.addUserSearch(oApp, oUser, oPosted.keyword)
        //     // 记录日志
        //     let modelEvent = new Event()
        //     modelEvent.searchRecord(oApp, rest['search'], oUser)
        // }

        return new ResultData(oResult)
    }
    /**
     * 返回指定活动的填写记录的共享内容
     * 答案视图
     */
    async coworkDataList() {
        let oApp = this.app
        let { page, size} = this.request.query
        if (!page || !size) {
            page = 1
            size = 12
        }
        
        let coworkSchemaIds = [];
        for (const k in oApp.dynaDataSchemas) {
            let oSchema = oApp.dynaDataSchemas[k]
            if (getDeepValue(oSchema, 'cowork') === 'Y') {
                coworkSchemaIds.push(oSchema.id)
            }
        }
        if (coworkSchemaIds.length === 0) {
            return new ResultFault('活动中没有协作题')
        }

        let oUser = await this.getUser()
        // 填写记录过滤条件
        let oOptions = {page : page, size : size}
        oOptions.regardRemarkRoundAsRecordRound = true // 将留言的轮次作为记录的轮次

        let oPosted = this.request.body ? this.request.body : {}
        if (oPosted.orderby) {
            switch (oPosted.orderby) {
            case 'earliest':
                oOptions.orderby = ['submit_at asc']
                break
            case 'lastest':
                oOptions.orderby = ['submit_at']
                break
            case 'mostvoted':
                oOptions.orderby = ['vote_num', 'submit_at']
                break
            case 'mostliked':
                oOptions.orderby = ['like_num', 'submit_at']
                break
            case 'agreed':
                oOptions.orderby = ['agreed', 'submit_at']
                break
            }
        }

        let oCriteria = {}
        if (oPosted.keyword) oCriteria.keyword = oPosted.keyword
        // 按指定题的值筛选
        if (oPosted.data) oCriteria.data = oPosted.data
        //对答案得筛选
        oCriteria.recordData = {}
        oCriteria.recordData.rid = oPosted.rid ? oPosted.rid : 'all'
        /* 指定了分组过滤条件 */
        if (oPosted.userGroup)
            oCriteria.recordData.group_id = oPosted.userGroup

        /* 答案的创建人 */
        if (oPosted.mine && oPosted.mine === 'creator')
            oCriteria.recordData.userid = oUser.uid

        /* 答案的表态 */
        if (oPosted.agreed && oPosted.agreed.toLowerCase() !== 'all')
            oCriteria.recordData.agreed = oPosted.agreed

        // 查询结果
        let modelRecDat = this.model('matter/enroll/data')
        modelRecDat.setApp = oApp
        let oResult = await modelRecDat.coworkDataByApp(oOptions, oCriteria, oUser)
        // 处理数据
        if (oResult.recordDatas)
            await this._processDatas(oApp, oUser, oResult.recordDatas, 'coworkDataList')

        // 记录搜索事件
        // if (oPosted.keyword) {
        //     let rest = this.model('matter\enroll\search').addUserSearch(oApp, oUser, oPosted.keyword);
        //     // 记录日志
        //     this.model('matter\enroll\event').searchRecord(oApp, rest['search'], oUser);
        // }

        return new ResultData(oResult)
    }
    /**
     * 解析数据
     */
    async _processDatas(oApp, oUser, rawDatas, processType = 'recordList', voteRules = null) {
        let modelTask
        if (oApp.voteConfig) {
            modelTask = this.model('matter/enroll/task')
            modelTask.setApp = oApp
        }
        /* 是否设置了编辑组 */
        let oEditorGrp = await this.getEditorGroup()
        
        let modelData = this.model('matter/enroll/data')
        modelData.setApp = oApp
        // let modelTag = new Tag2()
        // let modelAss = new Assoc()
        for (let rawData of rawDatas) {
            /* 获取记录的投票信息 */
            let aVoteRules
            if (oApp.voteConfig) {
                if (!voteRules) {
                    aVoteRules = await modelTask.getVoteRule(oUser, rawData.round)
                } else {
                    aVoteRules = voteRules
                }
            }
            let aCoworkState = {}
            let recordDirs = []
            if (rawData.data) {
                let processedData = {}
                for (let oSchema of oApp.dynaDataSchemas) {
                    let schemaId = oSchema.id
                    // 分类目录
                    if (getDeepValue(oSchema, 'asdir') === 'Y' && oSchema.ops && oSchema.ops.length && rawData.data[schemaId]) {
                        oSchema.ops.forEach((op) => {
                            if (op.v === rawData.data[schemaId]) {
                                recordDirs.push(op.l)
                            }
                        })
                    }
                    /* 清除非共享数据 */
                    if (getDeepValue(oSchema, 'shareable') !== 'Y') {
                        continue
                    }
                    // 过滤空数据
                    let rawDataVal = getDeepValue(rawData.data, schemaId, null)
                    if (null === rawDataVal) {
                        continue
                    }
                    // 选择题题目可见性规则
                    if (getDeepValue(oSchema, "visibility.rules")) {
                        let checkSchemaVisibility = true;
                        for (let k in oSchema.visibility.rules) {
                            let oRule = oSchema.visibility.rules[k]
                            if (schemaId.indexOf('member.extattr') === 0) {
                                let memberSchemaId = schemaId.replace('member.extattr.', '')
                                if (!rawData.data.member.extattr[memberSchemaId] || (rawData.data.member.extattr[memberSchemaId] !== oRule.op && !rawData.data.member.extattr[memberSchemaId])) {
                                    checkSchemaVisibility = false
                                }
                            } else if (!rawData.data[oRule.schema] || (rawData.data[oRule.schema] !== oRule.op && !rawData.data[oRule.schema][oRule.op])) {
                                checkSchemaVisibility = false
                            }
                        }
                        if (checkSchemaVisibility === false) {
                            continue
                        }
                    }

                    /* 协作填写题 */
                    if (getDeepValue(oSchema, 'cowork') === 'Y') {
                        if (processType === 'recordByTopic') {
                            // let items = modelData.getCowork(rawData.enroll_key, schemaId, {'excludeRoot' : true, 'agreed' : ['Y', 'A'], 'fields' : 'id,agreed,like_num,nickname,value'})
                            // aCoworkState[schemaId] = {'length' : items.length}
                            // processedData[schemaId] = items
                        } else if (processType === 'coworkDataList') {
                            let item = {}
                            item.id = rawData.data_id;
                            item.value = replaceHTMLTags(rawData.value);
                            processedData[schemaId] = [item]
                            delete rawData.value
                        } else {
                            let aOptions = {'fields' : 'id', 'agreed' : ['Y', 'A']}
                            let countItems = await modelData.getCowork(rawData.enroll_key, schemaId, aOptions)
                            aCoworkState[schemaId] = {'length' : countItems.length}
                        }
                    } else if (getDeepValue(oSchema, 'type') === 'multitext') {
                        let newData = [];
                        for (let val of rawDataVal) {
                            let val2 = {}
                            val2.id = val.id
                            val2.value = replaceHTMLTags(val.value)
                            newData.push(val2)
                        }
                        processedData[schemaId] = newData
                    } else if (getDeepValue(oSchema, 'type') === 'single') {
                        oSchema.ops.forEach ((val) => {
                            if (val.v === rawDataVal) {
                                processedData[schemaId] = val.l
                            }
                        })
                    } else if (getDeepValue(oSchema, 'type') === 'score') {
                        let ops = {}
                        oSchema.ops.forEach ((val) => {
                            ops[val.v] = val.l
                        })
                        let newData = []
                        for (let key in rawDataVal) {
                            let val = rawDataVal[key]
                            let data2 = {}
                            data2.title = ops[key]
                            data2.score = val
                            newData.push(data2)
                        }
                        processedData[schemaId] = newData
                    } else if (getDeepValue(oSchema, 'type') === 'multiple') {
                        let rawDataVal2 = rawDataVal.split(',')
                        let ops = {}
                        oSchema.ops.forEach ((val) => {
                            ops[val.v] = val.l
                        })
                        let newData = [];
                        rawDataVal2.forEach ((val) => {
                            newData.push(ops[val])
                        })
                        processedData[schemaId] = newData
                    } else {
                       processedData[schemaId] = rawDataVal
                    }
                }
                rawData.data = processedData

                if (Object.keys(aCoworkState).length > 0) {
                    rawData.coworkState = aCoworkState
                    // 协作填写题数据总数量
                    let sum = 0;
                    Object.keys(aCoworkState).forEach ((k) => {
                        let v = aCoworkState[k]
                        sum += v['length']
                    })
                    rawData.coworkDataTotal = sum
                }
                if (recordDirs.length > 0) {
                    rawData.recordDir = recordDirs
                }

                /* 获取记录的投票信息 */
                if (aVoteRules && Object.keys(aVoteRules).length > 0) {
                    // let oVoteResult = {}
                    // foreach (aVoteRules as schemaId => oVoteRule) {
                    //     if (processType === 'coworkDataList') {
                    //         continue;
                    //     } else if (processType === 'recordByTopic') {
                    //         if (this.getDeepValue(oVoteRule->schema, 'cowork') === 'Y') {continue;}
                    //         oRecData = modelData->byRecord(rawData->enroll_key, ['schema' => schemaId, 'fields' => 'id,vote_num']);
                    //         if (oRecData) {
                    //             vote_at = (int) modelData->query_val_ss(['vote_at', 'xxt_enroll_vote', ['rid' => oApp->appRound->rid, 'data_id' => oRecData->id, 'state' => 1, 'userid' => oUser->uid]]);
                    //             oRecData->vote_at = vote_at;
                    //             oRecData->state = oVoteRule->state;
                    //             oVoteResult->{schemaId} = oRecData;
                    //         }
                    //     } else {
                    //         oVoteResult = new \stdClass;
                    //         if (this->getDeepValue(oVoteRule->schema, 'cowork') === 'Y') {continue;}
                    //         oRecData = modelData->byRecord(rawData->enroll_key, ['schema' => schemaId, 'fields' => 'id,vote_num']);
                    //         if (oRecData) {
                    //             oVoteResult->{schemaId} = oRecData;
                    //         }
                    //     }
                    // }
                    // rawData->voteResult = oVoteResult;
                }
            }
            /* 设置昵称 */
            rawData = await this.setNickname(rawData, oUser, (oEditorGrp) ? oEditorGrp : null)
            /* 清除不必要的内容 */
            delete rawData.comment
            delete rawData.verified

            /* 是否已经被当前用户收藏 */
            if (processType === 'recordList' || processType === 'recordByTopic') {
                if (oUser.unionid && rawData.favor_num > 0) {
                    let db = await modelData.db()
                    let dbSelect = db.newSelectOne('xxt_enroll_record_favor', 'id')
                    dbSelect.where.and(['record_id = ' + rawData.id, "favor_unionid = '" + oUser.unionid + "'", 'state = 1'])
                    let rst = await dbSelect.exec()
                    if (rst)
                        rawData.favored = true
                }
            }
            /* 记录的标签 */
            if (processType === 'recordList') {
                // let oRecordTags = await modelTag.byRecord(rawData, oUser, {'UserAndPublic' : (oPosted.favored)})
                // if (oRecordTags.user)
                //     rawData.userTags = oRecordTags.user
                // if (oRecordTags.public)
                //     rawData.tags = oRecordTags.public;
            }
            /* 答案关联素材 */
            if (processType === 'coworkDataList') {
                // let oAssocsOptions = {
                //     'fields' : 'id,assoc_mode,assoc_num,first_assoc_at,last_assoc_at,entity_a_id,entity_a_type,entity_b_id,entity_b_type,public,assoc_text,assoc_reason'
                // }
                // let entityA = {}
                // entityA.id = rawData.data_id
                // entityA.type = 'data'
                // oAssocsOptions.entityA = entityA
                // let record = {}
                // record.id = rawData.record_id
                // let oAssocs = await modelAss.byRecord(record, oUser, oAssocsOptions)
                // if (oAssocs.length) {
                //     for (let oAssoc of oAssocs) {
                //         await modelAss.adapt(oAssoc)
                //     }
                // }
                // rawData.oAssocs = oAssocs
                // //
                // rawData.id = rawData.record_id
            }
        }

        return rawDatas
    }
    /**
     * 返回指定活动的填写记录的共享内容
     */
    async recordByTopic() {
        let oApp = this.app
        let { topic, page, size} = this.request.query
        if (!page || !size) {
            page = 1
            size = 12
        }

        let oUser = await this.getUser()

        // 填写记录过滤条件
        let oOptions = { page : page, size : size }

        // 查询结果
        let modelRec = this.model('matter/enroll/record')
        let modelTop = this.model('matter/enroll/topic')
        modelTop.setApp = oApp
        let oTopic = modelTop.byId(topic)

        let oResult = modelTop.records(oTopic, {'fields' : modelRec.REPOS_FIELDS})
        // if (!empty($oResult->records)) {
        //     /* 获取记录的投票信息 */
        //     if (!empty($oApp->voteConfig)) {
        //         $aVoteRules = $this->model('matter\enroll\task', $oApp)->getVoteRule($oUser);
        //     } else {
        //         $aVoteRules = null;
        //     }
        //     // 处理数据
        //     $this->_processDatas($oApp, $oUser, $oResult->records, 'recordByTopic', $aVoteRules);
        //     /**
        //      * 根据任务进行排序
        //      * 1、投票任务结束后，根据投票数排序
        //      * 2、投票进行中，指定了排序规则，按规则排序
        //      */
        //     if (!empty($oTopic->task_id) && !empty($oResult->records)) {
        //         $oTask = $this->model('matter\enroll\task', $oApp)->byId($oTopic->task_id);
        //         if ($oTask) {
        //             if ($oTask->config_type === 'vote') {
        //                 if ($oTask->state === 'AE') {
        //                     if (!empty($oTask->schemas)) {
        //                         $p = 'voteResult.' . $oTask->schemas[0] . '.vote_num';
        //                         usort($oResult->records, function ($a, $b) use ($p) {
        //                             $anum = $this->getDeepValue($a, $p, 0);
        //                             $bnum = $this->getDeepValue($b, $p, 0);
        //                             return $bnum - $anum;
        //                         });
        //                     }
        //                 }
        //             }
        //             if (in_array($oTask->config_type, ['vote', 'answer'])) {
        //                 if ($this->getDeepValue($oTask, 'source.orderby') === 'random') {
        //                     shuffle($oResult->records);
        //                 }
        //             }
        //         }
        //     }
        // }

        return new ResultData(oResult)
    }
    /**
     * 获得一条记录可共享的内容
     */
    async recordGet() {
        let { ek } = this.request.query
        let oApp = this.app

        let modelRec = this.model('matter/enroll/record')
        let fields = 'id,state,aid,rid,enroll_key,userid,group_id,nickname,verified,enroll_at,first_enroll_at,supplement,score,like_num,like_log,remark_num,rec_remark_num,favor_num,agreed,data,dislike_num,dislike_log'
        let oRecord = await modelRec.byId(ek, {'fields' : fields})
        if (false === oRecord || oRecord.state != 1) {
            return new ResultObjectNotFound()
        }
        let oUser = await this.getUser(oApp)

        let oRecords = [oRecord]
        this._processDatas(oApp, oUser, oRecords, 'recordList')

        return new ResultData(oRecord)
    }
}

module.exports = Repos