const { DbModel } = require('../../../tms/model')
const Round = require('./round')
// const Enroll = require('../enroll')

class Schema extends DbModel {
    /**
     * 设置活动动态题目
     *
     * @param object $oApp
     * @param object $oTask
     *
     * @return object $oApp
     */
	async setDynaSchemas(oApp, oTask = null) {
        let oAppRound
        if (!oApp.appRound) {
            let modelRnd = new Round()
            oAppRound = modelRnd.getActive(oApp, {'fields' : 'id,rid,title,start_at,end_at,mission_rid'})
            modelRnd.end()
        } else {
            oAppRound = oApp.appRound
        }

        // /* 从题目生成题目 */
        // let fnMakeDynaSchemaBySchema = function (oApp, oSchema, oDsAppRnd, schemaIndex, dynaSchemasByIndex) {
        //     let modelEnl = new Enroll()
        //     let oTargetApp = modelEnl.byId(oSchema.dsSchema.appid, {'fields' : 'siteid,state,mission_id,data_schemas,sync_mission_round'})
        //     if (false === oTargetApp || oTargetApp.state != '1') {
        //         return [false, '指定的目标活动不可用']
        //     }
        //     if (oApp.mission_id !== oTargetApp.mission_id) {
        //         return [false, '仅支持在同一个项目的活动间通过记录生成题目']
        //     }

        //     let targetSchemas = []; // 目标应用中选择的题目
        //     oTargetApp.dynaDataSchemas.forEach ((oTargetSchema) => {
        //         if (!oTargetSchema.dynamic || oTargetSchema.dynamic !== 'Y' || !oTargetSchema.cloneSchema.id) {
        //             if ($oSchema->dsSchema->schema->id === $oTargetSchema->cloneSchema->id) {
        //                 $targetSchemas[$oTargetSchema->id] = $oTargetSchema;
        //             }
        //         }
        //     })
        //     if (empty($targetSchemas)) {
        //         return [false, '指定的题目无效'];
        //     }

        //     foreach ($targetSchemas as $oReferSchema) {
        //         $oNewDynaSchema = clone $oSchema;
        //         $oNewDynaSchema->cloneSchema = (object) ['id' => $oSchema->id, 'title' => $oSchema->title];
        //         $oNewDynaSchema->referSchema = (object) ['id' => $oReferSchema->id, 'title' => $oReferSchema->title, 'type' => $oReferSchema->type];
        //         $oNewDynaSchema->id = $oReferSchema->id;
        //         $oNewDynaSchema->title = $oReferSchema->title;
        //         $oNewDynaSchema->dynamic = 'Y';
        //         if (isset($oReferSchema->referRecord)) {
        //             $oNewDynaSchema->referRecord = $oReferSchema->referRecord;
        //         }
        //         $dynaSchemasByIndex[$schemaIndex][] = $oNewDynaSchema;

        //         /* 原型题目中设置了动态选项，且和题目指向了相同的题目 */
        //         if (!empty($oNewDynaSchema->dsOps->app->id) && !empty($oNewDynaSchema->dsOps->schema->id) && $oNewDynaSchema->dsOps->app->id === $oSchema->dsSchema->app->id && $oNewDynaSchema->dsOps->schema->id === $oSchema->dsSchema->schema->id) {
        //             $oNewDynaSchema->dsOps->schema->id = $oReferSchema->id;
        //             $oNewDynaSchema->dsOps->schema->title = $oReferSchema->title;
        //             $oNewDynaSchema->dsOps->schema->type = $oReferSchema->type;
        //         }
        //     }

        //     return dynaSchemasByIndex
        // }

        // /* 根据填写数据生成题目 */
        // $fnMakeDynaSchemaByData = function ($oSchema, $oDsAppRnd, $schemaIndex, &$dynaSchemasByIndex, $oTask = null) {
        //     /* 如果题目本身是动态题目，需要先生成题目 */
        //     $targetSchemas = [];
        //     if (!empty($oSchema->dsSchema->app->id)) {
        //         $modelEnl = $this->model('matter\enroll');
        //         $aTargetAppOptions = ['fields' => 'siteid,state,mission_id,data_schemas,sync_mission_round'];
        //         /* 设置轮次条件 */
        //         if (!empty($oDsAppRnd)) {
        //             $aTargetAppOptions['appRid'] = $oDsAppRnd->rid;
        //         }
        //         $oTargetApp = $modelEnl->byId($oSchema->dsSchema->app->id, $aTargetAppOptions);
        //         if (false === $oTargetApp || $oTargetApp->state !== '1') {
        //             return [false, '指定的目标活动不可用'];
        //         }
        //         foreach ($oTargetApp->dynaDataSchemas as $oDynaSchema) {
        //             if ($oDynaSchema->id === $oSchema->dsSchema->schema->id) {
        //                 $targetSchemas[] = $oDynaSchema;
        //             } else if (!empty($oDynaSchema->dynamic) && $oDynaSchema->dynamic === 'Y' && !empty($oDynaSchema->cloneSchema->id) && $oDynaSchema->cloneSchema->id === $oSchema->dsSchema->schema->id) {
        //                 $targetSchemas[] = $oDynaSchema;
        //             }
        //         }
        //     }

        //     foreach ($targetSchemas as $oTargetSchema) {
        //         $q = [
        //             'id,enroll_key,value,userid,nickname',
        //             "xxt_enroll_record_data t0",
        //             ['state' => 1, 'aid' => $oSchema->dsSchema->app->id, 'schema_id' => $oTargetSchema->id],
        //         ];
        //         if ($oTargetSchema->type === 'multitext') {
        //             $q[2]['multitext_seq'] = (object) ['op' => '>', 'pat' => 0];
        //         }
        //         /* 设置轮次条件 */
        //         if (!empty($oTask)) {
        //             $oTopic = $this->model('matter\enroll\topic', $oTargetApp)->byTask($oTask, ['createIfNone' => false]);
        //             $q[2]['record_id'] = (object) ['op' => 'exists', 'pat' => 'select 1 from xxt_enroll_topic_record tr where ((tr.data_id=0 and t0.record_id=tr.record_id) or (tr.data_id<>0 and tr.data_id=t0.id)) and tr.topic_id=' . $oTopic->id];
        //         } else if (!empty($oDsAppRnd)) {
        //             /* 如果被评论了，作为当前轮次 */
        //             $q[2]['rid'] = (object) ['op' => 'or', 'pat' => ["rid='{$oDsAppRnd->rid}'", "exists (select 1 from xxt_enroll_record_remark rr where t0.enroll_key=rr.enroll_key and rr.state=1 and rr.rid='{$oDsAppRnd->rid}')"]];
        //         }
        //         /* 设置过滤条件 */
        //         if (!empty($oSchema->dsSchema->filters)) {
        //             foreach ($oSchema->dsSchema->filters as $index => $oFilter) {
        //                 if (!empty($oFilter->schema->id) && !empty($oFilter->schema->type)) {
        //                     switch ($oFilter->schema->type) {
        //                     case 'single':
        //                         if (!empty($oFilter->schema->op->v)) {
        //                             $tbl = 't' . ($index + 1);
        //                             $sql = "select 1 from xxt_enroll_record_data {$tbl} where state=1 and aid='{$oSchema->dsSchema->app->id}'and schema_id='{$oFilter->schema->id}' and value='{$oFilter->schema->op->v}' and t0.enroll_key={$tbl}.enroll_key";
        //                             $q[2]['enroll_key'] = (object) ['op' => 'exists', 'pat' => $sql];
        //                         }
        //                         break;
        //                     }
        //                 }
        //             }
        //         }
        //         /* 处理数据 */
        //         $datas = $this->query_objs_ss($q);
        //         if (count($datas)) {
        //             $modelRec = $this->model('matter\enroll\record');
        //             $modelSch = $this->model('matter\enroll\schema');
        //             $aRecordCache = [];
        //             // 表示记录的题目
        //             $aLabelSchemas = $this->asAssoc($oTargetApp->dynaDataSchemas, ['filter' => function ($oDynaSchema) {return $oDynaSchema->type !== 'multitext' && $this->getDeepValue($oDynaSchema, 'shareable') === 'Y';}]);
        //             foreach ($datas as $index => $oRecData) {
        //                 if (!isset($aRecordCache[$oRecData->enroll_key])) {
        //                     $oRecord = $modelRec->byId($oRecData->enroll_key, ['fields' => 'data']);
        //                     $aRecordCache[$oRecData->enroll_key] = $oRecord;
        //                 } else {
        //                     $oRecord = $aRecordCache[$oRecData->enroll_key];
        //                 }
        //                 $oNewDynaSchema = clone $oSchema;
        //                 $oNewDynaSchema->cloneSchema = (object) ['id' => $oSchema->id, 'title' => $oSchema->title];
        //                 $oNewDynaSchema->id = 'dyna' . $oRecData->id;
        //                 if ($oTargetSchema->type === 'multitext') {
        //                     $oNewDynaSchema->title = $modelSch->strRecData($oRecord->data, $aLabelSchemas) . ' : ' . $oRecData->value;
        //                 } else {
        //                     $oNewDynaSchema->title = $oRecData->value;
        //                 }
        //                 $oNewDynaSchema->dynamic = 'Y';
        //                 /* 记录题目的数据来源 */
        //                 $oNewDynaSchema->referRecord = (object) [
        //                     'schema' => (object) ['id' => $oTargetSchema->id, 'type' => $oTargetSchema->type, 'title' => $oTargetSchema->title],
        //                     'ds' => (object) ['ek' => $oRecData->enroll_key, 'data_id' => $oRecData->id, 'user' => $oRecData->userid, 'nickname' => $oRecData->nickname],
        //                 ];
        //                 $dynaSchemasByIndex[$schemaIndex][] = $oNewDynaSchema;
        //             }
        //         }
        //     }
        // };

        // /* 根据打分题获得的分数生成题目 */
        // $fnMakeDynaSchemaByScore = function ($oSchema, $oDsAppRnd, $schemaIndex, &$dynaSchemasByIndex) use ($oApp) {
        //     $modelEnl = $this->model('matter\enroll');
        //     $oTargetApp = $modelEnl->byId($oSchema->dsSchema->app->id, ['fields' => 'siteid,state,mission_id,data_schemas,sync_mission_round']);
        //     if (false === $oTargetApp || $oTargetApp->state !== '1') {
        //         return [false, '指定的目标活动不可用'];
        //     }
        //     if ($oApp->mission_id !== $oTargetApp->mission_id) {
        //         return [false, '仅支持在同一个项目的活动间通过记录生成题目'];
        //     }

        //     $targetSchemas = []; // 目标应用中选择的题目
        //     foreach ($oTargetApp->dynaDataSchemas as $oTargetSchema) {
        //         if (empty($oTargetSchema->dynamic) || $oTargetSchema->dynamic !== 'Y' || empty($oTargetSchema->cloneSchema->id)) {
        //             continue;
        //         }
        //         if ($oSchema->dsSchema->schema->id === $oTargetSchema->cloneSchema->id) {
        //             $targetSchemas[$oTargetSchema->id] = $oTargetSchema;
        //         }
        //     }
        //     if (empty($targetSchemas)) {
        //         return [false, '指定的题目无效'];
        //     }

        //     /* 匹配的轮次 */
        //     $modelRnd = $this->model('matter\enroll\round');
        //     $oTargetAppRnd = $modelRnd->byMissionRid($oTargetApp, $oDsAppRnd->mission_rid, ['fields' => 'rid,mission_rid']);

        //     // 查询结果
        //     $modelRec = $this->model('matter\enroll\record');
        //     $oResult = $modelRec->score4Schema($oTargetApp, isset($oTargetAppRnd->rid) ? $oTargetAppRnd->rid : '');
        //     unset($oResult->sum);
        //     $aResult = (array) $oResult;
        //     uasort($aResult, function ($a, $b) {
        //         return (int) $b - (int) $a;
        //     });
        //     $newSchemaNum = 0;
        //     foreach ($aResult as $schemaId => $score) {
        //         if (empty($targetSchemas[$schemaId])) {
        //             continue;
        //         }
        //         /* 检查显示规则 */
        //         if (isset($oSchema->dsSchema->limit->scope)) {
        //             if (isset($oSchema->dsSchema->limit->num) && is_int($oSchema->dsSchema->limit->num)) {
        //                 $limitNum = $oSchema->dsSchema->limit->num;
        //             } else {
        //                 $limitNum = 1;
        //             }
        //             if ($oSchema->dsSchema->limit->scope === 'top') {
        //                 if ($newSchemaNum >= $limitNum) {
        //                     break;
        //                 }
        //             } else if ($oSchema->dsSchema->limit->scope === 'greater') {
        //                 if ($score < $limitNum) {
        //                     continue;
        //                 }
        //             }
        //         }

        //         $oReferSchema = $targetSchemas[$schemaId];
        //         $oNewDynaSchema = clone $oSchema;
        //         $oNewDynaSchema->cloneSchema = (object) ['id' => $oSchema->id, 'title' => $oSchema->title];
        //         $oNewDynaSchema->referSchema = (object) ['id' => $oReferSchema->id, 'title' => $oReferSchema->title, 'type' => $oReferSchema->type];
        //         $oNewDynaSchema->id = $oReferSchema->id;
        //         $oNewDynaSchema->title = $oReferSchema->title;
        //         $oNewDynaSchema->dynamic = 'Y';
        //         if (isset($oReferSchema->referRecord)) {
        //             $oNewDynaSchema->referRecord = $oReferSchema->referRecord;
        //         }
        //         $dynaSchemasByIndex[$schemaIndex][] = $oNewDynaSchema;
        //         $newSchemaNum++;
        //     }
        // };

        // /* 根据选择题获得的票数生成题目 */
        // $fnMakeDynaSchemaByOption = function ($oSchema, $oDsAppRnd, $schemaIndex, &$dynaSchemasByIndex) use ($oApp) {
        //     $modelEnl = $this->model('matter\enroll');

        //     $oTargetApp = $modelEnl->byId($oSchema->dsSchema->app->id, ['fields' => 'siteid,state,mission_id,data_schemas,sync_mission_round']);
        //     if (false === $oTargetApp || $oTargetApp->state !== '1') {
        //         return [false, '指定的目标活动不可用'];
        //     }
        //     if ($oApp->mission_id !== $oTargetApp->mission_id) {
        //         return [false, '仅支持在同一个项目的活动间通过记录生成题目'];
        //     }

        //     $targetSchemas = []; // 目标应用中选择的题目
        //     foreach ($oTargetApp->dynaDataSchemas as $oSchema2) {
        //         if ($oSchema->dsSchema->schema->id === $oSchema2->id) {
        //             $targetSchemas[] = $oSchema2;
        //             break;
        //         }
        //     }
        //     if (empty($targetSchemas)) {
        //         return [false, '指定的题目无效'];
        //     }

        //     /* 匹配的轮次 */
        //     $oAssignedRnd = $oApp->appRound;
        //     if ($oAssignedRnd) {
        //         $modelRnd = $this->model('matter\enroll\round');
        //         $oTargetAppRnd = $modelRnd->byMissionRid($oTargetApp, $oAssignedRnd->mission_rid, ['fields' => 'rid,mission_rid']);
        //     }

        //     /* 目标活动的统计结果 */
        //     $modelRec = $this->model('matter\enroll\record');
        //     $aTargetData = $modelRec->getStat($oTargetApp, !empty($oTargetAppRnd) ? $oTargetAppRnd->rid : '', 'N');
        //     $modelDat = $this->model('matter\enroll\data');
        //     $newSchemas = []; // 根据记录创建的题目
        //     foreach ($targetSchemas as $oTargetSchema) {
        //         switch ($oTargetSchema->type) {
        //         case 'single':
        //         case 'multiple':
        //             if (!empty($aTargetData[$oTargetSchema->id]->ops)) {
        //                 $options = $aTargetData[$oTargetSchema->id]->ops;
        //                 usort($options, function ($a, $b) {
        //                     return $a->c < $b->c;
        //                 });
        //                 if (isset($oSchema->dsSchema->limit->scope)) {
        //                     if (isset($oSchema->dsSchema->limit->num) && is_int($oSchema->dsSchema->limit->num)) {
        //                         $limitNum = $oSchema->dsSchema->limit->num;
        //                     } else {
        //                         $limitNum = 1;
        //                     }
        //                     switch ($oSchema->dsSchema->limit->scope) {
        //                     case 'top':
        //                         $this->genSchemaByTopOptions($oTargetSchema, $options, $limitNum, $newSchemas, $oSchema);
        //                         break;
        //                     case 'checked':
        //                         $this->genSchemaByCheckedOptions($oTargetSchema, $options, $limitNum, $newSchemas, $oSchema);
        //                         break;
        //                     }
        //                 } else {
        //                     $this->genSchemaByTopOptions($oTargetSchema, $options, count($options), $newSchemas, $oSchema);
        //                 }
        //                 foreach ($newSchemas as $oNewDynaSchema) {
        //                     $oNewDynaSchema->dynamic = 'Y';
        //                     $oNewDynaSchema->cloneSchema = (object) ['id' => $oSchema->id, 'title' => $oSchema->title];
        //                 }
        //             }
        //             break;
        //         }
        //     }
        //     /* 原型题目中设置了动态选项 */
        //     if (isset($oSchema->dsOps->app->id)) {
        //         $oDynaOptionsApp = $modelEnl->byId($oSchema->dsOps->app->id, ['cascaded' => 'N']);
        //         if ($oDynaOptionsApp && $oDynaOptionsApp->state === '1') {
        //             foreach ($newSchemas as $oNewDynaSchema) {
        //                 if (isset($oNewDynaSchema->dsOps)) {
        //                     foreach ($oDynaOptionsApp->dynaDataSchemas as $oDynaOptionSchema) {
        //                         if ($oNewDynaSchema->id === $oDynaOptionSchema->id) {
        //                             /* 修改为新的动态选项源 */
        //                             $oNewDsOps = new \stdClass;
        //                             $oNewDsOps->app = $oNewDynaSchema->dsOps->app; // 指向的应用不改变
        //                             $oNewDsOps->schema = new \stdClass; // 指向的题目变为应用中的动态题目
        //                             $oNewDsOps->schema->id = $oDynaOptionSchema->id;
        //                             $oNewDsOps->schema->title = $oDynaOptionSchema->title;
        //                             $oNewDynaSchema->dsOps = $oNewDsOps;
        //                             break;
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     $dynaSchemasByIndex[$schemaIndex] = $newSchemas;
        // };
        // /* 生成动态题目 */
        // $dynaSchemasByIndex = []; // 动态创建的题目
        // foreach ($oApp->dataSchemas as $schemaIndex => $oSchema) {
        //     if (!in_array($oSchema->type, ['single', 'multiple', 'score', 'longtext', 'html'])) {
        //         continue;
        //     }
        //     if (!empty($oSchema->dsSchema->app->id) && !empty($oSchema->dsSchema->schema->id) && !empty($oSchema->dsSchema->schema->type)) {
        //         $oDsSchema = $oSchema->dsSchema;
        //         if (!isset($modelRnd)) {
        //             $modelRnd = $this->model('matter\enroll\round');
        //         }
        //         if (isset($oTask)) {
        //             $oDsAppRnd = $modelRnd->byTask($oDsSchema->app, $oTask);
        //         } else if (!empty($oAppRound->mission_rid)) {
        //             $oDsAppRnd = $modelRnd->byMissionRid($oDsSchema->app, $oAppRound->mission_rid, ['fields' => 'rid,mission_rid']);
        //         }
        //         if (!empty($oDsAppRnd)) {
        //             switch ($oDsSchema->schema->type) {
        //             case 'shorttext':
        //             case 'longtext':
        //                 if ((!empty($oSchema->dsOps->app->id) && $oSchema->dsOps->app->id === $oSchema->dsSchema->app->id) || $oSchema->type === 'html') {
        //                     /* 如果动态选项指向了相同的题目，就是直接复制题目 */
        //                     $fnMakeDynaSchemaBySchema($oSchema, $oDsAppRnd, $schemaIndex, $dynaSchemasByIndex);
        //                 } else {
        //                     $fnMakeDynaSchemaByData($oSchema, $oDsAppRnd, $schemaIndex, $dynaSchemasByIndex);
        //                 }
        //                 break;
        //             case 'multitext':
        //                 $fnMakeDynaSchemaByData($oSchema, $oDsAppRnd, $schemaIndex, $dynaSchemasByIndex, $oTask);
        //                 break;
        //             case 'score':
        //                 $fnMakeDynaSchemaByScore($oSchema, $oDsAppRnd, $schemaIndex, $dynaSchemasByIndex);
        //                 break;
        //             case 'single':
        //             case 'multiple':
        //                 $fnMakeDynaSchemaByOption($oSchema, $oDsAppRnd, $schemaIndex, $dynaSchemasByIndex);
        //                 break;
        //             }
        //         }
        //     }
        // }
        // /* 加入动态创建的题目 */
        // if (count($dynaSchemasByIndex)) {
        //     $protoSchemaOffset = 0;
        //     foreach ($dynaSchemasByIndex as $index => $dynaSchemas) {
        //         array_splice($oApp->dataSchemas, $index + $protoSchemaOffset, 1, $dynaSchemas);
        //         $protoSchemaOffset += count($dynaSchemas) - 1;
        //     }
        // }
        // /* 修改对动态创建的父题目的引用 */
        // $schemasByCloneId = [];
        // foreach ($oApp->dataSchemas as $oSchema) {
        //     if ($oSchema->type === 'html' && isset($oSchema->cloneSchema->id)) {
        //         $schemasByCloneId[$oSchema->cloneSchema->id][] = $oSchema;
        //     }
        // }
        // foreach ($oApp->dataSchemas as $oSchema) {
        //     if (isset($oSchema->parent->id) && !empty($schemasByCloneId[$oSchema->parent->id])) {
        //         if (isset($oSchema->referRecord->schema)) {
        //             $oDynaParentSchemas = $schemasByCloneId[$oSchema->parent->id];
        //             foreach ($oDynaParentSchemas as $oDynaParentSchema) {
        //                 if (isset($oDynaParentSchema->referSchema->id) && $oDynaParentSchema->referSchema->id === $oSchema->referRecord->schema->id) {
        //                     $oSchema->referParent = $oSchema->parent;
        //                     $oSchema->parent = (object) ['id' => $oDynaParentSchema->id, 'type' => $oDynaParentSchema->type, 'title' => $oDynaParentSchema->title];
        //                 }
        //             }
        //         }
        //     }
        // }

        return oApp
    }
    /**
     * 
     */
    async asAssoc(schemas, aOptions = {}, bOnlyFirst = false) {
        let fnFilter
        if (aOptions['filter']) {
            fnFilter = aOptions['filter']
        }
        let aSchemas = {}
        for (let i=0; i<schemas.length; i++) {
            let oSchema = schemas[i]
            if (!fnFilter || fnFilter(oSchema)) {
                aSchemas[oSchema.id] = oSchema
                if (true === bOnlyFirst) {
                    break
                }
            }
        }

        return aSchemas
    }
    /**
     * 
     */
    async getAssocGroupTeamSchema(oApp) {
        if (!oApp.entryRule.group.id) {
            /* 没有关联分组活动 */
            return false
        }
        if (!oApp.dataSchemas) {
            return null
        }
        let oGrpSchema = null
        for (let i = 0; i < oApp.dataSchemas.length; i++) {
            let oSchema = oApp.dataSchemas[i]
            if (oSchema.id === '_round_id') {
                if (oSchema.requireCheck && oSchema.requireCheck === 'Y') {
                    if (oSchema.fromApp && oSchema.fromApp === oApp.entryRule.group.id) {
                        oGrpSchema = oSchema
                        break
                    }
                }
            }
        }

        return oGrpSchema
    }
}

module.exports = function () {
    return new Schema()
}