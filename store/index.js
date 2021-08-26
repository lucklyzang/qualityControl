import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import transport from './transport.js';
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    login,
	transport
  }
});