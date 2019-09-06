const { Base: MatterBase } = require('../base')

class Channel extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_channel', { debug })
    }
    /**
     * 获得素材的所有频道
     */
    async byMatter(id, type, { public_visible = null } = {}) {
        let db = await this.db()

        let dbSelect = db.newSelect('xxt_channel_matter cm,xxt_channel c', "c.id,c.title,cm.create_at,c.config,c.style_page_id,c.header_page_id,c.footer_page_id,c.style_page_name,c.header_page_name,c.footer_page_name,'channel' type")
        let dbWhere = dbSelect.where
        dbWhere.fieldMatch('cm.matter_id', '=', id).fieldMatch('cm.matter_type', '=', type).and(['cm.channel_id=c.id', 'c.state=1'])

        if (public_visible)
            dbWhere.fieldMatch('public_visible', '=', public_visible)

        dbSelect.order('cm.create_at desc')

        let channels = await dbSelect.exec()

        return channels
    }
}

function create({ debug = false } = {}) {
    return new Channel({ debug })
}

module.exports = { Channel, create }