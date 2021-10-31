<template>
  <div class="room-list">
    <div v-for="room in this.rooms" :key="room.id">
      <button
        class="list-group-item list-group-item-action border-bottom"
        v-on:click="changeRoom(room.id)"
      >
        <div class="d-flex flex-column">
          <div class="d-flex align-items-start">
            <div class="room-title text-start">
              {{ room.name }}
            </div>
            <div v-if="room.recentMessage" class="text-muted">
              <div>
                <span>{{ room.recentMessage.sentAt | moment }}</span>
              </div>
            </div>
          </div>
          <div class="text-start text-muted text-truncate" v-if="room.recentMessage">
            {{ room.recentMessage.messageText }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/db";
import moment from "moment";

export default {
  data() {
    return {
      unsubRooms: () => {},
    };
  },
  filters: {
    moment: function(date) {
      return moment(date).format("h:mma");
    },
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
            this.changeRoom(room.id);
          }
          if (change.type === "removed") {
            let room = change.doc.data();
            // Dispatch to vuex store
            this.$store.dispatch("deleteRoom", room);
          }
          if (change.type === "modified") {
            let room = change.doc.data();
            // Dispatch to vuex store
            this.$store.dispatch("updateRecentMessage", room);
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

<style>
.room-list {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.room-title {
  flex-grow: 4;
}
.preview-message {
  text-overflow: ellipsis;
}
</style>
