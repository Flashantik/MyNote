import * as fb from 'firebase'

class Note {
  constructor (notesName, notesDiscription, noteRatio, noteNotification, noteDate, imageSrc = '') {
    this.notesName = notesName
    this.notesDiscription = notesDiscription
    this.noteRatio = noteRatio
    this.noteNotification = noteNotification
    this.noteDate = noteDate
    this.imageSrc = imageSrc
  }
}

export default {
  state: {
    notes: []
  },
  mutations: {
    createNote (state, payload) {
      state.notes.push(payload)
    },
    loadNotes (state, payload) {
      state.notes = payload
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
        const note = await fb.database().ref('notes').push(newNote)
        if (payload.image != null) {
          const image = payload.image
          const imgExt = image.name.slice(image.name.lastIndexOf('.'))
          const fileData = await fb.storage().ref(`notes/${note.key}${imgExt}`).put(image)
          let imageSrc = null
          await fileData.ref.getDownloadURL().then(function (downloadUrl) {
            imageSrc = downloadUrl
          })
          await fb.database().ref('notes').child(note.key).update({
            imageSrc
          })
          commit('createNote', {
            ...newNote,
            imageSrc
          })
        }
        commit('createNote', {
          ...newNote
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchNotes ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      const resultNotes = []
      try {
        const fbVal = await fb.database().ref('notes').once('value')
        const notes = fbVal.val()
        Object.keys(notes).forEach(key => {
          const note = notes[key]
          resultNotes.push(
            new Note(
              note.title,
              note.description,
              note.fullDiscription,
              note.price,
              note.imageSrc,
              key
            )
          )
        })
        console.log(resultNotes[0])
        commit('loadNotes', resultNotes)
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
    noteById (state) {
      return noteId => {
        return state.notes.find(note => note.id === noteId)
      }
    }
  }
}
