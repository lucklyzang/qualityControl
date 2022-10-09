import { getDefaultQualityState } from '@/common/js/resetStore/resetStore.js'
export default {
  state: getDefaultQualityState(),
  getters:{
		enterTaskDetailsSource: state => state.enterTaskDetailsSource,
		isShowRevaluationBtn: state => state.isShowRevaluationBtn,
		isShowRejectBtn: state => state.isShowRejectBtn,
		enterGradeSource: state => state.enterGradeSource,
    titleText: state => state.titleText,
		taskMessage: state => state.taskMessage,
    bottomBarIndex: state => state.bottomBarIndex,
		mainTaskId: state => state.mainTaskId,
		subtaskDetails: state => state.subtaskDetails,
		subtaskInfo: state => state.subtaskInfo,
		disposeSubTaskData: state => state.disposeSubTaskData,
		cacheIndex: state => state.cacheIndex,
		isSkipDetails: state => state.isSkipDetails,
		timeMessage: state => state.timeMessage,
		ossMessage: state => state.ossMessage,
		recordExamineItemScrollTop: state => state.recordExamineItemScrollTop
  },
  mutations:{
    changeTitleText (state, playLoad) {
      state.titleText = playLoad
    },
		changeIsShowRevaluationBtn (state, playLoad) {
		  state.isShowRevaluationBtn = playLoad
		},
		changeIsShowRejectBtn (state, playLoad) {
		  state.isShowRejectBtn = playLoad
		},
		changeEnterTaskDetailsSource (state, playLoad) {
		  state.enterTaskDetailsSource = playLoad
		},
		changeEnterGradeSource(state, playLoad) {
		  state.enterGradeSource = playLoad
		},
    changeBottomBarIndex (state, playLoad) {
      state.bottomBarIndex = playLoad
    },
		changeTaskMessage (state, playLoad) {
			state.taskMessage = playLoad
		},
		changeMainTaskId (state, playLoad) {
		  state.mainTaskId = playLoad
		},
		changeSubtaskDetails (state, playLoad) {
			state.subtaskDetails = playLoad
		},
		changeSubtaskInfo (state, playLoad) {
		  state.subtaskInfo = playLoad
		},
		changeDisposeSubTaskData (state, playLoad) {
			state.disposeSubTaskData = playLoad
		},
		changeCacheIndex (state, playLoad) {
			state.cacheIndex = playLoad
		},
		changeIsSkipDetails (state, playLoad) {
			state.isSkipDetails = playLoad
		},
		changeTimeMessage (state, playLoad) {
			state.timeMessage = playLoad
		},
		changeOssMessage (state, playLoad) {
			state.ossMessage = playLoad
		},
		changeRecordExamineItemScrollTop (state, playLoad) {
			state.recordExamineItemScrollTop = playLoad
		},
		//重置质量管理的状态
		resetQualityInfoState(state) {
				Object.assign(state, getDefaultQualityState())
		}
  },
  actions: {
		resetQualityState({ commit }) {
				commit('resetQualityInfoState')
		}
	}
}