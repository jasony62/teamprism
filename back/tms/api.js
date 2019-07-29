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
}

module.exports = { Api, ResultData, ResultFault, ResultObjectNotFound, Client }