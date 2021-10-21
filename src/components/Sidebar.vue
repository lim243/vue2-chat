<template>
  <div class="col-12 col-lg-5 col-xl-3 border-end">
    <div class="px-4 d-none d-md-block">
      <h2>Rooms</h2>
      <div class="d-flex align-items-center">
        <div class="flex-grow-1">
          <Dropdown
            name="users"
            :options="this.searchOptions"
            v-on:filter="onSearchChange"
            v-on:selected="validateSelection"
            :disabled="false"
            :maxItem="10"
            placeholder="Please select an option"
          >
          </Dropdown>
        </div>

        <button class="btn btn-light" @click="showAddRoom">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-plus"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
            />
          </svg>
        </button>
        <span v-show="this.showPopup">
          <Popup :toggleShow="showAddRoom" />
        </span>
      </div>
    </div>

    <!-- Rooms -->
    <RoomList />

    <hr class="d-block d-lg-none mt-1 mb-0" />
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown.vue";
import Popup from "@/components/Popup.vue";
import RoomList from "@/components/RoomList.vue";
import { mapState } from "vuex";
import algoliasearch from "algoliasearch";

const ALGOLIA_APP_ID = process.env.VUE_APP_ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.VUE_APP_ALGOLIA_ADMIN_KEY;
const ALGOLIA_INDEX_NAME = process.env.VUE_APP_ALGOLIA_INDEX_NAME;

export default {
  components: {
    Dropdown,
    Popup,
    RoomList,
  },
  data() {
    return {
      searchOptions: [],
    };
  },

  computed: {
    ...mapState(["user", "showPopup", "rooms"]),
  },
  created() {
    this.client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
    this.index = this.client.initIndex(ALGOLIA_INDEX_NAME);
  },

  methods: {
    mapOptions(options) {
      // const arr = options.map((entry, index) => ({
      //   displayName: entry.displayName,
      //   email: entry.email,
      //   uid: entry.objectID,
      //   phoneNumber: entry.phoneNumber,
      //   photoURL: entry.photoURL,
      //   id: index,
      //   name: entry.displayName,
      // }));

      // Debug purposes only
      const arr = [
        {
          id: 0,
          name: "Andrew T. Lim",
          email: "andrewlamo1997@gmail.com",
          objectID: "7zN4ojm8hRRVtMp4muVVkEYE45v1",
          phoneNumber: null,
          photoURL:
            "https://lh3.googleusercontent.com/a-/AOh14Gi3p3A1VULzI1AwMhbuSki1asF3FkPOmm2vO31OuFk=s96-c",
          providerId: "google.com",
          uid: "104981178449533454466",
        },
      ];

      console.log("options", options, arr);

      return arr;
    },
    onSearchChange(val) {
      // Debug purposes only
      this.searchOptions = this.mapOptions(val);
      // this.index
      //   .search(val)
      //   .then(({ hits }) => {
      //     if (hits.length > 0) {
      //       this.searchOptions = this.mapOptions(hits);
      //       console.log("this.searchOptions", this.searchOptions);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    validateSelection(val) {
      console.log("val", val);
    },
    showAddRoom() {
      this.$store.dispatch("toggleShowPopup");
    },
  },
};
</script>
