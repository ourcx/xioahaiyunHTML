<script setup>
import { defineProps, ref,toRefs,watch } from 'vue';
// 1. 导入组件（注意使用变量接收）
import Conversation from '@/router/conversation/conversation.vue'
import ConversationMe from '@/router/conversation/conversationme.vue'


const props = defineProps({
  dataCon: Array,
  dataMy: Array
})

const { dataCon, dataMy } = toRefs(props)
const sortedData = ref([])

function timeToSeconds(timeStr) {
  // 检查是否是日期时间格式（含 '/' 和空格）
  if (/\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/.test(timeStr)) {
    // 解析日期时间部分
    const [datePart, timePart] = timeStr.split(' ');
    const [year, month, day] = datePart.split('/').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);

    // 创建 Date 对象（UTC 时间）
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    // 返回 UNIX 时间戳（秒）
    return Math.floor(date.getTime() / 1000);
  } else {
    // 处理持续时间格式（原逻辑）
    const [dayPart, timePart = ''] = timeStr.split('d');
    let days = 0;
    let remainingTime = timeStr;

    // 提取天数
    if (timePart) {
      days = parseInt(dayPart, 10) || 0;
      remainingTime = timePart;
    }

    // 提取小时、分钟、秒
    const timeComponents = remainingTime.split(':').map(Number);
    const h = timeComponents[0] || 0;
    const m = timeComponents[1] || 0;
    const s = timeComponents[2] || 0;

    // 计算总秒数
    return days * 86400 + h * 3600 + m * 60 + s;
  }
}

watch([dataCon, dataMy], ([con, my]) => {
  console.log(dataCon, dataMy)
  const merged = [
    ...(con?.map(item => ({
      ...item,
      status: 'other',
      timestamp: timeToSeconds(item.time)
    }) || [])),
    ...(my?.map(item => ({
      ...item,
      status: 'my',
      timestamp: timeToSeconds(item.time)
    }) || []))
  ].sort((a, b) => a.timestamp - b.timestamp)

  console.log(merged)


  sortedData.value = merged



}, { immediate: true, deep: true })


</script>


<template>
 <!-- 2. 使用组件对象而非字符串 -->
 <template v-for="item in sortedData" :key="item.id">
    <component
      :is="item.status === 'my' ? ConversationMe : Conversation"
      :data="item"
      style="  transition: transform 0.3s ease;"
    />
  </template>
</template>


<style scoped>

</style>
