import axios from 'axios-miniprogram'
import store from '@/store'
import Qs from 'qs'
import { setCache, getCache, removeAllLocalStorage } from '@/common/js/utils'
const instance = axios.create({
  baseURL: 'https://blink.blinktech.cn/nblink',
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
	if (Object.prototype.toString.call(error.response) === '[object Object]') {
		if (error.response.hasOwnProperty('data')) {
			if (error.response.data.hasOwnProperty('msg')) {
				return Promise.reject(error.response.data.msg)
			} else {
				return Promise.reject(error.response.data)
			}
		} else {
			return Promise.reject(error.response)
		}
	}	else {
		return Promise.reject(error)
	}
});

export default instance