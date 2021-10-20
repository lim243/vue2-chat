<template>
  <div class="container">
    <div class="card login">
      <div class="card-body">
        <h2 class="card-title text-center">Register</h2>
        <form @submit.prevent="login" class="text-center">
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              placeholder="Please enter your name ..."
              name="name"
              v-model="name"
            />
            <p v-if="errorText" class="text-danger">{{ errorText }}</p>
          </div>
          <button type="submit" class="btn btn-primary">Enter Chat</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
  name: "login",
  data() {
    return {
      name: "",
      errorText: null,
    };
  },
  methods: {
    login() {
      if (this.name) {
        this.$router.push({ name: "Chat", params: { name: this.name } });
      } else {
        this.errorText = "Please enter a name first!";
      }
    },
    googleSignIn() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          console.log("user", user);
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;

          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...

          console.log(
            "error in Google Sign In",
            errorCode,
            errorMessage,
            email,
            credential
          );
        });
    },
  },
};
</script>

<style>
.login {
  max-width: 450px;
  margin-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
