const { Base: MatterBase } = require('../base')

class Link extends MatterBase {
    constructor({ db, debug = false }) {
        super('xxt_link', { db, debug })
    }
}

module.exports = { Link, create: Link.create.bind(Link) }