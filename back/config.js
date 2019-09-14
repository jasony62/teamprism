let fs = require('fs')

let ctrlPath = process.cwd() + "/cus/config.js"
let configCus = {}
if (fs.existsSync(ctrlPath)) {
    configCus = require('./cus/config')
}

let config = {}
config.APP_PROTOCOL = (configCus.APP_PROTOCOL) ? configCus.APP_PROTOCOL : 'http://'
config.APP_HTTP_HOST = (configCus.APP_HTTP_HOST) ? configCus.APP_HTTP_HOST : 'localhost/ue'

module.exports = config