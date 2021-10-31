<template>
  <div class="d-flex align-items-start justify-content-center">
    <div class="card w-75">
      <div class="bg-white w-100 rounded border-light p-4 p-lg-5 cover-photo"></div>
      <div class="card-body bg-white d-flex align-items-start justify-content-center">
        <div v-if="user.providerData[0].providerId === 'google.com'">
          <img
            :src="user.photoURL"
            style="width:75px;height:75px;border-radius:50%;border:4px solid #FB5B0D"
          />
          <h4 class="h3">
            {{ user.displayName }}
          </h4>
          <h5 class="font-weight-normal">{{ user.email }}</h5>
          <p class="text-gray mb-4 btn bg-danger text-white">
            GOOGLE
          </p>
        </div>

        <div v-if="user.providerData[0].providerId === 'github.com'">
          <img
            :src="user.photoURL"
            style="width:75px;height:75px;border-radius:50%;border:4px solid #333"
          />
          <h4 class="h3">
            {{ user.displayName }}
          </h4>
          <h5 class="font-weight-normal">{{ user.email }}</h5>
          <p class="text-gray mb-4 btn bg-dark text-white">
            GITHUB
          </p>
        </div>

        <div v-if="user.providerData[0].providerId === 'password'">
          <img
            :src="user.photoURL"
            style="width:75px;height:75px;border-radius:50%;border:4px solid #96D1FF"
          />
          <h4 class="h3">
            {{ user.displayName }}
          </h4>
          <h5 class="font-weight-normal">{{ user.email }}</h5>
          <p class="text-gray mb-4 btn bg-secondary text-white">
            PASSWORD
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "profile",
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style scoped>
.cover-photo {
  background-image: url("../assets/leaves.jpg");
  background-repeat: no-repeat !important;
  background-position: top center !important;
  min-height: 200px;
}
</style>
