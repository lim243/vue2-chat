<template>
  <div class="create-message flex-grow-0 py-3 px-4 border-top">
    <form class="inline" @submit.prevent="onSendMessage">
      <div class="input-group">
        <input
          v-model="message"
          type="text"
          class="form-control"
          placeholder="Type your message"
        />
        <button class="btn btn-primary" type="submit">Send</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/db";

export default {
  data() {
    return {
      message: null,
    };
  },
  methods: {
    onSendMessage() {
      if (this.message) {
        // Send message to store and update db
        const newMsg = {
          sentBy: this.user.uid,
          sentAt: Date.now(),
          messageText: this.message,
        };

        // Write to DB: messages/{roomId}/messages/{msgId}
        addDoc(collection(db, "messages", this.currentRoom.id, "messages"), newMsg);

        updateDoc(doc(db, "rooms", this.currentRoom.id), {
          recentMessage: newMsg,
        });

        this.$store.dispatch("sendMessage", newMsg);
        console.log("sendMessage", newMsg);
      }
      this.message = null;
    },
  },
  computed: {
    ...mapState(["user", "currentRoom"]),
  },
};
</script>
