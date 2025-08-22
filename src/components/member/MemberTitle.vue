<template>
  <div class="member-card">
    <div class="user-info">
      <el-avatar :size="30" :src="MasterPinia.avatar" />
      <div class="user-details">
        <div class="vip-status">
          <p class="signature">Hi, {{ MasterPinia.name }}</p>
          <div class="vip-badge">SVIP6</div>
          <div class="time-line">
            <!-- <div class="progress"></div> -->
            <!-- 时间 -->
            2023-10-01 至 2024-10-01
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <div class="action-btn">兑换码</div>
      <div class="action-btn">自动续费</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMasterPinia } from "@/stores/masterPinia";

const MasterPinia = useMasterPinia();
</script>

<style scoped lang="scss">
// 定义一些变量，方便后续统一修改和维护
$primary-color: #27ba9b;
$gold-gradient: linear-gradient(45deg, #f0c78a, #d8a050);
$card-bg: #ffffff;
$text-primary: #303133;
$text-secondary: #909399;
$border-color: #e4e7ed;

.member-card {
  display: flex;
  align-items: center;
  justify-content: space-between; // 两端对齐，中间留空
  background: $card-bg;
  border-radius: 12px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
  overflow: hidden;
  position: relative;
  min-height: 8%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px; // 使用 gap 属性创建间距

  .user-details {
    display: flex;
    flex-direction: column;
  }
}

.vip-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;

  .signature {
    font-size: 18px;
    width: 100%;
    color: $text-primary;
    margin: 0;
    // 禁止换行，换行就省略
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1; // 让签名占据剩余空间
  }

  .vip-badge {
    padding: 4px 12px;
    background: $gold-gradient;
    color: white;
    border-radius: 15px;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0; // 防止被压缩
  }

  .time-line {
    width: 100%;
    font-size: small;
    font-weight: lighter;
    color: $text-secondary;
    // background-color: $border-color;
    // border-radius: 3px;
    // overflow: hidden;

    // .progress {
    //   width: 75%; // VIP 进度，可以由 props 动态传入
    //   height: 100%;
    //   background: $gold-gradient;
    //   border-radius: 3px;
    // }
  }
}

.actions {
  display: flex;
  gap: 10px;

  .action-btn {
    padding: 8px 20px;
    border: 1px solid $border-color;
    border-radius: 20px;
    font-size: 14px;
    color: $text-secondary;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      color: $primary-color;
      border-color: $primary-color;
      background-color: #ecf5ff;
    }

    // 第二个按钮样式可以特殊化
    &:last-child {
      color: $primary-color;
      border-color: #d9ecff;
      background-color: #ecf5ff;

      &:hover {
        background-color: $primary-color;
        color: white;
        border-color: $primary-color;
      }
    }
  }
}
</style>
