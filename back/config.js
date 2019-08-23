var fs = require('fs')

var ctrlPath = process.cwd() + "/cus/config.js"
if (fs.existsSync(ctrlPath)) {
    var configCus = require('./cus/config')
} else {
    var configCus = {}
}

var config = {}
config.APP_PROTOCOL = (configCus.APP_PROTOCOL) ? configCus.APP_PROTOCOL : 'http://'
// config.APP_HTTP_HOST = (configCus.APP_HTTP_HOST) ? configCus.APP_HTTP_HOST + '/ue' : this.request.headers.host + '/ue'
config.APP_HTTP_HOST = (configCus.APP_HTTP_HOST) ? configCus.APP_HTTP_HOST : "localhost/ue"

module.exports = config