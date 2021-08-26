export default {
  state:{
    titleText: '',
    bottomBarIndex: 0,
  },
  getters:{
    titleText: state => state.titleText,
    bottomBarIndex: state => state.bottomBarIndex
  },
  mutations:{
    changeTitleText (state, playLoad) {
      state.titleText = playLoad
    },
    changeBottomBarIndex (state, playLoad) {
      state.bottomBarIndex = playLoad
    }
  },
  actions:{}
}