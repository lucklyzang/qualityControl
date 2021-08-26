export default {
	state: {
		userInfo: null,
		token: null, //请求token,
		overDueWay: false
	},
	getters: {
		userInfo: state => state.userInfo,
		token: state => state.token,
		overDueWay: state => state.overDueWay
	},
	mutations: {
		storeUserInfo(state, playLoad) {
			state.userInfo = playLoad
		},
		// 修改token状态
		changeToken(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				state.token = playLoad
			}
		},
		// 修改过期方式
		changeOverDueWay(state, playLoad) {
			state.overDueWay = playLoad
		}
	},
	actions: {}
}
