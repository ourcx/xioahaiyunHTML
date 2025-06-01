<script setup>
import { ref, toRaw, toRefs, watch, computed, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router';
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router';
import { useManagementStore } from '@/stores/management';
import { useChatStore } from '@/stores/chat';
import { getCurrentInstance } from 'vue';
import { useMasterPinia } from '@/stores/masterPinia';
import { useNewMessageStore } from '@/stores/newmessage';
import item from '@/components/fileTree/item.vue';
import apiClient from '@/utils/api';


const NewMessageStore = useNewMessageStore();
const MasterPinia = useMasterPinia();
const instance = getCurrentInstance();
const ManagementStore = useManagementStore();
const ChatStore = useChatStore();
const dataList = ManagementStore.dataListSide


const router = useRouter();
const route = useRoute();
const routeId = ref('');
const flooter = ref('');
const contents = ref(null);
const dialogVisible = ref(false);
const centerDialogVisible = ref(false);
const activeNames = ref([]);
const input = ref('');
const count = ref([]);
const searchData = ref('')
const handleChange = (val) => {
  console.log(val)
}

// const contents = ref(null);
const openWindow = (item) => {
  if (toRaw(item).group) {
    router.push({
      path: '/conversation/person/group',
      query: {
        name: item.name,
        group: item.id,
      }
    })
    routeId.value = item.id
    // const chatStore = useChatStore();

    ManagementStore.clickSendData(item)
    //更新得到你点击了哪个用户X
    return
  }
  router.push({
    path: '/conversation/person/window',
    query: {
      name: item.name,
      id: item.id,
    },
  })
  routeId.value = item.id
  // const chatStore = useChatStore();
  NewMessageStore.re(item.id)
  ManagementStore.clickSendData(item)
  //更新得到你点击了哪个用户
}

// 获取最新消息的公共逻辑
const getLatestMessage = (itemA, itemB) => {
  if (!itemA && !itemB) return { message: '暂无消息', time: '' };
  if (!itemA) return itemB;
  if (!itemB) return itemA;
  // 确保时间字段为数字（如时间戳）或可比较的字符串（如ISO格式）
  return itemA.time >= itemB.time ? itemA : itemB;
};

//根据id值取得最后一个聊天内容，显示在列表
const getLastChatContent = (id) => {
  // 统一读取和校验数据
  const readAndValidateData = (key) => {
    const raw = localStorage.getItem(`${id}${key}`);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) && data.length > 0 ? data : null;
    } catch {
      return null;
    }
  };

  const myData = readAndValidateData('my');
  const conData = readAndValidateData('con');

  // 获取两个数据集的最后一条消息
  const lastMy = myData?.[myData.length - 1];
  const lastCon = conData?.[conData.length - 1];

  const lastMessage = getLatestMessage(lastMy, lastCon)
  ManagementStore.changeTime(id, lastMessage.time)
  return lastMessage.message;
};

watch(
  // 修正监听对象（原代码重复监听了 privateMy）
  () => [ChatStore.privateMy, ChatStore.privateCon],
  ([myList, conList]) => {
    const currentId = router.currentRoute.value.query.id;
    if (!currentId) return;

    const dom = contents.value.find(item => item.id === currentId);
    if (!dom) return;

    // 获取最后一条消息
    const lastMy = myList?.[myList.length - 1];
    const lastCon = conList?.[conList.length - 1];
    const latestMessage = getLatestMessage(
      lastMy ? toRaw(lastMy) : null,
      lastCon ? toRaw(lastCon) : null
    );

    // 更新 UI
    if (latestMessage.message !== '暂无消息') {
      flooter.value = latestMessage.message;
      dom.innerText = latestMessage.message;
      ManagementStore.changeTime(currentId, latestMessage.time)
    }
  },
  { deep: true }
);

watch(
  // 修正监听对象（原代码重复监听了 dataMy）
  () => [ChatStore.dataMy, ChatStore.dataCon],
  ([myList, conList]) => {
    const currentId = router.currentRoute.value.query.group;
    if (!currentId) return;

    const dom = contents.value.find(item => item.id === currentId);
    if (!dom) return;

    // 获取最后一条消息
    const lastMy = myList?.[myList.length - 1];
    const lastCon = conList?.[conList.length - 1];
    const latestMessage = getLatestMessage(
      lastMy ? toRaw(lastMy) : null,
      lastCon ? toRaw(lastCon) : null
    );

    // 更新 UI
    if (latestMessage.message !== '暂无消息') {
      flooter.value = latestMessage.message;
      dom.innerText = latestMessage.message;
      ManagementStore.changeTime(currentId, latestMessage.time)
    }
  },
  { deep: true }
);

//未读消息的处理
const unreadMessages = () => {
  NewMessageStore.unread.forEach(item => {
    count.value.push(item)
  });
}

