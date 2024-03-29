// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import store from './store'
import Grid from 'vue-js-grid'
import * as fb from 'firebase'
import './other/style.css'
import AppLoader from './components/loader.vue'
import AppBs from './components/beatifulScreen.vue'

Vue.use(Grid)

Vue.use(Vuetify)
Vue.component('appLoader', AppLoader)
Vue.component('appBs', AppBs)
Vue.config.productionTip = false

let app
Vue.config.productionTip = false
fb.initializeApp({
  apiKey: 'AIzaSyDJkf9u-QLu7zWj78dirXq4KMY-l-6sNA0',
  authDomain: 'mynote-f85c1.firebaseapp.com',
  databaseURL: 'https://mynote-f85c1.firebaseio.com',
  projectId: 'mynote-f85c1',
  storageBucket: 'mynote-f85c1.appspot.com',
  messagingSenderId: '201671105800'
})

/* eslint-disable no-new */
fb.auth().onAuthStateChanged(user => {
  if (!app) {
    new Vue({
      el: '#app',
      store,
      router,
      components: { App },
      template: '<App/>',
      async created () {
        if (user) {
          await this.$store.dispatch('autoLoginUser', user)
          // await this.$store.dispatch('fetchNotes', user)
        }
      }
    })
  }
})
