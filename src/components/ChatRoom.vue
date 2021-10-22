<template>
  <div class="chat-room">
    <div class="py-2 px-4 border-bottom d-none d-lg-block room-header">
      <div class="d-flex align-items-center py-1">
        <div class="flex-grow-1 pl-3">
          <h2>{{ this.currentRoom.name }}</h2>
        </div>
        <div>
          <!-- Buttons for extra options -->
          <!-- <button class="btn btn-primary btn-lg mr-1 px-3">
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
                      class="feather feather-phone feather-lg"
                    >
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      ></path>
                    </svg>
                  </button>
                  <button class="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
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
                      class="feather feather-video feather-lg"
                    >
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  </button>
                  <button class="btn btn-light border btn-lg px-3">
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
                  </button> -->
        </div>
      </div>
    </div>

    <div class="room-content" v-chat-scroll="{ always: false, smooth: true }">
      <div
        v-for="message in this.messages"
        :key="message.id"
        class="chat-messages p-4 overflow-auto"
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
          <div class="flex-shrink-1 bg-primary rounded py-2 px-3 mr-3 text-white">
            <div class="font-weight-bold mb-1">{{ message.sentBy.displayName }}</div>
            <div class="text-black-50 small text-nowrap mt-2">
              {{ message.sentAt | moment }}
            </div>
            {{ message.messageText }}
          </div>
        </div>

        <div v-else class="chat-message-left pb-4">
          <div>
            <img
              :src="message.sentBy.photoURL"
              class="rounded-circle mr-1"
              :alt="message.sentBy.displayName"
              width="40"
              height="40"
            />
          </div>
          <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
            <div class="font-weight-bold mb-1">{{ message.sentBy.displayName }}</div>
            <div class="text-black-50 small text-nowrap mt-2">
              {{ message.sentAt | moment }}
            </div>
            {{ message.messageText }}
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
import { mapState } from "vuex";
import moment from "moment";
import { collectionGroup, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/db";

export default {
  data() {
    return {
      unsub: () => {},
      localUsers: {},
    };
  },
  filters: {
    moment: function(date) {
      return moment(date).format("M/D, h:mm a");
    },
  },
  created() {
    this.mapMessages();
  },
  components: {
    CreateMessage,
  },
  computed: {
    ...mapState(["user", "rooms", "currentRoom", "messages"]),
  },
  beforeDestroy() {
    this.unsub();
    this.$store.dispatch("resetMessages");
  },
  methods: {
    async mapMessages() {
      // Subscribe to rooms collection in db
      const q = query(
        collectionGroup(db, "msgs"),
        where("roomId", "==", this.currentRoom.id)
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
      console.log("messages", this.messages);
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
</style>
