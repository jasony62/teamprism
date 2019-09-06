const { Base: MatterBase } = require('../base')

class Link extends MatterBase {
    constructor({ debug = false } = {}) {
        super('xxt_link', { debug })
    }
}

function create({ debug = false } = {}) {
    return new Link({ debug })
}

module.exports = { Link, create }