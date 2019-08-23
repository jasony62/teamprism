const express = require('express');
const router = express.Router();
const fs = require('fs')
const Token = require('../token')
const { ResultFault } = require('../api')
const { RequestTransaction: ReqTrans } = require('../../models/tms/transaction')
/**
 * 根据请求路径找到匹配的控制器和方法
 * 
 * 最后1段作为方法
 * 倒数第2端为文件名（加.js）
 * 如果文件不存在，倒数第2段作为目录名，查找main.js文件
 * 
 * @param {Request} req 
 * @param {Who} client
 */
function findCtrlAndMethod(req, client) {
    let { path } = req
    let pieces = path.split('/')
    if (pieces.length < 2)
        throw new Error('参数错误，请求的对象不存在(1)')

    let method = pieces.splice(-1, 1)
    let ctrlPath = process.cwd() + '/apis/' + pieces.join('/') + '.js'
    if (!fs.existsSync(ctrlPath)) {
        ctrlPath = process.cwd() + '/apis/' + pieces.join('/') + '/main.js'
        if (!fs.existsSync(ctrlPath))
            throw new Error('参数错误，请求的对象不存在(2)')
    }

    const CtrlClass = require(ctrlPath)
    const oCtrl = new CtrlClass(req, client)
    if (oCtrl[method] === undefined && typeof oCtrl[method] !== 'function')
        throw new Error('参数错误，请求的对象不存在(3)')

    return [oCtrl, method]
}
/**
 * 1. 检查access_token
 * 2. 根据路由自动匹配api
 * 3. 自动匹配参数
 * 
 */
router.all('*', async (req, res) => {
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

    try {
        const [oCtrl, method] = findCtrlAndMethod(req, client)
        /**
         * 是否需要事物？
         */
        let moTrans, trans
        if (oCtrl.tmsRequireTransaction && typeof oCtrl.tmsRequireTransaction === 'function') {
            let transMethodes = oCtrl.tmsRequireTransaction()
            if (transMethodes && transMethodes[method]) {
                moTrans = new ReqTrans(req)
                trans = await moTrans.begin()
            }
        }
        /**
         * 前置操作
         */
        if (oCtrl.tmsBeforeEach && typeof oCtrl.tmsBeforeEach === 'function') {
            const resultBefore = await oCtrl.tmsBeforeEach(method)
            if (resultBefore instanceof ResultFault) {
                res.json(resultBefore)
                return
            }
        }
        const result = await oCtrl[method](req)
        /**
         * 结束事物
         */
        if (moTrans && trans)
            moTrans.end(trans.id)

        res.json(result)
    } catch (err) {
        res.json(new ResultFault(typeof err === 'string' ? err : err.toString()))
    }
})

module.exports = router