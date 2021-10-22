<template>
  <div class="room-list">
    <div v-for="room in this.rooms" :key="room.id">
      <button
        class="list-group-item list-group-item-action border-bottom"
        v-on:click="changeRoom(room.id)"
      >
        <div class="d-flex align-items-start">
          <div class="flex-grow-1 ml-3 text-start">
            {{ room.name }}
          </div>
        </div>
      </button>
    </div>
  </div>
  <!-- Example -->
  <!-- <a href="#" class="list-group-item list-group-item-action border-0">
      <div class="badge bg-success float-right">2</div>
      <div class="d-flex align-items-start">
        <img
          src="https://bootdey.com/img/Content/avatar/avatar2.png"
          class="rounded-circle mr-1"
          alt="William Harris"
          width="40"
          height="40"
        />
        <div class="flex-grow-1 ml-3">
          William Harris
          <div class="small"><span class="fas fa-circle chat-online"></span> Online</div>
        </div>
      </div>
    </a> -->
</template>

<script>
import { mapState } from "vuex";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/db";

export default {
  data() {
    return {
      unsubRooms: () => {},
    };
  },
  computed: {
    ...mapState(["rooms", "currentRoom"]),
  },
  created() {
    this.mapRooms();
  },
  beforeDestroy() {
    // Stop snapshot listening for rooms
    this.unsub();
  },
  methods: {
    mapRooms() {
      this.$store.dispatch("resetRooms");

      // Subscribe to rooms collection in db
      const q = query(collection(db, "rooms"), orderBy("name"));
      this.unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let room = change.doc.data();

            // Dispatch to vuex store
            this.$store.dispatch("addRoom", room);
          }
        });
      });
    },
    changeRoom(roomId) {
      this.$store.dispatch("setCurrentRoom", roomId);
    },
  },
};
</script>
