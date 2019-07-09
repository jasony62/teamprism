const Api = require('../tms/api')

class Main extends Api {
    constructor(who) {
        super(who)
    }
    version() {
        return {
            code: 0,
            version: "0.1"
        }
    }
}

module.exports = function (who) {
    return new Main(who)
}