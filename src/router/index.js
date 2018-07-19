import Vue from 'vue'
import Router from 'vue-router'
import authGuard from './authGuard'
import AppHome from '../components/Home.vue'
import AppNotes from '../components/notes.vue'
// import AppNotes from '../components/notes.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: AppHome
    },
    {
      path: '/notes',
      name: 'Notes',
      component: AppNotes,
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
