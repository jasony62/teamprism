const express = require('express');
const router = express.Router();
const fs = require('fs')
const Token = require('./token')

/**
 * 根据请求路径找到匹配的控制器和方法
 * 
 * 最后1段作为方法
 * 倒数第2端为文件名（加.js）
 * 如果文件不存在，倒数第2段作为目录名，查找main.js文件
 * 
 * @param {string} path 
 * @param {Who} who
 */
function findCtrlAndMethod(path, who) {
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

    const ctrl = require(ctrlPath)(who)
    if (ctrl[method] === undefined && typeof ctrl[method] !== 'function')
        throw new Error('参数错误，请求的对象不存在(3)')

    return [ctrl, method]
}
/**
 * 检查access_token
 * 根据路由自动匹配api
 * 自动匹配参数
 */
router.all('*', async (req, res) => {
    if (!req.query.access_token) {
        res.json({
            code: 1,
            errmsg: '没有access_token'
        })
        return
    }
    let aResult = await Token.fetch(req.query.access_token)
    if (false === aResult[0]) {
        res.json({
            code: 1,
            errmsg: aResult[1]
        })
        return
    }
    let who = aResult[1]
    try {
        const [ctrl, method] = findCtrlAndMethod(req.path, who)
        const result = await ctrl[method](req)
        res.json(result)
    } catch (err) {
        res.json({
            code: 2,
            errmsg: err
        })
    }
});

module.exports = router;