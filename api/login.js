import request from '@/api/request';

// 获取医院列表
export function getHospitalList() {
	return request({
	    url: 'project/queryAll',
	    method: 'get'
	  })
}

// 账号密码登录
export function logIn(data) {
	return request({
	    url: 'auth/login',
	    method: 'post',
	    data
	  })
}

// 用户退出登录
export function userSignOut() {
  return request({
    url: 'auth/logout',
    method: 'post'
  })
};

// 微信登录
export function weixinLogIn(code) {
	return request({
	    url: `login/wx/${code}`,
	    method: 'get'
	})
}

// 微信授权绑定已存在账号
export function boundExist(code,data) {
	return request({
	    url: `login/wx/boundExist/${code}`,
	    method: 'post',
			data
	})
}

// 微信授权不绑定账号
export function boundNotExist(proId,code) {
	return request({
	    url: `login/wx/boundNotExist/${proId}/${code}`,
	    method: 'post',
			data: {}
	})
}

