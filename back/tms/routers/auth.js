const express = require('express')
const router = express.Router()
const Token = require('../token')
const { ResultData, ResultFault } = require('../api')

router.get('/token', async (req, res) => {
    const tmsClient = require('../client').create(req)
    if (!tmsClient) {
        res.json(new ResultFault('没有获得有效用户信息', 40013))
        return
    }

    let aResult = await Token.create(tmsClient)
    if (false === aResult[0]) {
        res.json(new ResultFault(aResult[1], 10001))
        return
    }

    let token = aResult[1]

    res.json(new ResultData(token))
})
router.get('/client', async (req, res) => {
    const { access_token } = req.query
    if (!access_token) {
        res.json(new ResultFault('缺少access_token参数'))
        return
    }

    let aResult = await Token.fetch(access_token)
    if (false === aResult[0]) {
        res.json(new ResultFault(aResult[1]))
        return
    }
    let client = aResult[1]

    res.json(new ResultData(client))
})

module.exports = router