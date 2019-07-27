const Api = require('../../../tms/api')

class Main extends Api {
    constructor(who) {
        super(who)
    }
    // 返回站点对应的appid
    appid(req) {
        return {
            code: 0,
            appid: 'appid'
        }
    }
}

module.exports = function(who) {
    return new Main(who)
}