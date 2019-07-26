const express = require('express');
const router = express.Router();
const wxproxy = require('../../models/sns/wx/proxy');

// 微信网页授权
router.get('/oauth2', (req, res) => {
    const code = req.query.code
    wxproxy.getS
    const state = req.query.state
    const uri = decodeURIComponent(state)
    res.redirect(uri)
})

module.exports = router