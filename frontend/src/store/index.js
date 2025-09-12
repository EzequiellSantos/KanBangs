import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default createStore({

  state() { //dados manipulados ao usar a página

    return{
      authenticated: false,
      token: null,
      userId: null
    }

  },
  getters: {
    token: state => state.token,
    userId: state =>  state.userId

  },
  mutations: {

    authenticated(state, data) {

      state.authenticated = true
      state.token = data.token
      state.userId = data.userId

    },
    logout(state){

      state.authenticated = false
      state.token = null
      state.userId = null

    }

  },
  plugins: [vuexLocal.plugin]

})