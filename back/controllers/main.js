const { TpCtrl, ResultData } = require('../tms/ctrl')

class Main extends TpCtrl {
    constructor(...args) {
        super(...args)
    }
    version() {
        return new ResultData('0.1')
    }
}

module.exports = Main