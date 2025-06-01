<script setup>
import { img } from '@/assets/base64/list';
import List from '@/components/more-list.vue';
</script>


<template>
  <div class="content">
    <div class="row-img">
      <div class="row-item">
        <el-image :src="img.change" />
      </div>
      <div class="row-item">
        <el-image :src="img.word" />
      </div>
      <div class="row-item">
        <el-image :src="img.ai" />
      </div>
    </div>
    <List title="文件传输" :list="['收集文件', '扫码传输']" :callback="() => { }" />
    <List title="识别转换" :list="['音视频转文字', '图片压缩', 'PDF转Word', '图片滤镜', '图片转PDF', '图片转Word', '图片转Excel', '文字识别', '试卷去手写']"
      :callback="() => { }" />
    <List title="效率助手" :list="[
      '实时录音',
      '论文查重',
      '线上打印',
      '记事本',
      '印象笔记',
      '橙篇',
      '智能PPT',
      '自由画布'
    ]" :callback="() => { }" />
    <List title="文件管理" :list="[
      '垃圾文件清理',
      '设备管理',
      '导出文件目录'
    ]" :callback="() => { }" />
    <List title="数据备份" :list="[
      '通讯录',
      '短信',
      '通话记录',
      '一刻相册'
    ]" :callback="() => { }" />
    <List title="文件传输" :list="[
      '创建团队',
      '开放平台',
      '网盘认证',
      '企业定制服务',
      '企业AI修图'
    ]" :callback="() => { }" />
  </div>
</template>


<style scoped>
.content {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 15px;
  gap: 10px;
  overflow: hidden;
}

.row-img {
  width: 100%;
  height: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 15px;
  padding: 15px 5px;
}

.row-item {
  width: 100%;
  height: 100%;
}

.el-image {
  width: 100%;
  height: 100%;
}
</style>
