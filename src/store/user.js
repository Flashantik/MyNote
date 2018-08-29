import * as fb from 'firebase'

export default {
  state: {
    user: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    createUser (state, payload) {
      state.UserOptions = payload
    }
  },
  actions: {
    async registerUser ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await fb.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
          commit('setUser', !null)
        )
        // fb.auth().currentUser.sendEmailVerification()   // Верификация пользователя
        const userOpt = {}
        userOpt.uid = user.user.uid
        userOpt.email = payload.email
        commit('setUser', userOpt)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async loginUser ({commit}, {email, password}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.auth().signInWithEmailAndPassword(email, password)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async autoLoginUser ({commit, dispatch}, payload) {
      if (!this.state.user.user) {
        commit('clearError')
        commit('setLoading', true)
        commit('setUser', !null)
        try {
          let userOpt = {}
          let user = fb.auth().currentUser
          fb.database().ref(`user/${payload.uid}`).once('value')
          .then(function (snapshot) {
            let thatUser = snapshot.val()
            if (thatUser) {
              userOpt = {
                uid: user.uid,
                email: user.email
              }
              if (thatUser.notesList) {
                dispatch('fetchNotes', thatUser.notesList)
              } else {
                commit('setMessageToClient', {message: 'У вас еще нет ни одной записки', type: 'error'})
              }
            } else {
              userOpt = {
                uid: user.uid,
                email: user.email
              }
              commit('setMessageToClient', {message: 'У вас еще нет ни одной записки', type: 'error'})
            }
            commit('setUser', userOpt)
            commit('setLoading', false)
          })
        } catch (error) {
          commit('setLoading', false)
          commit('setError', error.message)
          throw error
        }
      }
    },
    async logout ({commit}) {
      await fb.auth().signOut()
      commit('setUser', null)
      commit('loadNotes', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    userlogged (state) {
      return state.user !== null
    },
    userOpt (state) {
      return state.userOpt
    }
  }
}
