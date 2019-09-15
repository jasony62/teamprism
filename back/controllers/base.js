const { TpCtrl } = require('../tms/ctrl')

class Base extends TpCtrl {
    constructor(...args) {
        super(...args)
    }
}

module.exports = Base