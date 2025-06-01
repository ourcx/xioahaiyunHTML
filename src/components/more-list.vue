<script setup>


// 定义 props 类型 (TypeScript 可选)
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  list:{
    type: Array,
    required: true
  },
  callback: {
    type: Function,
    required: true,
    default: () => {}
  }
})

const handleClick = () => {
  // 调用父组件传入的回调函数
  props.callback({ action: '按钮被点击' })
}
</script>

<template>
  <div class="row-send">
    <h3>{{ props.title }}</h3>
    <div class="item-send">
      <div class="item"  v-for="(item, index) in props.list">
        <el-image src="https://staticsns.cdn.bcebos.com/amis/2022-11/1668498989027/collect.jpg"></el-image>
        <div class="item-text">
          <p>{{ item }}</p>
        </div>
      </div>
    </div>
  </div>


</template>


<style scoped>
.row-send{
  width: 100%;
  min-height: 15%; /* 可选的最小高度 */
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px 5px;
  color: black;
}

.item-send{
  width: 100%;
  flex-wrap: wrap; /* 关键属性：允许换行 */
  align-content: flex-start; /* 控制换行后的对齐 */
  display: flex;
  flex-direction: row;
  justify-content:stretch;
  gap: 20px;
  padding: 15px 5px;
}

.item{
  height: 80px;
  background-color: rgb(255, 255, 255);
  width: 28%;
  display: flex;
  flex-direction:row;
  justify-content: center;
  padding: 10px;
  border-radius: 10px;
}

.item-text{
  padding-left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 70%;
  height: 100%;
}
.item-text p{
  font-size: 16px;
  color: black;
}

</style>
