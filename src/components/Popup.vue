<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div v-if="type === 'add'" class="modal-container">
          <slot name="modal-title">
            Add New Public Room
          </slot>

          <div class="modal-body">
            <slot name="body">
              <input
                type="text"
                class="form-control"
                v-model="roomName"
                id="addRoomField"
                placeholder="New Room Name"
              />
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-secondary" @click="toggleShowPopup">
                Cancel
              </button>
              <button class="btn btn-primary" @click="okButtonClicked">
                OK
              </button>
            </slot>
          </div>
        </div>

        <div v-if="type === 'delete'" class="modal-container">
          <slot name="modal-title">
            Are you sure you want to delete this room?
          </slot>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-secondary" @click="toggleShowPopup">
                Cancel
              </button>
              <button class="btn btn-danger" @click="okButtonClicked">
                Delete
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/db";
import { mapState } from "vuex";

export default {
  data() {
    return {
      roomName: null,
    };
  },
  name: "Popup",
  template: "Popup",
  props: {
    type: {
      type: String,
      required: true,
      default: "add",
    },
  },
  computed: {
    ...mapState(["user", "showAddPopup", "showDeletePopup", "rooms", "currentRoom"]),
  },

  methods: {
    toggleShowPopup() {
      console.log("this.type", this.type);
      this.$store.dispatch("toggleShowPopup", this.type);
      this.roomName = null;
    },
    okButtonClicked() {
      if (this.type === "add") {
        this.createRoom();
      } else if (this.type === "delete") {
        this.deleteRoom();
      }
    },

    async deleteRoom() {
      console.log("delete this current room!");
      try {
        await deleteDoc(doc(db, "rooms", this.currentRoom.id));
        await deleteDoc(doc(db, "messages", this.currentRoom.id));

        this.$store.dispatch("resetMessages");
        this.$store.dispatch("getNextRoom", this.currentRoom.id);
        this.toggleShowPopup();
      } catch (error) {
        alert(error);
      }
    },
    async createRoom() {
      if (this.roomName) {
        const newRoomRef = await doc(collection(db, "rooms"));

        const roomData = {
          id: newRoomRef.id,
          name: this.roomName,
          createdAt: Date.now(),
          createdBy: this.user.uid,
          members: [this.user.uid],
          type: 1,
          recentMessage: null,
        };

        // Add new room to rooms collection
        await setDoc(newRoomRef, roomData);

        // Add empty messages collection
        const newMsgRef = doc(db, "messages", newRoomRef.id);
        await setDoc(newMsgRef, { roomId: newRoomRef.id });

        // Dispatch to store and update current room
        // this.$store.dispatch("addRoom", roomData);
        this.$store.dispatch("setCurrentRoom", roomData.id);

        this.toggleShowPopup();
      }
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
  border-bottom: none;
}

.modal-body {
  margin: 0;
  border-bottom: none;
}

.modal-footer {
  border-top: 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
