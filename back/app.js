const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const authRouter = require('./tms/routers/auth')
const apiRouter = require('./tms/routers/apis')
const wxRouter = require('./tms/routers/wx')

/**
 * 启动数据库连接池
 */
const { Db } = require('./tms/db')
Db.getPool()

/**
 * 启动web服务
 */
const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())
app.use(compression()) // 开启gzip
app.use(express.static(path.join(__dirname, 'public'), {
    index: false
}))
app.use('/ue/auth', authRouter)
app.use('/ue/api', apiRouter)
app.use('/ue/wx', wxRouter)

module.exports = app;