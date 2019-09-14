const { Api } = require('../tms/api')

class Base extends Api {
    constructor(...args) {
        super(...args)
    }
}

module.exports = Base