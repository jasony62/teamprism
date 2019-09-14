const { Api, ResultData } = require('../tms/api')

class Main extends Api {
    constructor(...args) {
        super(...args)
    }
    version() {
        return new ResultData('0.1')
    }
}

module.exports = Main