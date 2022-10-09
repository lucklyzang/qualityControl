/*
 * 存储uni localStorage
 * @param{String} name key值
 * @param{String} data value值
*/
export const setCache = (name, data) => {
	try {
		uni.setStorageSync(name, data);
	} catch (e) {
		console.log(e)
	}
}

/*
 * 获取uni localStorage
 * @param{String} name key值
*/
export const getCache = (name) => {
	let data;
	try {
		data = uni.getStorageSync(name);
	} catch (e) {
		console.log(e);
	}
	return data
}

/*
 * 删除指定key的uni localStorage
 * @param{String} name key值
*/
export const removeCache = (name) => {
	try {
		uni.removeStorageSync(name);
	} catch (e) {
		console.log(e);
	}
}

/*
 * 判断指定key在uni localStorage是否存在
 * @param{String} name key值
*/
export const checkCache = (name) => {
	let value;
	try {
		const res = uni.getStorageInfoSync()
		value = res.keys.includes(name)
	} catch (e) {
		console.log(e)
	}
	return value
}

/*
 * 删除本地uni localStorage
 * 
*/
export const clearCache = () => {
	try{
		uni.clearStorageSync();
	} catch (e){
		console.log(e)
	}

}

/*
 * 格式化当前日期
 * 
*/
export const getDate = () => {
	var date = new Date();
	var year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
	var month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
	var day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
	
	var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
	var minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
	var seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)   
	//获取当前系统时间  
	var currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	//修改月份格式
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	//修改日期格式
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	//修改小时格式
	if (hours >= 0 && hours <= 9) {
		hours = "0" + hours;
	}
	//修改分钟格式
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	//修改秒格式
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	//获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)+ " " + hours + ":" + minutes + ":" + seconds
	var currentFormatDate = year + "-" + month + "-" + day;
	return currentFormatDate

}

/*
 * 获取字符串的长度
 * @param{String} str 指定字符串
*/
export const getStringLength = (str) => {
	let realLength = 0, len = str.length, charCode = -1;
	for (let i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
	}
	return realLength
}

export const removeAllLocalStorage = () => {
  // removeStore('userName');
  // removeStore('userPassword');
  removeCache('userInfo');
  removeCache('isLogin');
	removeCache('roleNameList');
  removeCache('questToken');
	removeCache('permissionInfo');
  removeCache('storeOverDueWay');
	removeCache('selectHospitalList')
}
