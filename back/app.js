const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRouter = require('./tms/routers/auth')
const apiRouter = require('./tms/routers/apis')
const wxRouter = require('./tms/routers/wx')

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    index: false
}));
app.use('/ue/auth', authRouter)
app.use('/ue/api', apiRouter)
app.use('/ue/wx', wxRouter)

module.exports = app;