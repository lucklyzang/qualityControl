import axios from 'axios-miniprogram'
import store from '@/store'
import Qs from 'qs'
import { setCache, getCache, removeAllLocalStorage } from '@/common/js/utils'
const instance = axios.create({
	// 生产域名 https://blinktech.cn/nblink
	// 开发域名 https://blink.blinktech.cn/nblink
	// 准生产域名 https://ver.blinktech.cn/nblink
	// 测试域名 https://show.blinktech.cn/nblink
  baseURL: 'https://blink.blinktech.cn/nblink',
	retry: 3, // 网络请求异常后，重试次数 
	retryDelay: 1000, // 每次重试间隔时间
	timeout: 30000,
  headers: {
    // common: {    
    //   'Accept': 'application/json, test/plain,'
    // }
    // post: {
    //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    // }
  }
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  if (config['url'] == 'auth/login') {
  	config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  };
	// 请求头添加token
	if (store.getters.token) {
	   config.headers['Authorization'] = store.getters.token
	}; 
	return config;
}, function (error) {
  //处理请求错误
  return Promise.reject(error.response);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
	if (response.headers['token']) {
		store.commit('changeToken', response.headers['token']);
		setCache('questToken', response.headers['token'])
	};
	return response
}, function (error) {
	if (Object.prototype.toString.call(error.response) === '[object Object]') {
		if (error.response.hasOwnProperty('status')) {
			if (error.response.status === 401) {
				removeAllLocalStorage();
				if (!store.getters.overDueWay) { 
					uni.showToast({
						title: 'token已过期,请重新登录',
						duration: 1000
					});
					setTimeout(() => {
						uni.redirectTo({
						 url: '/pages/login/login'
						})
					},2000);
				 } else {
					uni.redirectTo({
						url: '/pages/login/login'
					})
				}
			}
		}
	};		
  // 处理响应错误
	var config = error.config;
	// 判断是否配置了重试
	if(!config || !config.retry) {
		if (Object.prototype.toString.call(error.response) === '[object Object]') {
			if (error.response.hasOwnProperty('data')) {
				if (error.response.data.hasOwnProperty('msg')) {
					return Promise.reject(error.response.data.msg)
				} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
					return Promise.reject(error.response.data)
				}
			} else {
				return Promise.reject(error.response)
			}
		}	else {
			return Promise.reject(error)
		}
	};
	if(!config.shouldRetry || typeof config.shouldRetry != 'function') {
		if (Object.prototype.toString.call(error.response) === '[object Object]') {
			if (error.response.hasOwnProperty('data')) {
				if (error.response.data.hasOwnProperty('msg')) {
					return Promise.reject(error.response.data.msg)
				} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
					return Promise.reject(error.response.data)
				}
			} else {
				return Promise.reject(error.response)
			}
		}	else {
			return Promise.reject(error)
		}
	};
	//判断是否满足重试条件
	if(!config.shouldRetry(error)) {
		if (Object.prototype.toString.call(error.response) === '[object Object]') {
			if (error.response.hasOwnProperty('data')) {
				if (error.response.data.hasOwnProperty('msg')) {
					return Promise.reject(error.response.data.msg)
				} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
					return Promise.reject(error.response.data)
				}
			} else {
				return Promise.reject(error.response)
			}
		}	else {
			return Promise.reject(error)
		}
	};
	// 设置重置次数，默认为0
	config.__retryCount = config.__retryCount || 0;
	// 判断是否超过了重试次数
	 if(config.__retryCount > config.retry) {
		 if (Object.prototype.toString.call(error.response) === '[object Object]') {
		 	if (error.response.hasOwnProperty('data')) {
		 		if (error.response.data.hasOwnProperty('msg')) {
		 			return Promise.reject(error.response.data.msg)
		 		} else if (error.response.data.hasOwnProperty('message')) {
					return Promise.reject(error.response.data.message)
				} else {
		 			return Promise.reject(error.response.data)
		 		}
		 	} else {
		 		return Promise.reject(error.response)
		 	}
		 }	else {
		 	return Promise.reject(error)
		 }
	 };
	//重试次数自增
	config.__retryCount += 1;
	//延时处理
	var backoff = new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, config.retryDelay || 1);
	});
	//重新发起axios请求
	return backoff.then(function() {
		return service(config);
	})
});

export default instance