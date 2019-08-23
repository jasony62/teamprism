const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const { getDeepValue, replaceHTMLTags } = require('../../../tms/utilities')
const Base = require('./base')
const Enroll = require('../../../models/matter/enroll')
const Record = require('../../../models/matter/enroll/record')
const Data = require('../../../models/matter/enroll/data')
const Task = require('../../../models/matter/enroll/task')

class Repos extends Base {
    constructor(...args) {
        super(...args)
    }
    /**
     * 获得活动中作为内容分类目录使用的题目
     */
    async dirSchemasGet() {
        let { app } = this.request.query
        let modelApp = new Enroll()
        let oApp = await modelApp.byId(app, {'cascaded' : 'N', 'fields' : 'id,state,data_schemas'})
        modelApp.end()
        if (oApp === false || oApp.state != '1') {
            return new ResultObjectNotFound()
        }

        let dirSchemas = [] // 作为分类的题目
        let oSchemasById = {}
        let dataSchemasKeys = Object.keys(oApp.dataSchemas)
        for (let dsi = 0; dsi < dataSchemasKeys.length; dsi++ ) {
            let key = dataSchemasKeys[dsi]
            let oSchema = oApp.dataSchemas[key]
            if (oSchema.asdir && oSchema.asdir === 'Y') {
                oSchemasById[oSchema.id] = oSchema
                switch (oSchema.type) {
                case 'single':
                    if (!oSchema.optGroups) {
                        /* 根分类 */
                        for (let i = 0; i < oSchema.ops.length; i++) {
                            let oOp = oSchema.ops[i]
                            let oRootDir = {}
                            oRootDir.schema_id = oSchema.id;
                            oRootDir.schema_type = 'single';
                            oRootDir.op = oOp;
                            dirSchemas.push(oRootDir)
                        }
                    } else {
                        for (let i = 0; i < oSchema.optGroups.length; i++) {
                            let oOptGroup = oSchema.optGroups[i]
                            if (oOptGroup.assocOp && oOptGroup.assocOp.v && oSchemasById[oOptGroup.assocOp.schemaId]) {
                                let oParentSchema = oSchemasById[oOptGroup.assocOp.schemaId]
                                for (let i2 = 0; i2 < oParentSchema.ops.length; i2++) {
                                    let oAssocOp = oParentSchema.ops[i2]
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
                    let modelData = new Data()
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
                        for (let i = 0; i < dirSchemas.length; i++) {
                            let oParentDirSchema = dirSchemas[i]
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
        let {app, page, size} = this.request.query
        let modelApp = new Enroll()
        let oApp = await modelApp.byId(app, {'cascaded' : 'N'})
        if (false === oApp || oApp.state != '1') {
            return new ResultObjectNotFound()
        }
        if (!page || !size) {
            page = 1
            size = 30
        }

        let oUser = await this.getUser(oApp)
        // 填写记录过滤条件
        let oPosted = this.request.body
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
        let modelRec = new Record()
        let oCriteria = {}
        oCriteria.record = {}
        oCriteria.record.rid = oPosted.rid ? oPosted.rid : 'all'

        /* 指定了分组过滤条件 */
        if (oPosted.userGroup)
            oCriteria.record.group_id = $oPosted.userGroup

        /* 记录的创建人 */
        if (oPosted.mine && oPosted.mine === 'creator') {
            oCriteria.record.userid = $oUser.uid
        } else if (oPosted.mine && oPosted.mine === 'favored') {
            // 当前用户收藏
            oCriteria.record.favored = true
        }
        /* 记录的表态 */
        if (oPosted.agreed && oPosted.agreed.toLowerCase() === 'all')
            oCriteria.record.agreed = $oPosted.agreed
            
        /* 记录的标签 */
        if (oPosted.tags)
            $oCriteria.record.tags = $oPosted.tags

        if (oPosted.data)
            oCriteria.data = oPosted.data

        /* 答案的筛选 */
        if (oPosted.coworkAgreed && oPosted.coworkAgreed.toLowerCase() === 'all') {
            for (let i = 0; i < oApp.dynaDataSchemas.length; i++) {
                let oSchema = oApp.dynaDataSchemas[i]
                if (oSchema.cowork && oSchema.cowork === 'Y') {
                    oCriteria.cowork = {}
                    oCriteria.cowork.agreed = $oPosted.coworkAgreed
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

        modelApp.end()
        modelRec.end()
        return new ResultData(oResult)
    }
    /**
     * 
     */
    async _processDatas(oApp, oUser, rawDatas, processType = 'recordList', voteRules = null) {
        let modelData = new Data()
        if (oApp.voteConfig) {
            var modelTask = new Task(oApp)
        }
        /* 是否设置了编辑组 */
        let oEditorGrp = await this.getEditorGroup(oApp)

        for (let i = 0; i < rawDatas.length; i++) {
            let rawData = rawDatas[i]
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
                for (let ddi = 0; i < oApp.dynaDataSchemas.length; i++) {
                    let oSchema = oApp.dynaDataSchemas[i]
                    let schemaId = oSchema.id
                    // 分类目录
                    if (oSchema.asdir && oSchema.asdir === 'Y' && oSchema.ops && oSchema.ops.length && rawData.data[schemaId]) {
                        oSchema.ops.forEach((op) => {
                            if (op.v === rawData.data[schemaId]) {
                                recordDirs.push(op.l)
                            }
                        })
                    }
                    /* 清除非共享数据 */
                    if (!oSchema.shareable || oSchema.shareable !== 'Y') {
                        continue
                    }
                    // 过滤空数据
                    let rawDataVal = await getDeepValue(rawData.data, schemaId, null)
                    if (null === rawDataVal) {
                        continue
                    }
                    // 选择题题目可见性规则
                    if (oSchema.visibility && oSchema.visibility.rules) {
                        let checkSchemaVisibility = true;
                        Object.keys(oSchema.visibility.rules).forEach ((k) => {
                            let oRule = oSchema.visibility.rules[k]
                            if (schemaId.indexOf('member.extattr') === 0) {
                                let memberSchemaId = schemaId.replace('member.extattr.', '')
                                if (!rawData.data.member.extattr[memberSchemaId] || (rawData.data.member.extattr[$memberSchemaId] !== oRule.op && !rawData.data.member.extattr[memberSchemaId])) {
                                    checkSchemaVisibility = false
                                }
                            } else if (!rawData.data[oRule.schema] || (rawData.data[oRule.schema] !== oRule.op && !rawData.data[oRule.schema][oRule.op])) {
                                checkSchemaVisibility = false
                            }
                        })
                        if (checkSchemaVisibility === false) {
                            continue
                        }
                    }

                    /* 协作填写题 */
                    if (await getDeepValue(oSchema, 'cowork') === 'Y') {
                        if (processType === 'recordByTopic') {
                            // $items = $modelData->getCowork($rawData->enroll_key, $schemaId, ['excludeRoot' => true, 'agreed' => ['Y', 'A'], 'fields' => 'id,agreed,like_num,nickname,value']);
                            // $aCoworkState[$schemaId] = (object) ['length' => count($items)];
                            // $processedData->{$schemaId} = $items;
                        } else if (processType === 'coworkDataList') {
                            // $item = new \stdClass;
                            // $item->id = $rawData->data_id;
                            // $item->value = $this->replaceHTMLTags($rawData->value);
                            // $this->setDeepValue($processedData, $schemaId, [$item]);
                            // unset($rawData->value);
                        } else {
                            let aOptions = {'fields' : 'id', 'agreed' : ['Y', 'A']}
                            let countItems = await modelData.getCowork(rawData.enroll_key, schemaId, aOptions)
                            aCoworkState[schemaId] = {'length' : countItems.length}
                        }
                    } else if (await getDeepValue(oSchema, 'type') === 'multitext') {
                        let newData = [];
                        for (let rdvi = 0; rdvi < rawDataVal.length; rdvi++) {
                            let val = rawDataVal[rdvi]
                            let val2 = {}
                            val2.id = val.id
                            val2.value = await replaceHTMLTags(val.value)
                            newData.push(val2)
                        }
                        processedData[schemaId] = newData
                    } else if (await getDeepValue(oSchema, 'type') === 'single') {
                        oSchema.ops.forEach ((val) => {
                            if (val.v === rawDataVal) {
                                processedData[schemaId] = val.l
                            }
                        })
                    } else if (await getDeepValue(oSchema, 'type') === 'score') {
                        let ops = {}
                        oSchema.ops.forEach ((val) => {
                            ops[val.v] = val.l
                        })
                        let newData = []
                        Object.keys(rawDataVal).forEach ((key) => {
                            let val = rawDataVal[key]
                            let data2 = {}
                            data2.title = ops[key]
                            data2.score = val
                            newData.push(data2)
                        })
                        processedData[schemaId] = newData
                    } else if (await getDeepValue(oSchema, 'type') === 'multiple') {
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
                    // foreach ($aVoteRules as $schemaId => $oVoteRule) {
                    //     if ($processType === 'coworkDataList') {
                    //         continue;
                    //     } else if ($processType === 'recordByTopic') {
                    //         if ($this->await getDeepValue($oVoteRule->schema, 'cowork') === 'Y') {continue;}
                    //         $oRecData = $modelData->byRecord($rawData->enroll_key, ['schema' => $schemaId, 'fields' => 'id,vote_num']);
                    //         if ($oRecData) {
                    //             $vote_at = (int) $modelData->query_val_ss(['vote_at', 'xxt_enroll_vote', ['rid' => $oApp->appRound->rid, 'data_id' => $oRecData->id, 'state' => 1, 'userid' => $oUser->uid]]);
                    //             $oRecData->vote_at = $vote_at;
                    //             $oRecData->state = $oVoteRule->state;
                    //             $oVoteResult->{$schemaId} = $oRecData;
                    //         }
                    //     } else {
                    //         $oVoteResult = new \stdClass;
                    //         if ($this->await getDeepValue($oVoteRule->schema, 'cowork') === 'Y') {continue;}
                    //         $oRecData = $modelData->byRecord($rawData->enroll_key, ['schema' => $schemaId, 'fields' => 'id,vote_num']);
                    //         if ($oRecData) {
                    //             $oVoteResult->{$schemaId} = $oRecData;
                    //         }
                    //     }
                    // }
                    // $rawData->voteResult = $oVoteResult;
                }
            }
            /* 设置昵称 */
            rawData = await this.setNickname(rawData, oUser, (oEditorGrp) ? oEditorGrp : null)
            /* 清除不必要的内容 */
            delete rawData.comment
            delete rawData.verified

            /* 是否已经被当前用户收藏 */
            // if ($processType === 'recordList' || $processType === 'recordByTopic') {
            //     if (!empty($oUser->unionid) && $rawData->favor_num > 0) {
            //         $q = ['id', 'xxt_enroll_record_favor', ['record_id' => $rawData->id, 'favor_unionid' => $oUser->unionid, 'state' => 1]];
            //         if ($modelData->query_obj_ss($q)) {
            //             $rawData->favored = true;
            //         }
            //     }
            // }
            /* 记录的标签 */
            // if ($processType === 'recordList') {
            //     if (!isset($modelTag)) {
            //         $modelTag = $this->model('matter\enroll\tag2');
            //     }
            //     $oRecordTags = $modelTag->byRecord($rawData, $oUser, ['UserAndPublic' => empty($oPosted->favored)]);
            //     if (!empty($oRecordTags->user)) {
            //         $rawData->userTags = $oRecordTags->user;
            //     }
            //     if (!empty($oRecordTags->public)) {
            //         $rawData->tags = $oRecordTags->public;
            //     }
            // }
            /* 答案关联素材 */
            // if ($processType === 'coworkDataList') {
            //     if (!isset($modelAss)) {
            //         $modelAss = $this->model('matter\enroll\assoc');
            //         $oAssocsOptions = [
            //             'fields' => 'id,assoc_mode,assoc_num,first_assoc_at,last_assoc_at,entity_a_id,entity_a_type,entity_b_id,entity_b_type,public,assoc_text,assoc_reason',
            //         ];
            //     }
            //     $entityA = new \stdClass;
            //     $entityA->id = $rawData->data_id;
            //     $entityA->type = 'data';
            //     $oAssocsOptions['entityA'] = $entityA;
            //     $record = new \stdClass;
            //     $record->id = $rawData->record_id;
            //     $oAssocs = $modelAss->byRecord($record, $oUser, $oAssocsOptions);
            //     if (count($oAssocs)) {
            //         foreach ($oAssocs as $oAssoc) {
            //             $modelAss->adapt($oAssoc);
            //         }
            //     }
            //     $rawData->oAssocs = $oAssocs;
            //     //
            //     $rawData->id = $rawData->record_id;
            // }
        }

        modelData.end()
        if (oApp.voteConfig) {
            modelTask.end()
        }
        return rawDatas
    }
}

module.exports = Repos