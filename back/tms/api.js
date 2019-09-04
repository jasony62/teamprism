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
        this.result = result
    }
}
class ResultData extends ResultBase {
    constructor(result = null, msg = '正常', code = 0) {
        super(result, msg, code)
    }
}

class ResultFault extends ResultBase {
    constructor(msg = '操作无法完成', code = 1, result = null) {
        super(result, msg, code)
    }
}
class ResultObjectNotFound extends ResultFault {
    constructor(msg = '指定的对象不存在', result = null, code = 2) {
        super(msg, result, code)
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
    // 如果不copy 会重复更改，如果执行多次就会加很多的杠，并且会格式化原始数据，如果copy 如果存在转移失败的情况怎么办，是否需要原始数据
    getQuery(escape = true) {
        let querys = JSON.parse(JSON.stringify(this[API_FIELD_REQUEST]['query']))
        if (escape)
            querys = Model.escape(querys)

        return querys
    }
    /**
     * 防sql注入
     */
    static escape(data) {
        return Model.escape(data)
    }
}

module.exports = { Api, ResultData, ResultFault, ResultObjectNotFound, Client }