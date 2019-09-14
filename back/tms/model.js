const crypto = require('crypto')
const mysql = require("mysql")

const Encrypt_Encode = Symbol('encrypt.encode')
const Encrypt_Decode = Symbol('encrypt.decode')
/**
 * 用户信息加密解密函数
 *
 * @return String 加密或解密字符串
 * 
 * @param {String} str 待加密或解密字符串
 * @param {Symbol} operation 操作类型定义 DECODE=解密 ENCODE=加密
 * @param {String} key 加密算子
 * 
 */
function encrypt(str, operation, key) {
    if (operation !== Encrypt_Encode && operation !== Encrypt_Decode)
        return false

    const md5 = crypto.createHash('md5');
    /**
     * 如果解密，先对密文解码
     * 如果加密，将密码算子和待加密字符串进行md5运算后取前8位
     * 并将这8位字符串和待加密字符串连接成新的待加密字符串
     */
    if (operation === Encrypt_Decode)
        str = Buffer.from(str, 'base64').toString('ascii')
    else
        str = md5.update(str + key).digest('hex').substr(0, 8) + str;

    let rndkey = [],
        box = []
    /**
     * 初始化加密变量，rndkey和box
     */
    for (let i = 0; i < 256; i++) {
        rndkey[i] = key.charCodeAt(i % key.length)
        box[i] = i
    }
    /**
     * box数组打散供加密用
     */
    let j, i, tmp
    for (j = i = 0; i < 256; i++) {
        j = (j + box[i] + rndkey[i]) % 256;
        tmp = box[i];
        box[i] = box[j];
        box[j] = tmp;
    }
    /**
     * box继续打散,并用异或运算实现加密或解密
     */
    let a, one_ascii,
        all_ascii = []
    for (a = j = i = 0; i < str.length; i++) {
        a = (a + 1) % 256
        j = (j + box[a]) % 256
        tmp = box[a]
        box[a] = box[j]
        box[j] = tmp
        one_ascii = str.charCodeAt(i) ^ (box[(box[a] + box[j]) % 256])
        all_ascii.push(one_ascii)
    }

    let all_buffer = Buffer.from(all_ascii, 'ascii')
    let result
    if (operation === Encrypt_Decode) {
        result = all_buffer.toString('ascii')
        if (result.substr(0, 8) === md5.update(result.substr(8) + key).digest('hex').substr(0, 8)) {
            result = result.substr(8)
        } else {
            result = ''
        }
    } else {
        result = all_buffer.toString('base64')
        result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }

    return result
}

const MODEL_CONTEXT = Symbol('model_context')

class Model {

    static encryptEnc(str, key) {
        return encrypt(str, Encrypt_Encode, key)
    }
    static encryptDec(str, key) {
        return encrypt(str, Encrypt_Decode, key)
    }
    /**
     * sql注入过滤
     */
    static escape(data) {
        if (typeof data === 'string') {
            return mysql.escape(data).slice(1, -1)
        } else if (Array.isArray(data)) {
            data.forEach ((v, k) => {
                data[k] = Model.escape(v)
            })
            return data
        } else if (Object.prototype.toString.call(data) === '[object Object]') {
            Object.keys(data).forEach ((k) => {
                data[k] = Model.escape(data[k])
            })
            return data
        } else {
            return data
        }
    }
    get context() {
        return this[MODEL_CONTEXT]
    }
    set context(ctx) {
        this[MODEL_CONTEXT] = ctx
    }
}
/**
 * 数据库表
 */
// 数据库连接实例
const DEBUG_MODE = Symbol('debug_mode')
// 数据库连接实例
const DB_INSTANCE = Symbol('db_instance')
// 表名称字段
const TABLE_NAME = Symbol('table_name')
// 表ID字段
const TABLE_ID = Symbol('table_id')
// 是否使用自增ID
const TABLE_AUTO_INC_ID = Symbol('table_auto_inc_id')
/**
 * 添加where条件
 * @param {*} dbSqlAction 
 * @param {Array} whereParts 
 */
