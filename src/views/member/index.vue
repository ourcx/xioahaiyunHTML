<template>
  <teleport to="body">
    <div class="app-container">
      <div class="member-container">
        <MemberTitle />
        <el-divider>
          <el-icon><star-filled /></el-icon>
        </el-divider>
        <MemberSelect />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import MemberTitle from "@/components/member/MemberTitle.vue";
import MemberSelect from "@/components/member/MemberSelect.vue";
</script>

<style lang="scss" scoped>
.app-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    to top right,
    rgba(127, 255, 212),
    rgba(255, 192, 203, 0.5)
  );
  z-index: 9999;

  .member-container {
    width: 60%;
    height: 80%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1000;
    padding: 20px;
    box-sizing: border-box;
    gap: 5px;
  }
}
</style>