const getUnreadCount = (id) => {
  const chat = count.value.find(item => item.id === id)
  return chat?.unreadCount
}

//关于ws的开关问题
onMounted(() => {
  unreadMessages()
})



const search = async () => {
  if (input.value.trim() === '') {
    return;
  }
  await apiClient.post('/profiles/search', {
    email: input.value.trim()
  })
    .then((res) => {
      if (res.data.code === 200) {
        // 处理搜索结果
        console.log(res.data.data)
        searchData.value = { ...res.data.data, email: input.value.trim() };
      } else {
        searchData.value = { AvatarUrl: '空', Signature: '未找到相关用户' };
      }
    }).catch((error) => {
      searchData.value = { AvatarUrl: '空', Signature: '未找到相关用户' };
    });
};



//添加好友
const addFreiend = async (email) => {
  if (!email) {
    return;
  }
  await apiClient.post('/profiles/relationApply', {
    email: email
  })
    .then((res) => {
      if (res.data.code === 200) {
        // 添加成功
        ManagementStore.addFriend(res.data.data);
        centerDialogVisible.value = false;
        input.value = '';
        searchData.value =  { AvatarUrl: '成功', Signature:"已成功添加对方" };
      } else {
        // 添加失败
        searchData.value = { AvatarUrl: '空', Signature: res.data.message || '添加失败，请稍后再试' };
      }
    }).catch((error) => {
     searchData.value = { AvatarUrl: '空', Signature: '添加失败，请稍后再试' };
    });
};



</script>


<template>

  <div id="person">
    <div class="button-group-header">
      <el-button-group>
        <el-button type="primary" link @click="centerDialogVisible = true">添加好友/群组<el-icon>
            <User />
          </el-icon></el-button>
        <div class="separator"></div>
        <el-button type="primary" link @click="dialogVisible = true">创建群组<el-icon>
            <OfficeBuilding />
          </el-icon></el-button>
      </el-button-group>
    </div>
    <div class="person-group">
      <div class="person-item" v-for="(item, index) in dataList" :key="index" @click="openWindow(item)">
        <div class="item-avatar"><img :src="item.src"></div>
        <div class="item-connet">
          <div class="connet">
            <div class="name">
              <p class="name-master">{{ item.name }}</p>
              <p class="name-time">{{ item.date }}</p>
            </div>
            <el-badge :value="getUnreadCount(item.id)" class="item" :offset=[-10,14]
              :hidden="getUnreadCount(item.id) === 0">
              <div class="contents">
                <p class="contents-master" ref="contents" :id="item.id">{{ getLastChatContent(item.id) }}</p>
              </div>
            </el-badge>
          </div>
        </div>
      </div>
    </div>
  </div>
  <router-view :key="routeId"></router-view>

  <el-dialog v-model="dialogVisible" title="注意" width="500" draggable>
    <span>创建群组功能暂时未开放</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>


  <el-dialog v-model="centerDialogVisible" title="添加好友/群组" width="500" align-center id="el-dialog">
    <span class="dialog-text">
      <p>输入邮箱</p>
      <div class="input-search">
        <el-input v-model="input" style="width: 90%;border: 0px solid white !important;" placeholder="搜索联系人" clearable
          class="custom-search">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
          <template #suffix>
            <div class="suffix"></div>
            <span class="suffix-inner" @click="search">搜索</span>
          </template>
        </el-input>
      </div>
    </span>
    <template #footer>
      <div class="dialog-footer">
        <el-collapse v-model="activeNames" @change="handleChange" class="custom-collapse" v-if="!searchData">
          <el-collapse-item name="1">
            <template #title>
              <p>分享我的账号</p>
            </template>
            <div class="raw-content">
              分享我的「二维码」或「盘口令」，让TA快速加我为好友
            </div>
            <div class="content">
              <div class="avatar-name">
                <div class="avatar">
                  <el-avatar :src="MasterPinia.avatar"> user </el-avatar>
                </div>
                <div class="connet">
                  <div class="name">
                    <p class="name-master">{{ MasterPinia.name }}</p>
                  </div>
                  <div class="contents">
                    <p class="contents-master">{{ MasterPinia.signature }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <el-button-group class="ml-4">
                <el-button type="primary" link class="ml-4"><el-icon>
                    <Link />
                  </el-icon>复制盘口令</el-button>
                <div class="separator"></div>
                <el-button type="primary" link class="ml-4"><el-icon>
                    <FullScreen />
                  </el-icon>分享二维码</el-button>
              </el-button-group>
            </div>
          </el-collapse-item>
        </el-collapse>

        <el-card class="friend-card" shadow="hover" v-if="searchData">
          <el-row :gutter="16" align="middle">
            <!-- 头像 -->
            <el-col :span="4">
              <el-avatar :size="64" :src="searchData.AvatarUrl" fit="cover" > {{ searchData.AvatarUrl }}</el-avatar>
            </el-col>

            <!-- 主体内容 -->
            <el-col :span="16">
              <div class="friend-info">
                <div class="friend-name">{{ searchData.Signature }}</div>
                <div class="friend-id">账号:{{ searchData.email }}</div>
              </div>
            </el-col>

            <!-- 操作按钮 -->
            <el-col :span="4">
              <el-button type="primary" size="small" round class="add-btn" @click="addFreiend(searchData.email)">
                添加好友
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </div>

    </template>
  </el-dialog>

</template>


<style scoped>
#person {
  width: 260px;
  height: 100%;
  left: 240px;
  position: fixed;
  border-right: 1px solid rgba(180, 180, 180, 0.5);
}

