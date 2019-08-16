const fs = require('fs')

// 自动加载并实例化model
function model(model_path, data = '') {
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
function tms_object_merge(oHost, oNew, fromProps = []) {
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
function tms_array_search(array, callback, callbackParam) {
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
function getDeepValue(deepObj, deepProp, notSetVal = null) {
	let props = deepProp.split('.')
	let val = deepObj
	props.forEach(function(prop) {
		if (!val[prop]) {
			return notSetVal;
		} else if (val[prop].length === 0) {
			return val[prop]
		} else {
			val = val[prop]
		}
	})

	return val
}
/**
     * 替换字符串中的html标签
     * $brValue <br>标签要替换成的值
     */
function replaceHTMLTags(text, brValue = '') {
	if (typeof text !== 'string') {
		return false
	}

	text = text.replace('<br>', brValue)
	text = text.replace('</br>', "")
	text = text.replace(/<[\/\!]*[^<>]*>/ig,"")
	text = text.replace('&nbsp;', ' ')
	text = text.replace('&amp;', '&')

	return text;
}

module.exports = {model, tms_object_merge, tms_array_search, getDeepValue, replaceHTMLTags}