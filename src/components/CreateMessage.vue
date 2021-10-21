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
        <button class="btn btn-primary" type="submit" @click="onSendMessage">Send</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
        // TODO: Send to DB
        // const messageRef = collection(db, "message");
        // const chatMessagesRef = collection(messageRef, this.currentRoom.id, "messages");
        // setDoc(doc(chatMessagesRef), docData);

        const payload = {
          sentBy: this.user.uid,
          sentAt: Date.now(),
          messageText: this.message,
        };
        this.$store.dispatch("sendMessage", payload);
        console.log("sendMessage", this.message);
      }
      this.message = null;
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>
