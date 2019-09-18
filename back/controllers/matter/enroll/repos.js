const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/ctrl')
const { getDeepValue, replaceHTMLTags } = require('../../../tms/utilities')
const Base = require('./base')

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
        let { page = 1, size = 12} = this.request.query
        
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

        oResult.datas = oResult.records
        delete oResult.records
        return new ResultData(oResult)
    }
    /**
     * 返回指定活动的填写记录的共享内容
     * 答案视图
     */
    async coworkList() {
        let oApp = this.app
        let { page = 1, size = 12} = this.request.query
        
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
        
        oResult.datas = oResult.recordDatas
        delete oResult.recordDatas
        return new ResultData(oResult)
    }
    /**
     * 所有专题列表
     */
    async topicList() {
        let oApp = this.app

        let oPosted = this.request.body ? this.request.body : {}
        let oUser = await this.getUser()

        let w = `state=1 and aid='${oApp.id}'`
        if (oPosted.keyword) {
            w += " and (title like '%" + oPosted.keyword + "%' or summary like '%" + oPosted.keyword + "%')"
        }
        //
        w += " and ("
        if (getDeepValue(oPosted, "mine") === 'creator') {
            if (!oUser.unionid) {
                return new ResultFault('仅支持注册用户创建，请登录后再进行此操作')
            }
            w += `unionid='${oUser.unionid}'`
            if (oUser.group_id) {
                w += ` or (share_in_group='Y' and group_id='${oUser.group_id}')`
            }
        } else if (getDeepValue(oPosted, "mine") === 'public') {
            // 公共专题
            w += "is_public = 'Y'"
        } else {
            w += "is_public = 'Y'"
            if (oUser.unionid) {
                w += ` or unionid='${oUser.unionid}'`
                if (oUser.group_id) {
                    w += ` or (share_in_group='Y' and group_id='${oUser.group_id}')`
                }
            }
        }
        w += ")"

        let fields = 'id,create_at,title,summary,rec_num,userid,group_id,nickname,share_in_group,is_public'
        
        let orderby = 'create_at desc'
        if (oPosted.orderby) {
            switch (oPosted.orderby) {
            case 'earliest':
                orderby = 'create_at asc'
                break
            case 'lastest':
                orderby = 'create_at desc'
                break
            }
        }
                
        let modelTopic = this.model('matter/enroll/topic')
        let topics = await modelTopic.select(fields, [['and', [w]]], { orderby : orderby})
        topics.forEach ((oTopic) => {
            if (oTopic.userid === oUser.uid) {
                oTopic.nickname = '我'
            }
        })

        let oResult = {}
        oResult.topics = topics
        oResult.total = topics.length

        // 记录搜索事件
        // if (!empty(oPosted.keyword)) {
        //     rest = this.model('matter\enroll\search').addUserSearch(oApp, oUser, oPosted.keyword)
        //     // 记录日志
        //     this.model('matter\enroll\event').searchRecord(oApp, rest['search'], oUser)
        // }

        oResult.datas = oResult.topics
        delete oResult.topics
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
                    //         if (this.getDeepValue(oVoteRule.schema, 'cowork') === 'Y') {continue;}
                    //         oRecData = modelData.byRecord(rawData.enroll_key, ['schema' => schemaId, 'fields' => 'id,vote_num']);
                    //         if (oRecData) {
                    //             vote_at = (int) modelData.query_val_ss(['vote_at', 'xxt_enroll_vote', ['rid' => oApp.appRound.rid, 'data_id' => oRecData.id, 'state' => 1, 'userid' => oUser.uid]]);
                    //             oRecData.vote_at = vote_at;
                    //             oRecData.state = oVoteRule.state;
                    //             oVoteResult.{schemaId} = oRecData;
                    //         }
                    //     } else {
                    //         oVoteResult = new \stdClass;
                    //         if (this.getDeepValue(oVoteRule.schema, 'cowork') === 'Y') {continue;}
                    //         oRecData = modelData.byRecord(rawData.enroll_key, ['schema' => schemaId, 'fields' => 'id,vote_num']);
                    //         if (oRecData) {
                    //             oVoteResult.{schemaId} = oRecData;
                    //         }
                    //     }
                    // }
                    // rawData.voteResult = oVoteResult;
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
        let { topic, page = 1, size = 12} = this.request.query

        let oUser = await this.getUser()

        // 填写记录过滤条件
        let oOptions = { page : page, size : size }

        // 查询结果
        let modelRec = this.model('matter/enroll/record')
        let modelTop = this.model('matter/enroll/topic')
        modelTop.setApp = oApp
        let oTopic = await modelTop.byId(topic)

        let oResult = await modelTop.records(oTopic, {'fields' : modelRec.REPOS_FIELDS})
        // if (!empty(oResult.records)) {
        //     /* 获取记录的投票信息 */
        //     if (!empty(oApp.voteConfig)) {
        //         aVoteRules = this.model('matter\enroll\task', oApp).getVoteRule(oUser);
        //     } else {
        //         aVoteRules = null;
        //     }
        //     // 处理数据
        //     this._processDatas(oApp, oUser, oResult.records, 'recordByTopic', aVoteRules);
        //     /**
        //      * 根据任务进行排序
        //      * 1、投票任务结束后，根据投票数排序
        //      * 2、投票进行中，指定了排序规则，按规则排序
        //      */
        //     if (!empty(oTopic.task_id) && !empty(oResult.records)) {
        //         oTask = this.model('matter\enroll\task', oApp).byId(oTopic.task_id);
        //         if (oTask) {
        //             if (oTask.config_type === 'vote') {
        //                 if (oTask.state === 'AE') {
        //                     if (!empty(oTask.schemas)) {
        //                         p = 'voteResult.' . oTask.schemas[0] . '.vote_num';
        //                         usort(oResult.records, function (a, b) use (p) {
        //                             anum = this.getDeepValue(a, p, 0);
        //                             bnum = this.getDeepValue(b, p, 0);
        //                             return bnum - anum;
        //                         });
        //                     }
        //                 }
        //             }
        //             if (in_array(oTask.config_type, ['vote', 'answer'])) {
        //                 if (this.getDeepValue(oTask, 'source.orderby') === 'random') {
        //                     shuffle(oResult.records);
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
        let oUser = await this.getUser()

        let oRecords = [oRecord]
        this._processDatas(oApp, oUser, oRecords, 'recordList')

        return new ResultData(oRecord)
    }
    /**
     * 获取活动共享页筛选条件
     */
    async criteriaGet() {
        let { viewType = 'record' } = this.request.query

        let oUser = await this.getUser()

        let oCriterias = this._originCriteriaGet()
        let result = await this._packCriteria(oUser, oCriterias, viewType)
        if (result[0] === false) {
            return new ResultFault(result[1])
        }

        let criterias = result[1]
        return new ResultData(criterias)
    }
    /**
     * 按当前用户角色过滤筛选条件
     */
    async _packCriteria(oUser, criterias, viewType = 'record') {
        let oApp = this.app
        if (!Array.isArray(criterias)) {
            return [false, '参数格式错误！']
        }

        for (let key in criterias) {
            let oCriteria = criterias[key]
            // 默认排序
            if (oCriteria.type === 'orderby') {
                if (viewType === 'topic') {
                    oCriteria.menus = []
                    oCriteria.menus.push({'id' : 'lastest', 'title' : '最近创建'})
                    oCriteria.menus.push({'id' : 'earliest', 'title' : '最早创建'})
                    oCriteria.default = oCriteria.menus[0]
                } else {
                    if (getDeepValue(oApp, "reposConfig.defaultOrder")) {
                        for (let i in oCriteria.menus) {
                            let v = oCriteria.menus[i]
                            if (v.id === oApp.reposConfig.defaultOrder) {
                                oCriteria.default = oCriteria.menus[i]
                                break
                            }
                        }
                    }
                }
            }
            //获取轮次
            if (oCriteria.type === 'rid') {
                if (viewType === 'topic') {
                    criterias.splice(key, 1)
                } else {
                    let modelRun = this.model('matter/enroll/round')
                    let options = {'fields' : 'rid,title', 'state' : ['1', '2']}
                    let result = await modelRun.byApp(oApp, options)
                    if (result.rounds.length == 1) {
                        criterias.splice(key, 1)
                    } else {
                        result.rounds.forEach( (round) => {
                            if (round.rid === result.active.rid) {
                                oCriteria.menus.push({'id' : round.rid, 'title' : '(当前填写轮次) ' . round.title})
                            } else {
                                oCriteria.menus.push({'id' : round.rid, 'title' : round.title})
                            }
                        })
                    }
                }
            }
            // 如果有答案的题型才显示筛选答案的按钮
            if (oCriteria.type === 'coworkAgreed') {
                let coworkState = false
                if (viewType === 'record') {
                    for (let oSchema of oApp.dynaDataSchemas) {
                        if (getDeepValue(oSchema, "cowork") === 'Y') {
                            coworkState = true
                            break
                        }
                    }
                }
                if (!coworkState) {
                    criterias.splice(key, 1)
                }
            }
            // 获取分组
            if (oCriteria.type === 'userGroup') {
                if (viewType === 'topic') {
                    criterias.splice(key, 1)
                } else if (getDeepValue(oApp, "entryRule.group.id", null) !== null) {
                    criterias.splice(key, 1)
                } else {
                    // let assocGroupAppId = oApp.entryRule.group.id
                    // let modelGrpTeam = this.model('matter/group/team')
                    // let groups = modelGrpTeam.byApp(assocGroupAppId, {'fields' : "team_id,title"})
                    // if (!groups) {
                    //     criterias.splice(key, 1)
                    // } else {
                    //     groups.forEach((group) => {
                    //         oCriteria.menus.push({'id' : group.team_id, 'title' : group.title})
                    //     })
                    // }
                    criterias.splice(key, 1)
                }
            }
            /*
             *表态 当用户为编辑或者超级管理员或者有组时才会出现“接受”，“关闭” ，“讨论”，“未表态” ，否则只有推荐和不限两种
             */
            if (oCriteria.type === 'agreed') {
                if (viewType === 'topic') {
                    criterias.splice(key, 1)
                } else if (oUser.group_id || getDeepValue(oUser.is_leader) === 'S' || getDeepValue(oUser.is_editor) === 'Y') {
                    oCriteria.menus.push({'id' : 'A', 'title' : '接受'})
                    oCriteria.menus.push({'id' : 'D', 'title' : '讨论'})
                    oCriteria.menus.push({'id' : 'N', 'title' : '关闭'})
                }
            }
            // 只有登录用户才会显示我的记录和我的收藏
            if (oCriteria.type === 'mine') {
                if (!oUser.unionid) {
                    criterias.splice(key, 1)
                } else if (viewType === 'record') {
                    oCriteria.menus.push({'id' : 'creator', 'title' : '我的记录'})
                    oCriteria.menus.push({'id' : 'favored', 'title' : '我的收藏'})
                } else if (viewType === 'coworkData') {
                    oCriteria.menus.push({'id' : 'creator', 'title' : '我的回答'})
                } else if (viewType === 'topic') {
                    oCriteria.menus.push({'id' : 'creator', 'title' : '我的专题'})
                    oCriteria.menus.push({'id' : 'public', 'title' : '公共专题'})
                } else {
                    criterias.splice(key, 1)
                }
            }
            // 搜索历史
            if (oCriteria.type === 'keyword') {
                // let search = this.model('matter/enroll/search').listUserSearch(oApp, oUser)
                // let userSearchs = search.userSearch
                // userSearchs.forEach ( (userSearch) => {
                //     oCriteria.menus.push({'id' : userSearch.keyword, 'title' : userSearch.keyword})
                // })
                oCriteria.menus.push({'id' : 'test', 'title' : 'test'})
            }
        }

        return [true, criterias]
    }
    /**
     * 获得所有条件
     */
    _originCriteriaGet() {
        let criterias = []
        // 排序
        let orderby = {}
        orderby.type = 'orderby'
        orderby.title = '排序'
        orderby.menus = [
            {'id' : 'lastest', 'title' : '最近提交'},
            {'id' : 'earliest', 'title' : '最早提交'},
            {'id' : 'mostliked', 'title' : '最多赞同'},
            {'id' : 'mostvoted', 'title' : '最多投票'},
        ]
        orderby.default = orderby.menus[0]
        criterias.push(orderby)
        // 搜索历史
        let keyword = {}
        keyword.type = 'keyword'
        keyword.title = '历史'
        keyword.menus = [
            {'id' : null, 'title' : '不限'}
        ]
        keyword.default = keyword.menus[0]
        criterias.push(keyword)
        // 协作
        let coworkAgreed = {}
        coworkAgreed.type = 'coworkAgreed'
        coworkAgreed.title = '协作'
        coworkAgreed.menus = [
            {'id' : null, 'title' : '所有问题'},
            {'id' : 'answer', 'title' : '已回答'},
            {'id' : 'unanswer', 'title' : '等待回答'},
        ]
        coworkAgreed.default = coworkAgreed.menus[0]
        criterias.push(coworkAgreed)
        // 轮次
        let round = {}
        round.type = 'rid'
        round.title = '轮次'
        round.menus = [
            {'id' : null, 'title' : '不限'}
        ]
        round.default = round.menus[0]
        criterias.push(round)
        // 分组
        let group = {}
        group.type = 'userGroup'
        group.title = '分组'
        group.menus = [
            {'id' : null, 'title' : '不限'},
        ]
        group.default = group.menus[0]
        criterias.push(group)
        // 表态
        let agreed = {}
        agreed.type = 'agreed'
        agreed.title = '表态'
        agreed.menus = [
            {'id' : null, 'title' : '不限'},
            {'id' : 'Y', 'title' : '推荐'},
        ]
        agreed.default = agreed.menus[0]
        criterias.push(agreed)
        // 我的
        let mine = {}
        mine.type = 'mine'
        mine.title = '我的'
        mine.menus = [
            {'id' : null, 'title' : '不限'},
        ]
        mine.default = mine.menus[0]
        criterias.push(mine)

        return criterias
    }
}

module.exports = Repos