import * as fb from 'firebase'

class Note {
  constructor (notesName, notesDiscription, noteRatio = [], noteNotification, noteDate, imageSrc, id = '') {
    this.notesName = notesName
    this.notesDiscription = notesDiscription
    this.noteRatio = noteRatio
    this.noteNotification = noteNotification
    this.noteDate = noteDate
    this.imageSrc = imageSrc
    this.id = id
  }
}

export default {
  state: {
    notes: [],
    text: ''
  },
  mutations: {
    createNote (state, payload) {
      state.notes.push(payload)
    },
    changeNote (state, payload) {
      state.notes[payload.key] = payload
    },
    deleteNote (state, payload) {
      state.notes.splice([payload.key], 1)
    },
    loadNotes (state, payload) {
      state.notes = payload
    },
    setText (state, payload) {
      state.text = payload
    }
  },
  actions: {
    async createNote ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newNote = new Note(
          payload.notesName,
          payload.notesDiscription,
          payload.noteRatio,
          payload.noteNotification,
          payload.noteDate,
          ''
        )
        const note = await fb.database().ref(`user/${payload.uid}/notesList`).push(newNote)
        await fb.database().ref(`user/${payload.uid}/notesList/${note.key}`).update({id: note.key})
        if (payload.image != null) {
          const image = payload.image
          const imgExt = image.name.slice(image.name.lastIndexOf('.'))
          const fileData = await fb.storage().ref(`notes/${payload.uid}/avatar/${note.key}${imgExt}`).put(image)
          let imageSrc = null
          await fileData.ref.getDownloadURL().then(function (downloadUrl) {
            imageSrc = downloadUrl
          })
          await fb.database().ref(`user/${payload.uid}/notesList/${note.key}`).update({
            imageSrc
          })
          commit('createNote', {
            ...newNote,
            imageSrc
          })
        } else {
          commit('createNote', {
            ...newNote,
            id: note.key
          })
        }
        await fb.database().ref(`notes/${this.state.user.user.uid}/${note.key}`).set('')
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async changeNote ({commit, getters, dispatch}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newNote = new Note(
          payload.notesName,
          payload.notesDiscription,
          payload.noteRatio,
          payload.noteNotification,
          payload.noteDate,
          '',
          payload.id
        )
        if (getters.notes[payload.index].imageSrc !== '') {
          dispatch('deleteImage', {image: payload.imageSrc})
        }
        await fb.database().ref(`user/${payload.uid}/notesList/${payload.id}`).update(newNote)
        if (payload.image != null) {
          const image = payload.image
          const imgExt = image.name.slice(image.name.lastIndexOf('.'))
          const fileData = await fb.storage().ref(`notes/${payload.uid}/avatar/${payload.id}${imgExt}`).put(image)
          let imageSrc = null
          await fileData.ref.getDownloadURL().then(function (downloadUrl) {
            imageSrc = downloadUrl
          })
          await fb.database().ref(`user/${payload.uid}/notesList/${payload.id}`).update({
            imageSrc
          })
          commit('changeNote', {
            ...newNote,
            imageSrc,
            key: payload.index
          })
        } else {
          commit('changeNote', {
            ...newNote,
            key: payload.index
          })
        }
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async deleteImage ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.storage().refFromURL(payload.image).delete()
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async deleteNote ({commit, getters, dispatch}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        commit('deleteNote', {
          key: payload.index
        })
        if (payload.imageSrc) {
          dispatch('deleteImage', {image: payload.imageSrc})
        }
        await fb.database().ref(`user/${this.state.user.user.uid}/notesList/${payload.id}`).remove()
        await fb.database().ref(`notes/${this.state.user.user.uid}/${payload.id}`).remove()
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    // async fetchNotes ({commit}, payload) {
    //   commit('clearError')
    //   commit('setLoading', true)
    //   const resultNotes = []
    //   try {
    //     const fbVal = await fb.database().ref(`user/${payload.uid}/notesList`).once('value')
    //     // await fb.database().ref(`users`).orderByChild('uid').equalTo(payload.uid).on('value', function (snapshot) {
    //     if (fbVal.val()) {
    //       const notes = fbVal.val()
    //       Object.keys(notes).forEach(key => {
    //         const note = notes[key]
    //         resultNotes.push(
    //           new Note(
    //             note.notesName,
    //             note.notesDiscription,
    //             note.noteRatio,
    //             note.noteNotification,
    //             note.noteDate,
    //             note.imageSrc,
    //             note.id
    //           )
    //         )
    //       })
    //       commit('loadNotes', resultNotes)
    //     } else {
    //       commit('setMessageToClient', {message: 'У вас еще нет ни одной записки', type: 'error'})
    //     }
    //     commit('setLoading', false)
    //   } catch (error) {
    //     commit('setError', error.message)
    //     commit('setLoading', false)
    //     throw error
    //   }
    // },
    async fetchNotes ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      const resultNotes = []
      try {
        const notes = payload
        Object.keys(notes).forEach(key => {
          const note = notes[key]
          resultNotes.push(
            new Note(
              note.notesName,
              note.notesDiscription,
              note.noteRatio,
              note.noteNotification,
              note.noteDate,
              note.imageSrc,
              note.id
            )
          )
        })
        commit('loadNotes', resultNotes)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchText ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const fbVal = await fb.database().ref(`notes/${this.state.user.user.uid}/${payload}`).once('value')
        commit('setText', fbVal.val())
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async pushText ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.database().ref(`notes/${this.state.user.user.uid}/${payload.id}`).set(payload.text)
        commit('setMessageToClient', {message: 'Данные успешно сохранены', type: 'green'})
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  },
  getters: {
    notes (state) {
      return state.notes
    },
    noteText (state) {
      return state.text
    },
    noteById (state) {
      return noteId => {
        return state.notes.find(note => note.notesName === noteId)
      }
    }
  }
}
