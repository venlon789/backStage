import { getToken, setToken } from '@/utils/auth'
const state = {
  token: getToken() || '',
  // 面包屑
  onemenu: '',
  twomenu: ''

}
const mutations = {
  setToken (state, token) {
    console.log(token)
    state.token = token
    setToken(token)
  },
  setOnemenu (state, menu1) {
    state.onemenu = menu1
  },
  setTwomenu (state, menu2) {
    state.twomenu = menu2
  }
}
const actions = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
