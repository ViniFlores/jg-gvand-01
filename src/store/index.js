import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: null,
    userId: null
  },
  mutations: {
    setUser(state, payload) {
      state.name = payload.name
      state.userId = payload.userId
    },
    setName(state, payload) {
      state.name = payload
    }
  },
  getters: {
    name(state) {
      return state.name
    },
    userId(state) {
      return state.userId
    }
  },
  actions: {},
  modules: {},
  plugins: [createPersistedState()]
})