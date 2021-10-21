import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    rooms: [],
    currentRoom: {},
    messages: [],
  },
  mutations: {
    // Synchonous way to update store
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    SEND_MESSAGE(state, payload) {
      state.messages.push(payload);
    },
  },
  actions: {
    // Asyncronous, for API
    setUser(state, user) {
      if (user) {
        state.commit("SET_USER", user);
        state.commit("SET_LOGGED_IN", user !== null);
      }
    },
    signOut(state) {
      state.commit("SET_USER", null);
    },
    sendMessage(state, payload) {
      state.commit("SEND_MESSAGE", payload);
    },
  },
  modules: {},
  getters: {
    getUser: (state) => state.user,
  },
});
