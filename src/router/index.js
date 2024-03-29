import Vue from 'vue'
import Router from 'vue-router'
import authGuard from './authGuard'
import redirection from './redirection'
import AppHome from '../components/home.vue'
import AppNotes from '../components/notes.vue'
// import AppNote from '../components/note.vue'

const AppNote = resolve => {
  require.ensure(['../components/note.vue'], () => {
    resolve(
      require('../components/note.vue')
    )
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: AppHome,
      beforeEnter: redirection
    },
    {
      path: '/notes',
      name: 'Notes',
      component: AppNotes,
      requiresAuth: true,
      beforeEnter: authGuard
    },
    {
      path: '/:id',
      name: 'Note',
      component: AppNote,
      requiresAuth: true,
      beforeEnter: authGuard
    }
    // {
    //   path: '/',
    //   name: 'Notes',
    //   component: AppNotes,
    //   requiresAuth: true,
    //   beforeEnter: authGuard
    // }
  ],
  mode: 'history'
})
