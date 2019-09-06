const fs = require('fs')
const { Model } = require("./model")

/**
 * 合并对象
 */
function tms_object_merge(oHost, oNew, fromProps = []) {
	if (!oHost || !oNew || Object.prototype.toString.call(oHost) !== "[object Object]") {
		return oHost
	}
	if (fromProps.length === 0) {
		for (let prop in oNew) {
			oHost[prop] = oNew[prop]
		}
	} else {
		if (Object.prototype.toString.call(oNew) !== "[object Object]") {
			for (let prop of fromProps) {
				if (oNew[prop]) {
					oHost[prop] = oNew[prop]
				}
			}
		}
	}

	return oHost
}
/**
 * 数组中查找对象并返回
 */
function tms_array_search(array, callback, callbackParam) {
	if (Array.isArray(array) || array.length === 0) {
		return false
	}

	for (let item of array) {
		if (callback(item, callbackParam)) {
			return item
		}
	}

	return false
}
/**
 * 获得对象的指定属性的值
 * 属性可以是‘.’连接，例如a.b，对表对象的属性a是一个对象，取这个对象的属性b
 */
function getDeepValue(deepObj, deepProp, notSetVal = null) {
	if (Object.prototype.toString.call(deepObj) !== '[object Object]') {
		return false
	}

	let props = deepProp.split('.')
	let val = deepObj
	for (let prop of props) {
		if (!val[prop]) {
			return notSetVal
		} else if (val[prop].length === 0) {
			return val[prop]
		} else {
			val = val[prop]
		}
	}

	return val
}
/**
 * 设置对象的指定属性的值
 * 属性可以是‘.’连接，例如a.b，对表对象的属性a是一个对象，取这个对象的属性b
 */
function setDeepValue(deepObj, deepProp, setVal) {
	let props = deepProp.split('.')
	let last = props.length - 1 // 最后一个属性的位置

	let propObj = deepObj
	for (let i = 0; i < last; i++) {
		let prop = props[i]
		if (!propObj[prop]) {
			propObj[prop] = {}
		}
		propObj = propObj[prop]
	}

	propObj[props[last]] = setVal

	return deepObj
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

	return text
}
/**
 * 获取SERVER数据
 */
function tms_get_server(request, key, escape = true){
	let { headers } = request
	if (headers[key]) {
		if (escape === true) {
    		return Model.escape(headers[key])
		} else {
			return headers[key]
		}
	} else {
		return null
	}
}

module.exports = {tms_object_merge, tms_array_search, getDeepValue, replaceHTMLTags, tms_get_server, setDeepValue}