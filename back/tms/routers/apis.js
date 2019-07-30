const express = require('express');
const router = express.Router();
const fs = require('fs')
const Who = require('../who')
const utilities = require('../utilities')

/**
 * 返回和token匹配的用户
 * 
 * @param {string} token 
 */
function checkAccessToken(token) {
    let who = Who()
    return who;
}
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
    global.utilities = new utilities
    
    if (!req.query.access_token)
        res.json({
            code: 1,
            errmsg: '没有access_token'
        })
    let who
    if (false === (who = checkAccessToken(req.query.access_token)))
        res.json({
            code: 1,
            errmsg: 'access_token不可用'
        })

    try {
        const [ctrl, method] = findCtrlAndMethod(req.path, who)
        const result = await ctrl[method](req)
        res.json(result)
    } catch (err) {
console.log(err);
        res.json({
            code: 1,
            errmsg: err.message
        })
    }
});

module.exports = router;