const fs = require('fs')

class Response {
    constructor(data, err_code, err_msg) {
    	this.err_code = err_code
        this.err_msg = err_msg
        this.data = data
    }
}

class utilities {
	responseData(data, err_code = 0, err_msg = 'success') {
		return new Response(data, err_code, err_msg);
	}
	responseError(err_msg, data = null) {
		return new Response(data, -1, err_msg);
	}
	responseTimeout(msg = '长时间未操作，请重新<a href="/rest/site/fe/user/access?site=platform" target="_self">登录</a>！') {
		return new Response(null, -2, msg);
	}
	invalidAccessToken(msg = '没有获得有效访问令牌') {
		return new Response(null, -3, msg);
	}
	parameterError(msg = '参数错误。') {
		return new Response(null, 100, msg);
	}
	objectNotFoundError(msg = '指定的对象不存在。') {
		return new Response(null, 100, msg);
	}
	resultEmptyError(msg = '获得的结果为空。') {
		return new Response(null, 101, msg);
	}
	complianceError(msg = '业务逻辑错误。') {
		return new Response(null, 200, msg);
	}
	dataExistedError(msg = '数据已经存在。') {
		return new Response(null, 201, msg);
	}
	databaseError(msg = '数据库错误。') {
		return new Response(null, 900, msg);
	}
	// 自动加载并实例化model
	model(model_path, data = '') {
		if (model_path.includes("\\")) {
			var model_file = model_path.replace("/\\\\/", '/');
		} else if (model_path.includes('/')) {
			var model_file = model_path;
		} else {
			var model_file = model_path;
		}

		var model_file = process.cwd() + '/models/' + model_file + '.js'
		if (!fs.existsSync(model_file)) {
            throw new Error('指定model文件不存在')
	    }

	    var req = require(model_file)
		return new req(data);
	}
	/**
	 * 合并对象
	 */
	tms_object_merge(oHost, oNew, fromProps = []) {
		if (!oHost || !oNew || Object.prototype.toString.call(oHost) !== "[object Object]") {
			return oHost;
		}
		if (fromProps.length === 0) {
			oNew.forEach(function(val, prop) {
				oHost[prop] = val
			})
		} else {
			if (Object.prototype.toString.call(oNew) !== "[object Object]") {
				fromProps.forEach(function(prop) {
					if (oNew[prop]) {
						oHost[prop] = oNew[prop]
					}
				})
			}
		}

		return oHost
	}
	/**
	 * 数组中查找对象并返回
	 */
	tms_array_search(array, callback, callbackParam) {
		if (Object.prototype.toString.call(array) !== "[object Array]" || array.length === 0) {
			return false;
		}

		array.forEach(function(item) {
			if (callback(item, callbackParam)) {
				return item
			}
		})

		return false
	}
	/**
     * 获得对象的指定属性的值
     * 属性可以是‘.’连接，例如a.b，对表对象的属性a是一个对象，取这个对象的属性b
     */
	getDeepValue(deepObj, deepProp, notSetVal = null) {
        let props = deepProp.split('.')
        let val = deepObj;
		props.forEach(function(prop) {
			if (val[prop] === 'undefined') {
				return notSetVal;
			} else if (val[prop].length === 0) {
				return val[prop]
			} else {
				val = val[prop]
			}
		})

        return val;
    }
}

module.exports = function () {
    return new utilities()
}