import * as fb from 'firebase'

class User {
  constructor (tel, DOB, myCountry) {
    this.tel = tel
    this.DOB = DOB
    this.myCountry = myCountry
  }
}

class FullUser {
  constructor (tel = '', DOB = '', myCountry = '', avatarSrc, uid, nickname) {
    this.tel = tel
    this.DOB = DOB
    this.myCountry = myCountry
    this.avatarSrc = avatarSrc
    this.uid = uid
    this.nickname = nickname
  }
}

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
    async pushFakeData () {
      let newNote = {
        maxPower: 1,
        truePower: 4
      }
      await fb.database().ref(`user/b4IHjZv2OWsdAiuEHHOp1`).push(newNote)
    },
    async registerUser ({commit, getters, dispatch}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await fb.auth().createUserWithEmailAndPassword(payload.email, payload.password).then(
          commit('setUser', !null)
        )
        let avatarSrc
        if (payload.avatar) {
          const image = payload.avatar
          const imgExt = image.name.slice(image.name.lastIndexOf('.'))
          const fileData = await fb.storage().ref(`usersAvatar/${user.user.uid}/${user.user.uid}${imgExt}`).put(image)
          await fileData.ref.getDownloadURL().then(function (downloadUrl) {
            avatarSrc = downloadUrl
          })
        }
        let profile = {
          displayName: payload.nickname,
          photoURL: avatarSrc
        }
        fb.auth().currentUser.updateProfile(profile)
        const userOpt = new User(
          payload.tel,
          payload.DOB,
          payload.myCountry
        )
        await fb.database().ref(`user`).child(user.user.uid).set(userOpt)
        userOpt.avatarSrc = avatarSrc
        userOpt.uid = user.user.uid
        userOpt.nickname = payload.nickname
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
          let userOpt
          let user = fb.auth().currentUser
          fb.database().ref(`user/${payload.uid}`).once('value')
          .then(function (snapshot) {
            let thatUser = snapshot.val()
            if (thatUser) {
              userOpt = new FullUser(
              thatUser.tel,
              thatUser.DOB,
              thatUser.myCountry,
              user.photoURL,
              user.uid,
              user.displayName
            )
              if (thatUser.notesList) {
                dispatch('fetchNotes', thatUser.notesList)
              } else {
                commit('setMessageToClient', {message: 'У вас еще нет ни одной записки', type: 'error'})
              }
            } else {
              userOpt = {
                avatarSrc: user.photoURL,
                uid: user.uid,
                nickname: user.displayName
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
