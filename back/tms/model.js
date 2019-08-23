const crypto = require('crypto')

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


class Model {

    static encryptEnc(str, key) {
        return encrypt(str, Encrypt_Encode, key)
    }
    static encryptDec(str, key) {
        return encrypt(str, Encrypt_Decode, key)
    }

}
/**
 * 数据库表
 */
// 表名称字段
const TABLE_NAME = Symbol('table_name')
// 表ID字段
const TABLE_ID = Symbol('table_id')
// 是否使用自增ID
const TABLE_AUTO_INC_ID = Symbol('table_auto_inc_id')


class DbModel extends Model {
    /**
     * 
     * @param {String} table 表名称 
     * @param {Boolean} autoIncId 是否为自增id 
     */
    constructor(table, autoIncId = true, id = 'id') {
        super()
        this[TABLE_NAME] = table
        this[TABLE_ID] = id
        this[TABLE_AUTO_INC_ID] = autoIncId
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

    async select(oOptions = {}) {
        const fields = oOptions.fields || '*'

        let db = await this.db()
        let dbSelect = db.newSelect(this.table, fields)
        dbSelect.where.fieldMatch('1', '=', 1)
        let rows = await dbSelect.exec()

        return rows
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

    async db() {
        if (this._db)
            return this._db

        const db = await require('./db')()
        this._db = db

        return this._db
    }
    end(done) {
        if (this._db) this._db.conn.end(done)
    }
}
module.exports = {
    Model,
    DbModel
}