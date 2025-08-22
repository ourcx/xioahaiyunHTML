<template>
  <div class="membership-selector">
    <el-radio-group v-model="activeIndex" class="plan-group">
      <el-radio-button
        v-for="plan in membershipPlans"
        :key="plan.id"
        :label="plan.id"
        :class="{ 'is-recommended': plan.tag === '推荐' } "
        class="plan-button"
      >
        <div class="plan-content">
          <div class="plan-header">
            <span class="plan-title">{{ plan.title }}</span>
            <span v-if="plan.tag" class="promo-tag">{{ plan.tag }}</span>
          </div>

          <div class="plan-price">
            <span class="price-value">{{ plan.price }}</span>
            <span class="price-unit">{{ plan.priceUnit }}</span>
          </div>

          <el-divider />

          <div v-if="activeIndex === plan.id" class="selected-checkmark">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l210.816 210.816a32 32 0 0 0 45.248 0l421.632-421.632a32 32 0 1 0-45.248-45.248L406.656 706.944z"></path></svg>
          </div>
        </div>
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ElDivider } from 'element-plus'; // 按需引入类型

interface MembershipPlan {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  tag?: string;
}

const membershipPlans = ref<MembershipPlan[]>([
  // ... (数据保持不变)
  { id: "1", title: "月度会员", price: 25, priceUnit: "元/月",tag: "热门", },
  { id: "2", title: "季度会员", price: 68, priceUnit: "元/季",  },
  { id: "3", title: "年度会员", price: 263, priceUnit: "元/年", tag: "推荐", },
  { id: "4", title: "连续包月", price: 18, priceUnit: "元/首月",  },
]);

const activeIndex = ref<string>(membershipPlans.value[2].id); // 默认选中“推荐”套餐
const selectedPlan = ref<MembershipPlan | undefined>();

// 3. 使用 watch 监听 activeIndex 的变化，逻辑更清晰
watch(
  activeIndex,
  (newId) => {
    selectedPlan.value = membershipPlans.value.find((plan) => plan.id === newId);
    console.log("当前选中的套餐是:", selectedPlan.value);
  },
  { immediate: true } // immediate: true 确保组件加载时就执行一次，初始化 selectedPlan
);
</script>

<style scoped lang="scss">
// 定义主题色和变量
$primary-color: #27ba9b;
$recommend-color: #e6a23c;
$text-primary: #303133;
$text-secondary: #606266;
$text-light: #909399;
$border-color: #dcdfe6;
$card-bg: #ffffff;
$container-bg: #f9fafb;

.membership-selector {
  padding: 30px;
  background-color: $container-bg;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
  height: 100%;
}

.plan-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap; // 允许换行

  // :deep() 穿透作用域，修改 el-radio-button 的样式
  :deep(.el-radio-button) {
    // 重置 el-radio-button 的默认样式
    & .el-radio-button__inner {
      padding: 0;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    // 去掉 el-radio-button 之间的左边框
    & + .el-radio-button {
      .el-radio-button__inner {
        border-left: none;
      }
    }
  }
}

.plan-button{
  display: flex;
  gap: 20px;
  flex-wrap: wrap; // 允许换行
}

.plan-content {
  width: 100%;
  min-width: 180px; // 设置最小宽度，防止内容过少时按钮过小
  background: $card-bg;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  border: 2px solid transparent; // 预留边框位置，避免选中时跳动
  transition: all 0.3s ease;
  position: relative;
  text-align: left; // 内容左对齐
}

// 选中状态
:deep(.el-radio-button.is-active .plan-content) {
  border-color: $primary-color;
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(64, 158, 255, 0.2);
}

// 推荐套餐的特殊样式
:deep(.el-radio-button.is-recommended .plan-content) {
  border-color: $recommend-color;
}
:deep(.el-radio-button.is-recommended.is-active .plan-content) {
  box-shadow: 0 10px 20px rgba(230, 162, 60, 0.2);
}


.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
}

.promo-tag {
  padding: 2px 8px;
  font-size: 12px;
  color: white;
  border-radius: 6px;
  background-color: $recommend-color;

  // “热门”标签用主色
  .el-radio-button:not(.is-recommended) & {
      background-color: #f56c6c;
  }
}

.plan-price {
  margin-bottom: 16px;
  .price-value {
    font-size: 38px;
    font-weight: bold;
    color: $text-primary;
  }
  .price-unit {
    font-size: 14px;
    color: $text-secondary;
    margin-left: 4px;
  }
}

// Element Plus 分割线样式
.el-divider {
  margin: 16px 0;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  color: $text-secondary;

  li {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .feature-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: $primary-color;
  }
}

.selected-checkmark {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 32px;
  height: 32px;
  background: $primary-color;
  border-radius: 0 12px 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
}
</style>
