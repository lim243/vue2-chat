<template>
  <div class="create-message flex-grow-0 py-3 px-4 border-top">
    <form class="inline" @submit.prevent="onSendMessage">
      <div class="input-group">
        <twemoji-picker
          :emojiData="emojiDataAll"
          :emojiGroups="emojiGroups"
          :skinsSelection="false"
          :searchEmojisFeat="true"
          searchEmojiPlaceholder="Search here."
          searchEmojiNotFound="Emojis not found."
          isLoadingLabel="Loading..."
          @emojiUnicodeAdded="onSelectEmoji"
        />
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
import { TwemojiPicker } from "@kevinfaguiar/vue-twemoji-picker";
import EmojiAllData from "@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json";
import EmojiGroups from "@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json";

export default {
  data() {
    return {
      message: "",
      showEmoji: false,
    };
  },
  components: {
    "twemoji-picker": TwemojiPicker,
  },
  methods: {
    onSelectEmoji(emoji) {
      console.log(emoji);
      this.message += emoji;
    },
    onSendMessage() {
      if (this.message) {
        // Send message to store and update db
        const newMsg = {
          sentBy: {
            id: this.user.uid,
            displayName: this.user.displayName,
            photoURL: this.user.photoURL,
          },

          sentAt: Date.now(),
          messageText: this.message,
          roomId: this.currentRoom.id,
        };

        // Write to DB: messages/{roomId}/messages/{msgId}
        addDoc(collection(db, "messages", this.currentRoom.id, "msgs"), newMsg);

        updateDoc(doc(db, "rooms", this.currentRoom.id), {
          recentMessage: newMsg,
        });

        // this.$store.dispatch("sendMessage", newMsg);
        console.log("sendMessage", newMsg);
      }
      this.message = "";
    },
  },
  computed: {
    ...mapState(["user", "currentRoom"]),
    emojiDataAll() {
      return EmojiAllData;
    },
    emojiGroups() {
      return EmojiGroups;
    },
  },
};
</script>
