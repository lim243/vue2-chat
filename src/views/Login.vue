<template>
  <section class="vh-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center form-bg-image" id="image-background">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <div
            class="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500"
          >
            <div class="text-center text-md-center mt-md-0">
              <h1 class="mb-0 h3">
                Epik Chat - Sign IN
              </h1>
              <br />
            </div>
            <br />
            <!-- Start form -->
            <form @submit.prevent="login">
              <div class="form-group">
                <label for="email" class="col-form-label">Email</label>
                <div class="input-group">
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
              <div class="form-group mb-4">
                <label for="password" class="col-sm-2 col-form-label">Password</label>
                <div class="input-group">
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
              <div class="d-grid">
                <button type="submit" name="login" class="btn bg-dark text-white">
                  Sign IN
                </button>
              </div>
            </form>
            <!-- End form -->

            <br />
            <div class="d-flex justify-content-center align-items-center mt-4">
              <span class="fw-normal">
                Not registered?
                <a href="/register" class="fw-bold">Create account</a>
              </span>
            </div>

            <!-- 3rd party -->
            <hr />
            <p>
              Sign in with Third-party Authentication
            </p>
            <div class="row gap-2">
              <button
                @click="googleSignIn"
                name="google"
                class="col btn bg-danger text-white"
              >
                Google
              </button>
              <button
                @click="githubSignIn"
                name="github"
                class="col btn bg-dark text-white"
              >
                Github
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "@/firebase/db";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "login",
  data() {
    return {
      email: null,
      password: null,
      errorText: null,
    };
  },
  methods: {
    login() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.$store.dispatch("setUser", user);
          this.$router.push({
            name: "Profile",
          });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.errorText = errorCode + errorMessage;
        });
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
  },
};
</script>

<style>
.login {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
}

.third-party-btn {
  margin-top: 0.5rem;
  display: block;
  width: 100%;
}

#image-background {
  background-image: url("../assets/signin.svg");
  background-repeat: no-repeat !important;
  background-position: top center !important;
  min-height: 500px;
}

.fmxw-500 {
  max-width: 500px !important;
}
</style>
