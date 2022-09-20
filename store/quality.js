export default {
  state:{
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
		ossMessage: {}
  },
  getters:{
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
		ossMessage: state => state.ossMessage
  },
  mutations:{
    changeTitleText (state, playLoad) {
      state.titleText = playLoad
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
		}
  },
  actions:{}
}