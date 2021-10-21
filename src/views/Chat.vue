<template>
  <div class="content">
    <div class="container">
      <div class="card">
        <div class="row">
          <!-- Sidebar -->
          <Sidebar />

          <!-- Main message area -->
          <ChatRoom />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatRoom from "@/components/ChatRoom.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    ChatRoom,
    Sidebar,
  },
};
</script>

<style>
.content {
  height: 100%;
  width: 100%;
}

body {
  margin-top: 20px;
}
</style>

<div></div>
