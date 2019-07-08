const express = require('express');
const router = express.Router();
const fs = require('fs')
/**
 * 根据请求路径找到匹配的控制器和方法
 * 
 * @param {*} path 
 */
function findCtrlAndMethod(path) {
    let pieces = path.split('/')
    if (pieces.length < 2)
        throw new Error('参数错误，请求的对象不存在(1)')

    let method = pieces.splice(-1, 1)
    let ctrlPath = process.cwd() + '/controllers/' + pieces.join('/') + '.js'
    if (!fs.existsSync(ctrlPath))
        throw new Error('参数错误，请求的对象不存在(2)')

    const ctrl = require(ctrlPath)
    if (ctrl[method] === undefined && typeof ctrl[method] !== 'function')
        throw new Error('参数错误，请求的对象不存在(3)')

    return [ctrl, method]
}

router.all('*', function (req, res) {
    try {
        const [ctrl, method] = findCtrlAndMethod(req.path)
        const result = ctrl[method]()
        res.json({
            code: 0,
            data: result
        })
    } catch (err) {
        res.json({
            code: 1,
            msg: err.message
        })
    }
});

module.exports = router;