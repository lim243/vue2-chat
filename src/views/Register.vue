<template>
  <div class="container">
    <div class="card register">
      <div class="card-body">
        <h2 class="card-title text-center">Create a new account</h2>
        <form @submit.prevent="signUpWithEmailAndPassword" class="text-center">
          <div class="form-group">
            <div class="mb-3 row">
              <label for="name" class="col-sm-2 col-form-label">Display Name</label>
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="Please enter your name ..."
                  v-model="name"
                  required
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="email" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  placeholder="Please enter your email ..."
                  v-model="email"
                  required
                  autocomplete="username"
                />
              </div>
            </div>
            <div class="mb-3 row">
              <label for="password" class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  autocomplete="current-password"
                />
              </div>
            </div>
            <p v-if="errorText" class="text-danger">{{ errorText }}</p>
          </div>
          <button type="submit" class="btn btn-primary">Register Account</button>
        </form>
      </div>
    </div>
    <button class="btn btn-danger third-party-btn" @click="googleSignIn">
      Sign Up With Google
    </button>
    <button class="btn btn-dark third-party-btn" @click="githubSignIn">
      Sign Up With Github
    </button>
  </div>
</template>

<script>
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/db";
export default {
  name: "register",
  data() {
    return {
      name: null,
      email: null,
      password: null,
      errorText: null,
    };
  },
  methods: {
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
    githubSignIn() {
      const auth = getAuth();
      const provider = new GithubAuthProvider();

      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Github Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;

          // The signed-in user info.
          const user = result.user;
          console.log("user", user);

          // Add to DB
          const userData = user.providerData[0];
          setDoc(doc(db, "users", user.uid), userData);

          this.$store.dispatch("setUser", user);
          this.$router.push({
            name: "Profile",
          });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;

          // The email of the user's account used.
          const email = error.email;
          // The AuthCredential type that was used.
          const credential = GithubAuthProvider.credentialFromError(error);
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
    signUpWithEmailAndPassword() {
      const auth = getAuth();

      if (this.email && this.password && this.name) {
        createUserWithEmailAndPassword(auth, this.email, this.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            updateProfile(user, {
              displayName: this.name,
              photoURL: `https://avatars.dicebear.com/api/adventurer/${this.name}.svg`,
            });

            // Save to users collection
            const userData = {
              displayName: this.name,
              email: this.email,
              phoneNumber: null,
              photoURL: `https://avatars.dicebear.com/api/adventurer/${this.name}.svg`,
              providerId: "password",
              uid: user.uid,
            };
            // Add to DB
            setDoc(doc(db, "users", user.uid), userData);

            this.$store.dispatch("setUser", user);
            this.$router.push({
              name: "Profile",
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("errorCode, errorMessage", errorCode, errorMessage);
            this.errorText = error.message;
            // ..
          });
      } else {
        this.errorText =
          "There is an error registering your account, make sure you have filled out all required fields.";
      }
    },
  },
};
</script>

<style>
.register {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.third-party-btn {
  margin-top: 0.5rem;
  display: block;
  width: 100%;
}
</style>
