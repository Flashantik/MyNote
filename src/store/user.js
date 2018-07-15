import * as fb from 'firebase'

// class User {
//   constructor (uid = '', nickname = '', tel = '', DOB = '', skills = [], myCountry = '', avatarSrc = '', email = '', balans = '', ads = []) {
//     this.uid = uid
//     this.nickname = nickname
//     this.tel = tel
//     this.DOB = DOB
//     this.skills = skills
//     this.myCountry = myCountry
//     this.avatarSrc = avatarSrc
//     this.balans = balans
//     this.ads = ads
//     this.email = email
//   }
// }

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
        const user = await fb.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        // const image = payload.avatar
        // const imgExt = image.name.slice(image.name.lastIndexOf('.'))
        // const fileData = await fb.storage().ref(`usersAvatar/${user.user.uid}${imgExt}`).put(image)
        // let avatarSrc = null
        // await fileData.ref.getDownloadURL().then(function (downloadUrl) {
        //   avatarSrc = downloadUrl
        // })

        // const userOpt = new User(
        //   user.user.uid,
        //   payload.nickname,
        //   payload.tel,
        //   payload.DOB,
        //   payload.skills,
        //   payload.myCountry,
        //   avatarSrc,
        //   payload.email
        // )

        // await fb.database().ref(`users`).child(user.user.uid).set(userOpt)
        // commit('setUser', userOpt)
        commit('setUser', user.uid)
        commit('setLoading', false)
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
        const user = await fb.auth().signInWithEmailAndPassword(email, password)
        // let userOpt
        // await fb.database().ref(`users`).orderByChild('uid').equalTo(user.user.uid).on('value', function (snapshot) {
        //   let thatUser = snapshot.val()
        //   userOpt = new User(
        //     thatUser[user.user.uid].uid,
        //     thatUser[user.user.uid].nickname,
        //     thatUser[user.user.uid].tel,
        //     thatUser[user.user.uid].DOB,
        //     thatUser[user.user.uid].skills,
        //     thatUser[user.user.uid].myCountry,
        //     thatUser[user.user.uid].avatarSrc,
        //     email,
        //     null,
        //     thatUser[user.user.uid].ads
        //   )
        //   commit('setUser', userOpt)
        //   commit('setLoading', false)
        // })
        commit('setUser', user.uid)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async autoLoginUser ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        console.log(payload)
        // let userOpt
        // await fb.database().ref(`users`).orderByChild('uid').equalTo(payload.uid).on('value', function (snapshot) {
        //   let thatUser = snapshot.val()
        //   userOpt = new User(
        //     thatUser[payload.uid].uid,
        //     thatUser[payload.uid].nickname,
        //     thatUser[payload.uid].tel,
        //     thatUser[payload.uid].DOB,
        //     thatUser[payload.uid].skills,
        //     thatUser[payload.uid].myCountry,
        //     thatUser[payload.uid].avatarSrc,
        //     payload.email
        //   )
        //   commit('setUser', userOpt)
        //   commit('setLoading', false)
        // })
        commit('setUser', payload.uid)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    logout ({commit}) {
      fb.auth().signOut()
      commit('setUser', null)
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
