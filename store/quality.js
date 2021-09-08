export default {
  state:{
    titleText: '',
    bottomBarIndex: 0,
		mainTaskId: '',
		subtaskInfo: {},
		disposeSubTaskData: []
  },
  getters:{
    titleText: state => state.titleText,
    bottomBarIndex: state => state.bottomBarIndex,
		mainTaskId: state => state.mainTaskId,
		subtaskInfo: state => state.subtaskInfo,
		disposeSubTaskData: state => state.disposeSubTaskData
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
		}
  },
  actions:{}
}