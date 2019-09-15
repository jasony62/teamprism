const { Base: TableBase } = require('../table_base')

class Base extends TableBase {
    constructor(table, { db, debug = false }) {
        super(table, { db, debug })
    }
}

module.exports = { Base }