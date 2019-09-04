const { DbModel } = require('../../../tms/model')
const { getDeepValue } = require('../../../tms/utilities')
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
        if (!getDeepValue(oApp, 'entryRule.group.id')) {
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