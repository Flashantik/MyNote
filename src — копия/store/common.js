export default {
  state: {
    loading: false,
    error: null,
    messageToClient: null
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setMessageToClient (state, payload) {
      state.messageToClient = payload
    },
    clearMessageToClient (state) {
      state.messageToClient = null
    }
  },
  actions: {
    setLoading ({commit}, payload) {
      commit('setLoading', payload)
    },
    setError ({commit}, payload) {
      commit('setError', payload)
    },
    clearError ({commit}) {
      commit('clearError')
    },
    setMessageToClient ({commit}, payload) {
      commit('clearMessageToClient')
      setTimeout(function () {
        commit('setMessageToClient', payload)
      }, 100)
    },
    clearMessageToClient ({commit}) {
      commit('clearMessageToClient')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    messageToClient (state) {
      return state.messageToClient
    }
  }
}
