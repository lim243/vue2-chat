<template>
  <div class="chat-room">
    <div class="py-2 px-4 border-bottom d-none d-lg-block room-header">
      <div class="d-flex align-items-center py-1">
        <div class="flex-grow-1 pl-3">
          <h2>{{ this.currentRoom.name }}</h2>
        </div>
        <div>
          <!-- Buttons for extra options -->
          <button class="btn btn-light border btn-lg px-3" @click="toggleEditRoom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-more-horizontal feather-lg"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>

          <div v-show="editRoomFlag">
            <button @click="deleteRoom">Delete Room</button>
          </div>

          <Popup type="delete" v-show="this.showDeletePopup" />
        </div>
      </div>
    </div>

    <div
      class="room-content"
      v-chat-scroll="{ always: false, smooth: true }"
      id="chat-background"
    >
      <div
        v-for="message in this.messages"
        :key="message.id"
        class="chat-messages px-2 my-2 overflow-auto "
      >
        <div v-if="message.sentBy.id === user.uid" class="chat-message-right pb-4">
          <div>
            <img
              :src="message.sentBy.photoURL"
              class="rounded-circle mr-1"
              :alt="message.sentBy.displayName"
              width="40"
              height="40"
            />
          </div>
          <div class="mx-2">
            <p class="text-secondary mb-1">
              {{ message.sentBy.displayName }}
            </p>
            <div class="bg-primary text-white rounded py-2 px-3 mr-3 message-body">
              {{ message.messageText }}
            </div>

            <div class="text-black-50 small text-nowrap mt-2">
              {{ message.sentAt | moment }}
            </div>
          </div>
        </div>

        <div v-else class="chat-message-left pb-4 flex-row">
          <div>
            <img
              :src="message.sentBy.photoURL"
              class="rounded-circle mr-1"
              :alt="message.sentBy.displayName"
              width="40"
              height="40"
            />
          </div>
          <div class="mx-2">
            <p class="text-secondary mb-1">
              {{ message.sentBy.displayName }}
            </p>
            <div class="bg-success text-white rounded py-2 px-3 mr-3 message-body">
              {{ message.messageText }}
            </div>

            <div class="text-black-50 small text-nowrap mt-2">
              {{ message.sentAt | moment }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="room-footer">
      <CreateMessage />
    </div>
  </div>
</template>

<script>
import CreateMessage from "@/components/CreateMessage.vue";
import Popup from "@/components/Popup.vue";
import { mapState } from "vuex";
import moment from "moment";
import { collectionGroup, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/db";

export default {
  data() {
    return {
      unsub: () => {},
      localUsers: {},
      editRoomFlag: false,
      showDelete: false,
    };
  },
  filters: {
    moment: function(date) {
      return moment(date).format("M/D, h:mm a");
    },
  },
  watch: {
    currentRoom: function(newRoom) {
      this.$store.dispatch("resetMessages");
      this.unsub();

      this.mapMessages(newRoom.id);
    },
  },
  created() {
    this.mapMessages(this.currentRoom.id);
  },
  components: {
    CreateMessage,
    Popup,
  },
  computed: {
    ...mapState(["user", "rooms", "currentRoom", "messages", "showDeletePopup"]),
  },
  beforeDestroy() {
    this.unsub();
    this.$store.dispatch("resetMessages");
  },
  methods: {
    deleteRoom() {
      this.showDelete = !this.showDelete;
      this.$store.dispatch("toggleShowPopup", "delete");
    },
    toggleEditRoom() {
      this.editRoomFlag = !this.editRoomFlag;
    },
    async mapMessages(roomId) {
      // Subscribe to rooms collection in db
      const q = query(
        collectionGroup(db, "msgs"),
        where("roomId", "==", roomId),
        orderBy("sentAt")
      );

      this.unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let doc = change.doc;
            let message = {
              id: doc.id,
              messageText: doc.data().messageText,
              roomId: doc.data().roomId,
              sentAt: doc.data().sentAt,
              sentBy: doc.data().sentBy,
            };

            // Dispatch to vuex store
            this.$store.dispatch("addMessage", message);
          }
        });
      });
    },
  },
};
</script>

<style>
.chat-room {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chat-online {
  color: #34ce57;
}

.chat-offline {
  color: #e4606d;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  max-height: 800px;
  /* overflow-y: scroll; */
}

.chat-message-left,
.chat-message-right {
  display: flex;
  flex-shrink: 0;
}

.chat-message-left {
  margin-right: auto;
}

.chat-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}
.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
.px-4 {
  padding-right: 1.5rem !important;
  padding-left: 1.5rem !important;
}
.flex-grow-0 {
  flex-grow: 0 !important;
}
.border-top {
  border-top: 1px solid #dee2e6 !important;
}

.room-header {
  flex: 0 1 auto;
}
.room-content {
  flex: 1 1 auto;
  overflow: auto;
}
.room-footer {
  flex: 0 1 40px;
}

#chat-background {
  background-image: url("../assets/imageedit_2_9380702236.png");
  /* background-repeat: no-repeat !important; */
  background-position: top center !important;
}
</style>
