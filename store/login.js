export default {
	state: {
		userInfo: null,
		token: null, //请求token,
		overDueWay: false,
		selectHospitalList: [],
		permissionInfo: []
	},
	getters: {
		userInfo: state => state.userInfo,
		token: state => state.token,
		overDueWay: state => state.overDueWay,
		selectHospitalList: state => state.selectHospitalList,
		permissionInfo: state => state.permissionInfo
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
		},
		// 修改项目列表
		changeSelectHospitalList(state, playLoad) {
			state.selectHospitalList = playLoad
		},
		// 修改权限列表
		changePermissionInfo(state, playLoad) {
			state.permissionInfo = playLoad
		}
	},
	actions: {}
}
