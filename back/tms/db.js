const mysql = require("mysql")
const fs = require("fs")

function connect(readonly, options) {
    if (!fs.existsSync(options.path)) {
        return false
    }

    const fileConfig = fs.readFileSync(options.path)
    const oCusConfig = JSON.parse(fileConfig)
    let oConnConfig = (readonly === true && oCusConfig.read) ? oCusConfig.read : oCusConfig.master

    let conn = mysql.createConnection(oConnConfig)

    return new Promise((resolve, reject) => {
        conn.connect(err => {
            if (err)
                reject(err)
            else
                resolve(conn)
        })
    })
}

/**
 * where条件
 */
const WhereMatchOps = ['=', '>', '>=', '<', '<=', '<>', 'like']
class WhereAssembler {

    constructor() {
        this.pieces = []
    }

    fieldMatch(field, op, match) {
        if (WhereMatchOps.indexOf(op) === -1 || !/number|string/.test(typeof match))
            return this

        this.pieces.push(`${field}${op}'${match}'`)
        return this
    }

    fieldIn(field, match) {
        this.pieces.push(`${field} in('${match.join('\',\'')}')`)
        return this
    }

    fieldNotIn(field, match) {
        this.pieces.push(`${field} not in('${match.join('\',\'')}')`)
        return this
    }

    fieldBetween(field, match) {
        this.pieces.push(`${field} between ${match[0]} and ${match[1]}`)
        return this
    }

    fieldNotBetween(field, match) {
        this.pieces.push(`${field} not between ${match[0]} and ${match[1]}`)
        return this
    }

    exists(match) {
        this.pieces.push(`exists('${match}')`)
        return this
    }

    and(match) {
        if (!Array.isArray(match) || match.length === 0)
            return this

        let subs = match.filter(sub => typeof sub === 'string')

        if (subs.length === 0)
            return this

        this.pieces.push(`(${subs.join(' and ')})`)
        return this

    }

    or(match) {
        if (!Array.isArray(match) || match.length <= 1)
            return this

        let subs = match.filter(sub => typeof sub === 'string')

        if (subs.length <= 1)
            return this

        this.pieces.push(`(${subs.join(' or ')})`)
        return this
    }

    get sql() {
        return this.pieces.join(' and ');
    }
}

class SqlAction {

    constructor(conn, table) {
        this.conn = conn
        this.table = table
    }

    exec() {
        return new Promise((resolve, reject) => {
            this.conn.query(this.sql, (error, result, fields) => {
                resolve(result)
            })
        })
    }
}

class Insert extends SqlAction {

    constructor(conn, table, data = {}) {
        super(conn, table)
        this.data = data
    }

    get sql() {
        const fields = Object.keys(this.data)
        const values = fields.map(f => this.data[f])

        return `insert into ${this.table}(${fields.join(',')}) values('${values.join("','")}')`
    }


}

class SqlActionWithWhere extends SqlAction {

    constructor(conn, table) {
        super(conn, table)
    }

    get where() {
        if (!this.whereAssembler)
            this.whereAssembler = new WhereAssembler()
        return this.whereAssembler
    }
}

class Delete extends SqlActionWithWhere {

    constructor(conn, table) {
        super(conn, table)
    }

    get sql() {
        return `delete from ${this.table} where ${this.where.sql}`
    }

}

class Update extends SqlActionWithWhere {

    constructor(conn, table, data = {}) {
        super(conn, table)
        this.data = data
    }

    get sql() {
        const fields = Object.keys(this.data)
        const pairs = fields.map(f => `${f}='${this.data[f]}'`)

        return `update ${this.table} set ${pairs.join(",")} where ${this.where.sql}`
    }
}

class Select extends SqlActionWithWhere {

    constructor(conn, table, fields) {
        super(conn, table)
        this.fields = fields
    }

    get sql() {
        return `select ${this.fields} from ${this.table} where ${this.where.sql}`
    }
}
class SelectOne extends Select {
    exec() {
        return new Promise((resolve, reject) => {
            super.exec().then((rows) => {
                if (rows.length === 1)
                    resolve(rows[0])
                else if (rows.length === 0)
                    resolve(false)
                else
                    reject('查询条件错误，获得多条数据')
            })
        })
    }
}

class Db {
    constructor(conn) {
        this.conn = conn;
    }

    static async build(readonly, options) {
        let conn = await connect(readonly, options);
        return new Db(conn)
    }

    newInsert(table, data) {
        return new Insert(this.conn, table, data)
    }

    newDelete(table) {
        return new Delete(this.conn, table)
    }

    newUpdate(table, data) {
        return new Update(this.conn, table, data)
    }

    newSelect(table, fields) {
        return new Select(this.conn, table, fields)
    }

    newSelectOne(table, fields) {
        return new SelectOne(this.conn, table, fields)
    }
}

module.exports = async function(readonly = false, options = {
    path: process.cwd() + "/cus/db.json"
}) {
    try {
        return Db.build(readonly, options);
    } catch (err) {
        return false
    }
};