function _makeWhere(dbSqlAction, whereParts) {
    if (whereParts && Array.isArray(whereParts)) {
        whereParts.forEach(part => {
            let [method, ...args] = part
            if (dbSqlAction.where[method]) {
                dbSqlAction.where[method].apply(dbSqlAction.where, args);
            }
        })
    }
    return dbSqlAction
}

class DbModel extends Model {
    /**
     * 
     * @param {String} table 表名称 
     */
    constructor(table, { autoIncId = true, id = 'id', debug = false } = {}) {
        super()
        this[TABLE_NAME] = table
        this[TABLE_ID] = id
        this[TABLE_AUTO_INC_ID] = autoIncId
        this[DEBUG_MODE] = debug
    }

    get table() {
        return this[TABLE_NAME]
    }
    get id() {
        return this[TABLE_ID]
    }
    get isAutoIncId() {
        return this[TABLE_AUTO_INC_ID]
    }
    get debug() {
        return this[DEBUG_MODE]
    }
    get execSqlStack() {
        return this[DB_INSTANCE].execSqlStack
    }
    /**
     * 返回符合条件的记录 
     * 
     * @param {string} fields
     * @param {Array<Array>} wheres
     * @param {object} sqlOptions
     * @param {Array} sqlOptions.limit offset,length
     * @param {string} sqlOptions.orderby 
     * @param {string} sqlOptions.groupby 
     * @param {object} rowOptions 结果处理函数
     * @param {function} rowOptions.fnForEach 处理获得结果的每1行 
     * @param {function} rowOptions.fnMapKey 若指定，返回结果为map，key由该方法生成
     * 
     * @return {Array} rows
     */
    async select(fields, wheres, { limit = null, orderby = null, groupby = null } = {}, { fnForEach = false, fnMapKey = false } = {}) {
        let db = await this.db()
        let dbSelect = db.newSelect(this.table, fields)

        if (Array.isArray(limit) && limit.length === 2)
            dbSelect.limit(...limit)

        if (typeof orderby === 'string')
            dbSelect.order(orderby)

        if (typeof groupby === 'string')
            dbSelect.group(groupby)

        _makeWhere(dbSelect, wheres)

        let rows = await dbSelect.exec()
        if (rows && rows.length) {
            if (typeof fnForEach === 'function')
                rows.forEach(r => fnForEach(r))

            if (typeof fnMapKey === 'function') {
                let map = new Map()
                rows.forEach(r => {
                    map.set(fnMapKey(r), r)
                })
                return map
            }
        }

        return rows
    }
    /**
     * 返回1条记录 
     */
    async selectOne(fields, wheres) {
        let db = await this.db()
        let dbSelect = db.newSelectOne(this.table, fields)
        _makeWhere(dbSelect, wheres)
        let row = await dbSelect.exec()

        return row
    }

    async insert(data) {
        let db = await this.db()
        let dbIns = db.newInsert(this.table, data)
        let idOrRows = await dbIns.exec(this.isAutoIncId)

        return idOrRows
    }

    async updateById(id, data) {
        let db = await this.db()
        let dbUpd = db.newUpdate(this.table, data)
        dbUpd.where.fieldMatch(this.id, '=', id)
        let rows = await dbUpd.exec()

        return rows
    }
    /**
     * 加载指定的model包
     * 
     * @param {*} name 
     */
    model(name) {
        let { create: fnCreate } = require(`${process.cwd()}/models/${name}`)
        let model = fnCreate()
        model.context = this.context
        // 使用同一个数据库连接
        model.db({ conn: this[DB_INSTANCE].conn })

        return model
    }
    /**
     * 设置数据库操作对象
     * 
     * @param {*} param0 
     */
    db({ conn = null } = {}) {
        let db
        if (this[DB_INSTANCE]) {
            db = this[DB_INSTANCE]
        } else {
            db = require('./db').create({ conn, debug: this.debug, context: this.context })
            this[DB_INSTANCE] = db
        }

        return db
    }

    end(done) {
        if (this[DB_INSTANCE])
            this[DB_INSTANCE].end(done)
        else if (done && typeof done === 'function')
            done()
    }
}

module.exports = {
    Model,
    DbModel
}