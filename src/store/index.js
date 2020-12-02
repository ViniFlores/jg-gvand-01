import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: null
  },
  mutations: {
    setUser(state, payload) {
      state.name = payload.name
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
  modules: {}
})