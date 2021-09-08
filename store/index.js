import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import quality from './quality.js';
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    login,
		quality
  }
});