<script setup>
import user from './user.vue';
import { useMasterPinia } from "@/stores/masterPinia"
import { ref } from "vue";

const MasterPinia = useMasterPinia();
const hand = ref(false)
const advice = ref(false)
</script>



<template>
  <el-header height="60px">
    <el-popover :width="400">
      <template #reference>
        <el-avatar :src="MasterPinia.avatar" class="header-button-avatar" />
      </template>
      <template #default>
        <user />
      </template>
    </el-popover>
    <el-button type="primary" round class="header-button-create">创建企业/团队</el-button>
    <el-button round class="header-button-create">会员中心</el-button>
    <div class="list">
      <el-button type="info" circle class="header-button-sort"><el-icon style="color: #27ba9b;">
          <Sort />
        </el-icon></el-button>
      <el-dropdown>
        <el-button type="info" circle class="header-button-sort"><el-icon style="color: #27ba9b;">
            <MoreFilled />
          </el-icon></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>帮助和反馈</el-dropdown-item>
            <el-dropdown-item>产品建议</el-dropdown-item>
            <el-dropdown-item @click="hand = true">赞助支持</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
  <el-dialog v-model="hand" title="资金支持" width="500">
    <el-image src="https://s2.loli.net/2025/05/31/Fx3ADLjtBOTzRWo.jpg"></el-image>
  </el-dialog>
  <el-dialog v-model="advice" title="资金支持" width="500">
    
  </el-dialog>
</template>

<style scoped>
.header-button-avatar {
  width: 50px;
  height: 40px;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  position: fixed;
  width: 100%;
  left: 0px;
  box-shadow: 60px 0 20px rgba(150, 150, 150, 0.5);
  z-index: 1008;
  background-color: #ffffff;
}

.list {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  gap: 10px;
}

.header-button-sort {
  float: right;
}
</style>
