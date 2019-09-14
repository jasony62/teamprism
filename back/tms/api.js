const { Model } = require("./model")
/**
 * API返回结果
 */
class ResultBase {
    constructor(result, msg, code) {
        this.msg = msg
        this.code = code
        if (result) this.result = result
    }
}
class ResultData extends ResultBase {
    constructor(result = null, msg = '正常', code = 0) {
        super(result, msg, code)
    }
}
/**
 * 一般错误
 * 前2位编码从10开始
 */
class ResultFault extends ResultBase {
    constructor(msg = '操作无法完成', code = 10001, result = null) {
        super(result, msg, code)
    }
}
class ResultObjectNotFound extends ResultFault {
    constructor(msg = '指定的对象不存在', result = null, code = 10002) {
        super(msg, result, code)
    }
}
/**
 * access_token失败
 * 前2位编码从20开始
 */
class AccessTokenFault extends ResultBase {
    constructor(msg = '', code = 20001, result = null) {
        super(result, msg, code)
    }
}
/**
 * 业务逻辑错误
 * 前2位编码从30开始
 */
class EntryRuleNotPassed extends ResultFault {
    constructor(result, msg = '不满足进入规则') {
        if (result && result instanceof Map) {
            let o = {}
            result.forEach((v, k) => { o[k] = v })
            result = o
        }

        super(msg, 30001, result)
    }
}
/**
 * 处理http请求的接口
 */
// http请求
const API_FIELD_REQUEST = Symbol('request')
// 发起调用的客户端
const API_FIELD_CLIENT = Symbol('client')
//
const API_FIELD_DBCONN = Symbol('dbconn')
const API_FIELD_WRITABLE_DBCONN = Symbol('writable_dbconn')

class Api {
    constructor(request, client, db) {
        this[API_FIELD_REQUEST] = request
        this[API_FIELD_CLIENT] = client
        this[API_FIELD_DBCONN] = db
    }

    get request() {
        return this[API_FIELD_REQUEST]
    }

    get client() {
        return this[API_FIELD_CLIENT]
    }
    get dbConn() {
        return this[API_FIELD_DBCONN]
    }
    set writableDbConn(conn) {
        this[API_FIELD_WRITABLE_DBCONN] = conn
    }
    get writableDbConn() {
        return this[API_FIELD_WRITABLE_DBCONN]
    }
    /**
     * 防sql注入
     */
    escape(data) {
        return Model.escape(data)
    }
    /**
     * 加载指定的model包
     * 
     * @param {*} name 
     */
    model(name) {
        let { create: fnCreate } = require(`${process.cwd()}/models/${name}`)
        let model = fnCreate()
        model.context = this
        model.db({ conn: this.dbConn })
        return model
    }
    /**
     * 释放数据库连接
     */
    release() {
        let { Db } = require('./db')
        this.writableDbConn && Db.release(this.writableDbConn)
        this.dbConn && Db.release(this.dbConn)
    }
}

module.exports = { Api, ResultData, ResultFault, ResultObjectNotFound, AccessTokenFault, EntryRuleNotPassed }