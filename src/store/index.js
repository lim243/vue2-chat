import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    rooms: [],
    currentRoom: null,
    messages: [],
    showPopup: false,
  },
  mutations: {
    // Synchonous way to update store
    RESET_ROOMS(state) {
      state.rooms = [];
      state.messages = [];
    },
    RESET_MESSAGES(state) {
      state.messages = [];
    },
    ADD_ROOM(state, value) {
      state.rooms.push(value);
    },
    ADD_MESSAGE(state, value) {
      state.messages.push(value);
    },
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    SEND_MESSAGE(state, payload) {
      state.messages.push(payload);
    },
    SET_CURRENT_ROOM(state, roomId) {
      // Find room in by id
      const foundRoom = state.rooms.find((room) => room.id === roomId);
      state.currentRoom = foundRoom;
    },
    TOGGLE_SHOW_POPUP(state) {
      state.showPopup = !state.showPopup;
    },
    UPDATE_CHAT_USER_PROFILE(state) {
      state.messages;
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
    addRoom(state, payload) {
      state.commit("ADD_ROOM", payload);
    },
    addMessage(state, payload) {
      state.commit("ADD_MESSAGE", payload);
    },
    resetRooms(state) {
      state.commit("RESET_ROOMS");
    },
    resetMessages(state) {
      state.commit("RESET_MESSAGES");
    },
    fetchRooms(state) {
      // Get all corresponding rooms

      console.log("state.rooms", state.rooms);

      // Listen to live updates from database
    },
    setCurrentRoom(state, roomId) {
      state.commit("SET_CURRENT_ROOM", roomId);
    },
    sendMessage(state, payload) {
      state.commit("SEND_MESSAGE", payload);
    },
    toggleShowPopup(state) {
      state.commit("TOGGLE_SHOW_POPUP");
    },
    updateChatUserProfile(state, payload) {
      state.commit("UPDATE_CHAT_USER_PROFILE", payload);
    },
  },
  modules: {},
  getters: {
    getUser: (state) => state.user,
    getRooms: (state) => state.rooms,
    getMessages: (state) => state.messages,
    getCurrentRoom: (state) => state.currentRoom,
    getShowPopup: (state) => state.showPopup,
  },
});
