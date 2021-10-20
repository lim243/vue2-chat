<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
    <!-- Navbar content -->
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Epik Chat</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link v-show="!this.user" class="nav-link" to="/">Login</router-link>
          </li>
          <li v-show="this.user" class="nav-item">
            <router-link class="nav-link" to="/chat">Chat</router-link>
          </li>
          <li v-show="this.user" class="nav-item">
            <router-link class="nav-link" to="/Profile">Profile</router-link>
          </li>

          <li v-show="this.user" class="nav-item">
            <a @click="signoutButtonPressed">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { mapState } from "vuex";

export default {
  created() {
    getAuth().onAuthStateChanged((user) => {
      this.$store.dispatch("setUser", user);
    });
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    signoutButtonPressed() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.$store.dispatch("signOut");
        this.$router.push({
          name: "Login",
        });
      });
    },
  },
};
</script>
