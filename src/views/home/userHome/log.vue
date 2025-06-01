<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/utils/api';
const tableData = ref([])
const getLog = async () => {
  await apiClient.get(`/data/logins`).then(res => {
    tableData.value = res.data.data
  }).catch(err => {
    tableData.value = [
      {
        Email: '暂无数据',
        Time: '暂无数据',
        IP: '暂无数据'
      }
    ]
  })
}



onMounted(async () => {
  await getLog()
})

</script>


<template>
  <div class="main">
    <div class="loginStatue">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="Email" label="邮箱" width="180" />
        <el-table-column prop="LoginIp" label="地址" width="180" />
        <el-table-column prop="LoginTime" label="时间" sortable />
      </el-table>
    </div>
  </div>
</template>


<style scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
}

.loginStatue {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 7% 5%;
}
</style>
