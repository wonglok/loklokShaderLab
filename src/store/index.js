import Vue from 'vue'
import Vuex from 'vuex'
// import firebase from '@/firebase'
// import router from '@/router'
import sites from './sites'

// import { firebaseMutations } from 'vuexfire'

Vue.use(Vuex)

var state = {
  loading: false,
  user: null
}

var mutations = {
  // ...firebaseMutations,
  setUser (state, value) {
    state.user = value
  }
}

var getters = {
  currentUser (state) {
    return state.user
  }
}

var actions = {
  // login ({ dispatch, commit }) {
  //   var email = window.prompt('email?')
  //   var password = window.prompt('password?')
  //   firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
  //     dispatch('checkLogin')

  //     // Handle Errors here.
  //     var errorCode = error.code
  //     var errorMessage = error.message
  //     console.log(errorCode, errorMessage)
  //   })// login
  // },
  // logout ({ dispatch, commit }) {
  //   firebase.auth().signOut().then(() => {
  //     dispatch('checkLogin')
  //   }).catch((error) => {
  //     dispatch('checkLogin')
  //     console.log(error)
  //   })
  // },
  // checkLogin ({ state }) {
  //   if (state.user && router.currentRoute.path === '/login') {
  //     router.replace('/')
  //   } else if (!state.user && router.currentRoute.path !== '/login') {
  //     router.replace('/login')
  //   }
  // }
}

var onAuthChange = store => {
  // firebase.auth().onAuthStateChanged((user) => {
  //   store.commit('setUser', user || false)
  // })// check auth
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [onAuthChange]
})

sites.use(store)

export default store
