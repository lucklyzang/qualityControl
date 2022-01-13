export default {
  state:{
    titleText: '',
    bottomBarIndex: 0,
		mainTaskId: '',
		subtaskInfo: {},
		disposeSubTaskData: [],
		cacheIndex: {},
		isSkipDetails: false,
		timeMessage: {},
		ossMessage: {}
  },
  getters:{
    titleText: state => state.titleText,
    bottomBarIndex: state => state.bottomBarIndex,
		mainTaskId: state => state.mainTaskId,
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
		changeMainTaskId (state, playLoad) {
		  state.mainTaskId = playLoad
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