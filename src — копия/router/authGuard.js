import fb from 'firebase'
import store from './../store'

export default function (to, from, next) {
  if (fb.auth().currentUser) {
    next()
  } else {
    next('/?loginError')
    store.dispatch('setError', 'Пожалуйста авторизируйтесь чтобы получить доступ к данной странице')
  }
}