.button-group-header {
  position: fixed;
  width: 260px;
  height: 60px;
  top: 60px;
  background-color: #fff;
  border-right: 1px solid rgba(180, 180, 180, 0.5);
}

.el-button-group {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

}


.el-button-group button {
  width: 100px;
  height: 100px;
  border: 0;
}

.separator {
  width: 1px;
  height: 30px;
}


.person-group {
  width: 260px;
  height: 100%;
}

.person-item {
  position: relative;
  width: 100%;
  height: 60px;
  top: 120px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  border-right: 1px solid rgba(180, 180, 180, 0.5);
}

.person-item:hover {
  background-color: #f7f9fc;
}

.item-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.item-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.item-connet {
  width: 170px;
  height: 100%;
  display: flex;
}

.connet {
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 5px 0;
}

.name {
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  display: flex;
}

.name-master {
  font-size: 14px;
  color: #000;
  display: block;
  text-overflow: ellipsis;
  /*  */
  white-space: nowrap;
  overflow: hidden;
}

.name-time {
  font-size: 12px;
  margin-left: 6px;
  white-space: nowrap;
  /*  */
  color: #a2abbd;
  display: block;
}

.contents-master {
  min-height: 14.5px;
  font-size: 12px;
  color: #a2abbd;
  text-align: left;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contents {
  margin-top: 5px;
  display: flex;
  align-items: center;
  /*  */
  justify-content: space-between;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#el-dialog {
  border-radius: 20px !important;
}

.dialog-text {
  width: 100%;
  display: flex;
  margin-top: 10px;
  flex-direction: column;

}

.dialog-text p {
  width: 100%;
  margin-left: 5%;
  margin-bottom: 5%;
  margin-top: 1%;
}

.input-search {
  display: inline-block;
  border: 0px solid white !important;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}


.suffix {
  width: 1px;
  background-color: #c4c5c6;
  height: 50%;
  margin-right: 5px;
}

.suffix-inner {
  color: #27ba9b;
}

/* 深度穿透写法 */
:deep(.custom-search .el-input__wrapper) {
  /* 注意 Element Plus v2.x 使用 .el-input__wrapper */
  border-radius: 20px;
  padding: 0 15px;
  transition: all 0.3s;
  background-color: #f1f3f8 !important;
  /* 使用 !important 确保覆盖 */

}

/* 鼠标悬停 */
:deep(.custom-search .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #27ba9b inset;
}

/* 聚焦状态 */
:deep(.custom-search.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #27ba9b inset !important;
  border-radius: 30px !important;
}

.dialog-footer {
  width: 100%;
}

.custom-collapse {
  border: none !important;
  padding: 0;
}

:deep(.el-collapse-item__wrap) {
  border: none !important;
}

:deep(.el-collapse-item__header) {
  border: none !important;
}

.raw-content {
  font-size: smaller;
  text-align: left;
  height: auto;
}

.content {
  display: flex;
  align-items: center;
  justify-self: flex-start;
  margin: 10px 0;
}

.avatar-name {
  display: flex;
  flex-direction: row;
}

.avatar {
  width: auto;
  display: flex;
  align-items: center;
  justify-self: center;
  margin-right: 5%;
}

.ml-4 {
  height: 40px !important;
  display: flex;
  align-items: center;
  bottom: 0;
}

.item {
  width: 100%;
  top: 10%;
}

.friend-card {
  max-width: 480px;
  margin: 16px 0;
  border-radius: 12px;
}

.friend-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-col {
    &:nth-child(1) {
      text-align: center;
    }

    &:nth-child(2) {
      margin: 12px 0;
    }

    &:nth-child(3) {
      display: flex;
      justify-content: center;
    }
  }
}

.friend-name {
  font-size: 18px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 6px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 70%;
}

.friend-id {
  font-size: 13px;
  color: #8a8f99;
}

.add-btn {
  padding: 8px 20px;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }
}
</style>
