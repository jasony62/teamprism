const express = require('express')
const router = express.Router()
const Token = require('./token')

function getAuthedUser(req, siteid) {
    let who = require('../who')()
    let oCookieUser = who.getCookieUser(siteid, req.cookies[`xxt_site_${siteid}_fe_user`])
    return oCookieUser;
}

router.get('/token', async (req, res) => {
    let siteid = req.query.site
    let oAuthedUser = getAuthedUser(req, siteid)
    if (!oAuthedUser) {
        res.json({
            code: 40013,
            errmsg: '没有获得有效用户信息'
        })
        return
    }

    let result = await Token.create(oAuthedUser.uid, oAuthedUser)

    res.json(result)
})
router.get('/who', (req, res) => {
    let siteid = req.query.site
    let oAuthedUser = getAuthedUser(req, siteid)
    res.json({
        code: 0,
        user: oAuthedUser
    })
})

module.exports = router