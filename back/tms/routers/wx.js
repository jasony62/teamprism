const express = require('express')
const router = express.Router()
const { createProxy } = require('../../models/sns/wx/proxy')
const { ResultFault } = require('../api')

// 微信网页授权
router.get('/oauth2', async (req, res) => {
    const { site, code, state } = req.query
    try {
        const wxProxy = await createProxy(site)
        if (!wxProxy) {
            res.json(new ResultFault())
            return
        }
        wxProxy.getOAuthUser(code)
        const uri = decodeURIComponent(state)
        res.redirect(uri)
    } catch (e) {
        res.json(new ResultFault())
    }
})

module.exports = router