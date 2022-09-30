// 质量管理信息store的初始值
export function getDefaultQualityState() {
    return {
			titleText: '',
			recordExamineItemScrollTop: 0,
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
			enterTaskDetailsSource: '',
			enterGradeSource: '',
			isShowRevaluationBtn: true,
			isShowRejectBtn: true
		}	
};