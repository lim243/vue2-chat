import Vue from "vue";
import VueChatScroll from "vue-chat-scroll";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebase/firebaseConfig";

initializeApp(firebaseConfig);

const auth = getAuth();
auth.onAuthStateChanged((user) => {
  store.dispatch("setUser", user);
});

Vue.config.productionTip = false;
Vue.use(VueChatScroll);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
