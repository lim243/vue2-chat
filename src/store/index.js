import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    rooms: [],
    currentRoom: {},
    messages: [],
    showPopup: false,
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
    TOGGLE_SHOW_POPUP(state) {
      state.showPopup = !state.showPopup;
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
    toggleShowPopup(state) {
      state.commit("TOGGLE_SHOW_POPUP");
    },
  },
  modules: {},
  getters: {
    getUser: (state) => state.user,
    getShowPopup: (state) => state.showPopup,
  },
});
