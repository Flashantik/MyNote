import fb from 'firebase'

export default function (to, from, next) {
  if (fb.auth().currentUser) {
    next('/notes')
  } else {
    next('/')
  }
}
