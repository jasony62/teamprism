const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../tms/ctrl')
const { getDeepValue, replaceHTMLTags } = require('../../../tms/utilities')
const Base = require('./base')

class Topic extends Base {
    constructor(...args) {
        super(...args)
    }
    /**
     * 所有专题列表
     */
    async listAll() {
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

        return new ResultData(oResult)
    }
}

module.exports = Topic