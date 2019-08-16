const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/api')
const Base = require('./base')
const Enroll = require('../../../models/matter/enroll')
const Record = require('../../../models/matter/enroll/record')
const Data = require('../../../models/matter/enroll/data')

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
        if (oApp === false || oApp.state != '1') {
            return new ResultObjectNotFound()
        }

        let dirSchemas = [] // 作为分类的题目
        let oSchemasById = {}
        Object.keys(oApp.dataSchemas).forEach ( async (key) => {
            let oSchema = oApp.dataSchemas[key]
            if (oSchema.asdir && oSchema.asdir === 'Y') {
                oSchemasById[oSchema.id] = oSchema
                switch (oSchema.type) {
                case 'single':
                    if (!oSchema.optGroups) {
                        /* 根分类 */
                        oSchema.ops.forEach( async (oOp) => {
                            let oRootDir = {}
                            oRootDir.schema_id = oSchema.id;
                            oRootDir.schema_type = 'single';
                            oRootDir.op = oOp;
                            await dirSchemas.push(oRootDir)
                        })
                    } else {
                        oSchema.optGroups.forEach ( async (oOptGroup) => {
                            if (oOptGroup.assocOp && oOptGroup.assocOp.v && oSchemasById[oOptGroup.assocOp.schemaId]) {
                                let oParentSchema = oSchemasById[oOptGroup.assocOp.schemaId]
                                oParentSchema.ops.forEach ( async (oAssocOp) => {
                                    if (oAssocOp.v === oOptGroup.assocOp.v) {
                                        if (!oAssocOp.childrenDir) {
                                            oAssocOp.childrenDir = []
                                        }
                                        oSchema.ops.forEach ( async (oOp) => {
                                            if (oOp.g && oOp.g === oOptGroup.i) {
                                                await oAssocOp.childrenDir.push({'schema_id' : oSchema.id, 'op' : oOp})
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    break;
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
                        dirSchemas.forEach( async (oParentDirSchema) => {
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
                        })

                    }
                    break
                }
            }
        })

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
            page = size = ''
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

        return new ResultData(oResult)
    }
}

module.exports = Repos