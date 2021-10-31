<template>
  <div class="create-message flex-grow-0 py-2 px-2 border-top rounded">
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
          v-model="message_input"
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
      message_input: "",
      showEmoji: false,
    };
  },
  components: {
    "twemoji-picker": TwemojiPicker,
  },
  methods: {
    onSelectEmoji(emoji) {
      this.message_input += emoji;
    },
    onSendMessage() {
      if (this.message_input) {
        // Send message to store and update db
        const newMsg = {
          sentBy: {
            id: this.user.uid,
            displayName: this.user.displayName,
            photoURL: this.user.photoURL,
          },

          sentAt: Date.now(),
          messageText: this.message_input,
          roomId: this.currentRoom.id,
        };

        // Write to DB: messages/{roomId}/messages/{msgId}
        addDoc(collection(db, "messages", this.currentRoom.id, "msgs"), newMsg);

        updateDoc(doc(db, "rooms", this.currentRoom.id), {
          recentMessage: newMsg,
        });
      }
      this.message_input = "";
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
