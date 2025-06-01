<script setup>
import item from '@/components/fileTree/item.vue';
import { ref,toRaw } from 'vue';
import { defineProps } from 'vue';
const props = defineProps({
    type:String,
})
import {useCounterStore} from '@/stores/tree/tree';
import {useFileTreeStore} from '@/stores/tree/fileTree';

const fileTreeStore = useFileTreeStore()
const levelStore = useCounterStore()
// 访问状态



</script>

<template>
<div class="main">
  <p @click="fileTreeStore.popRouteArr()" class="back">返回上一级</p>
  <item :msg="msg" v-for="(msg,index) in fileTreeStore.routeArr" :key="index"></item>
</div>
</template>


<style scoped>
*{
  white-space: nowrap;
}

.main{
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 5px;
  color: #000;
  font-size: 12px;
  padding-left: 1%;
  font-weight: bolder;
  color: #1f947c;
  cursor: pointer;
}
.main :hover{
  color: #000000;
}

</style>
