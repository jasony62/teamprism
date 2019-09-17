const { Base: MatterBase } = require('../base')
const { getDeepValue } = require('../../../tms/utilities')

class Schema extends MatterBase {
    constructor({ db, debug = false } = {}) {
        super('', { db, debug })
    }
    /**
     * 
     */
    set setApp(oApp) {
        this._oApp = oApp
    }
    /**
     * 设置活动动态题目
     *
     * @param object $oApp
     * @param object $oTask
     *
     * @return object $oApp
     */
	async setDynaSchemas(oTask = null) {
        let oApp = this._oApp
        // let oAppRound
        // if (!oApp.appRound) {
        //     let modelRnd = new Round()
        //     oAppRound = modelRnd.getActive(oApp, {'fields' : 'id,rid,title,start_at,end_at,mission_rid'})
        // } else {
        //     oAppRound = oApp.appRound
        // }

        /* 从题目生成题目 */
        

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
    async getAssocGroupTeamSchema() {
        let oApp = this._oApp
        if (!getDeepValue(oApp, 'entryRule.group.id')) {
            /* 没有关联分组活动 */
            return false
        }
        if (!oApp.dataSchemas) {
            return null
        }
        let oGrpSchema = null
        for (let oSchema of oApp.dataSchemas) {
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

module.exports = { Schema, create: Schema.create.bind(Schema) }