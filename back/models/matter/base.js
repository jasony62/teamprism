const { Base: TableBase } = require('../table_base')

class Base extends TableBase {
    constructor(table, ...args) {
        super(table, ...args)
    }
}

module.exports = { Base }