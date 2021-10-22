<template>
  <div class="content">
    <div class="container">
      <div class="card">
        <div id="chat-main-container" class="row">
          <!-- Sidebar -->
          <Sidebar />

          <!-- Main message area -->
          <div class="col-12 col-lg-7 col-xl-9" style="max-height: 90vh; overflow:hidden">
            <div style="height: 100%" v-if="this.currentRoom">
              <ChatRoom />
            </div>
            <div v-else>
              <div class="py-2 px-4 border-bottom d-none d-lg-block">
                <div class="d-flex align-items-center py-1">
                  <div class="flex-grow-1 pl-3">
                    <h2>[[ Please Select A Room... ]]</h2>
                  </div>
                  <div></div>
                </div>
              </div>

              <div class="position-relative">
                <div class="chat-messages p-4 overflow-auto">
                  <h2>[[ Please Select A Room... ]]</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatRoom from "@/components/ChatRoom.vue";
import Sidebar from "@/components/Sidebar.vue";
import { mapState } from "vuex";

export default {
  components: {
    ChatRoom,
    Sidebar,
  },
  computed: {
    ...mapState(["users", "currentRoom", "rooms"]),
  },
};
</script>

<style>
.content {
  /* height: 100%;
  width: 100%; */
  flex: 1 1 auto;
}

body {
  margin-top: 20px;
}

#chat-main-container {
  height: 90vh;
}
</style>

<div></div>
