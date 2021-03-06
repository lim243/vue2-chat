import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    rooms: [],
    currentRoom: null,
    messages: [],
    showAddPopup: false,
    showDeletePopup: false,
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
    DELETE_ROOM(state, value) {
      // state.rooms.
      //find room by id and pop it
      const index = state.rooms.findIndex((ele) => ele.id === value.id);
      state.rooms.splice(index, 1);
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
    TOGGLE_SHOW_POPUP(state, type) {
      if (type === "add") {
        state.showAddPopup = !state.showAddPopup;
      } else if (type === "delete") {
        state.showDeletePopup = !state.showDeletePopup;
      }
    },
    UPDATE_CHAT_USER_PROFILE(state) {
      state.messages;
    },
    GO_NEXT_ROOM(state) {
      if (state.rooms.length > 0) {
        state.currentRoom = state.rooms[0];
      } else {
        state.currentRoom = null;
      }
    },
    UPDATE_RECENT_MESSAGE(state, room) {
      // find room by id, then change the room in array
      const foundIndex = state.rooms.findIndex((ele) => ele.id == room.id);
      if (foundIndex !== -1) {
        Vue.set(state.rooms[foundIndex], "recentMessage", room.recentMessage);
      }
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
    deleteRoom(state, payload) {
      state.commit("DELETE_ROOM", payload);
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
    getNextRoom(state, prev) {
      state.commit("GO_NEXT_ROOM", prev);
    },
    setCurrentRoom(state, roomId) {
      state.commit("SET_CURRENT_ROOM", roomId);
    },
    sendMessage(state, payload) {
      state.commit("SEND_MESSAGE", payload);
    },
    toggleShowPopup(state, type) {
      state.commit("TOGGLE_SHOW_POPUP", type);
    },
    updateChatUserProfile(state, payload) {
      state.commit("UPDATE_CHAT_USER_PROFILE", payload);
    },
    updateRecentMessage(state, payload) {
      state.commit("UPDATE_RECENT_MESSAGE", payload);
    },
  },
  modules: {},
  getters: {
    getUser: (state) => state.user,
    getRooms: (state) => state.rooms,
    getMessages: (state) => state.messages,
    getCurrentRoom: (state) => state.currentRoom,
    getShowAddPopup: (state) => state.showAddPopup,
    getShowDeletePopup: (state) => state.showDeletePopup,
  },
});
