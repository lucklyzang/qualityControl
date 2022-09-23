// 质量管理信息store的初始值
export function getDefaultQualityState() {
    return {
			titleText: '',
			bottomBarIndex: 0,
			taskMessage: {},
			mainTaskId: '',
			subtaskInfo: {},
			subtaskDetails: {},
			disposeSubTaskData: [],
			cacheIndex: {},
			isSkipDetails: false,
			timeMessage: {},
			ossMessage: {},
		}	
};