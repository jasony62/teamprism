const express = require('express');
const router = express.Router();

let auth = {
    token: (req, res) => {
        res.json({
            code: 0,
            access_token: "abc123",
            expire_in: 7200
        })
    },
    who: (req, res) => {
        let who = require('../who')()
        let oCookieUser = who.getCookieUser('51855414326b5ff2b1b4a3b5d366393c', req.cookies.xxt_site_51855414326b5ff2b1b4a3b5d366393c_fe_user)
        res.json({
            code: 10,
            user: oCookieUser
        })
    }
}

router.get('/token', auth.token)
router.get('/who', auth.who)

module.exports = router