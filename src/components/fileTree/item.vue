<script setup>
import { defineProps } from 'vue';
import { useFileTreeStore } from '@/stores/tree/fileTree';
const fileTreeStore = useFileTreeStore()
const props = defineProps({
    msg:String,
})





</script>

<template>
<div class="main" >
  <p class="body"><p>></p><P class="msg" @click="fileTreeStore.selectRouteArr(msg)" >{{ msg }}</P></p>
</div>
</template>


<style scoped>
*{
  white-space: nowrap;
}

.main{
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  font-weight: bolder;
  padding: 0 !important;
}



.main p{
  width: auto;
  display: flex;
  flex-direction: row;
  padding: 0;
}
.body div{
  margin-right: 5px;
}


.msg{
  color:#1f947c;
}
</style>
