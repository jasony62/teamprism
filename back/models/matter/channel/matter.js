const { DbModel } = require('../../../tms/model')

class Matter extends DbModel {
    /**
     *
     */
    constructor({ debug = true } = {}) {
        super('xxt_channel_matter', { debug })
    }
    async _articleByIds(ids) {
        let moArticle = require('../article')
        let articles = moArticle.byIds(ids, { fnMapKey: article => `article:${article.id}` })
        return articles
    }
    async _enrollByIds(ids) {
        let moEnroll = require('../enroll')
        let enrolls = moEnroll.byIds(ids, { fnMapKey: article => `article:${article.id}` })
        return enrolls
    }
    async _linkByIds(ids) {
        let moLink = require('../link')
        let links = moLink.byIds(ids, { fnMapKey: article => `article:${article.id}` })
        return links
    }
    /**
     * 返回频道下的所有素材
     * 
     * @param {Object} channel 
     */
    async byChannel(channel, { page = 1, size = 12 }) {
        let sqlWhere = [
            ['fieldMatch', 'channel_id', '=', channel.id]
        ]
        let sqlParts = {
            limit: [(page - 1) * size, size],
            orderby: 'seq,create_at desc'
        }
        let chanMatters = await this.select('create_at,matter_type,matter_id,seq', sqlWhere, sqlParts)

        if (chanMatters && chanMatters.length) {
            let chanMattersByType = {}
            chanMatters.forEach(cm => {
                if (undefined === chanMattersByType[cm.matter_type]) chanMattersByType[cm.matter_type] = []
                chanMattersByType[cm.matter_type].push(cm.matter_id)
            })
            let matterTypes = Object.keys(chanMattersByType)
            let allTypedMatters = new Map()
            matterTypes.forEach(mt => {
                if (this[`_${mt}ByIds`]) {
                    let typedMatters = this[`_${mt}ByIds`](chanMattersByType[mt])
                    allTypedMatters = new Map([...allTypedMatters, ...typedMatters])
                }
            })

            chanMatters.forEach(cm => {
                let typedMatter = allTypedMatters.get(`${cm.matter_type}:${cm.matter_id}`)
                if (typedMatter)
                    Object.assign(cm, typedMatter)
            })
        }

        return chanMatters
    }
}

function create({ debug = true } = {}) {
    return new Matter({ debug })
}

module.exports = { Matter, create }