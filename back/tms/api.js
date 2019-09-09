const { Model } = require("./model")

class Client {

}
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
 * 处理http请求的接口
 */
// http请求
const API_FIELD_REQUEST = Symbol('request')
// 发起调用的客户端
const API_FIELD_CLIENT = Symbol('client')

class Api {
    constructor(request, client) {
        this[API_FIELD_REQUEST] = request
        this[API_FIELD_CLIENT] = client
    }

    get request() {
        return this[API_FIELD_REQUEST]
    }

    get client() {
        return this[API_FIELD_CLIENT]
    }
    /**
     * 防sql注入
     */
    static escape(data) {
        return Model.escape(data)
    }
}

module.exports = { Api, ResultData, ResultFault, ResultObjectNotFound, AccessTokenFault, Client }