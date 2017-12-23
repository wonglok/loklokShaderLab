const namespace = 'sites'
export const ns = namespace
export const pfx = ns + '/'
// import { db } from '@/firebase'
// const codebase = db.ref('codebase')

const state = {
}

const getters = {
}

const mutations = {

}

const actions = {
}

const moduleObj = {
  mutations,
  ns,
  pfx,
  namespaced: true,
  state,
  actions,
  getters,
  use,
  clean
}

function use (store) {
  store.registerModule(ns, moduleObj)

  // store.subscribe((mutation, state) => {
  //   // called after every mutation.
  //   // The mutation comes in the format of `{ type, payload }`.
  // })
}

function clean (store) {
  store.unregisterModule(ns)
}

export default moduleObj
