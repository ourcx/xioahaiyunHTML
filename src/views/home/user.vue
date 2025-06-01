<script setup>
import * as d3 from 'd3'
import { onMounted, ref, onBeforeMount, toRaw } from 'vue'
import axios from 'axios';
import 'animate.css';
import { useRouter } from 'vue-router';
import { useMasterPinia } from "@/stores/masterPinia"
import apiClient from '@/utils/api';
import { useD3Store } from '@/stores/D3/D3data'
const d3Store = useD3Store()
const MasterPinia = useMasterPinia();
const router = useRouter();



const userBody = function () {
  const id = 123;
  const url = router.resolve({ path: `/user/main?${id}` }).href;
  window.open(url, '_blank'); // 在新标签页打开动态路由页面
}
// const route = useRoute();
// const id = route.params.id; // 获取动态路由参数 id


const userExit = function () {
  console.log('退出登录')
  localStorage.removeItem('jwt');
  localStorage.removeItem('email');
  localStorage.removeItem('progreCount');
  localStorage.removeItem('id')
  removeMatchingLocalStorageItems(['con', 'my', 'remark'])
  router.push({
    path: '/login',
  })
}

function removeMatchingLocalStorageItems(suffixes) {
  // 获取localStorage中的所有键
  const keys = Object.keys(localStorage);
  // 过滤出匹配指定后缀的键
  const matchingKeys = keys.filter(key =>
    suffixes.some(suffix => key.endsWith(suffix)))
  // 删除匹配的项
  matchingKeys.forEach(key => localStorage.removeItem(key));
  return {
    removedCount: matchingKeys.length,
    removedKeys: matchingKeys
  };
}

const svgEl = ref(null)

onMounted(async () => {
  // 2. 初始化数据
  // 3. 容器配置
  let dataset = ref([])
  // async function getUersList() {
  //   const response = await apiClient.get(`/data/proportion`);
  //   // 如果请求成功，处理响应数据
  //   return response
  // }

  await d3Store.getUersList().then(response => {
    // const data = response.data
    // const total = parseInt(localStorage.getItem('progreCount')) * 1024 * 1204
    // dataset.value.push(
    //   { name: "文档", value: parseInt(data.doc / total * 100) },
    //   { name: "图片", value: parseInt(data.img / total * 100) },
    //   { name: "视频", value: parseInt(data.video / total * 100) },
    //   { name: "音频", value: parseInt(data.mp3 / total * 100) },
    //   { name: "其他", value: parseInt((1 - data.doc / total - data.img / total - data.video / total - data.mp3 / total) * 100) },
    // )
    dataset.value = d3Store.datas


    const width = 400
    const height = 300
    const radius = Math.min(width, height) / 2 - 40 // 计算半径留出边距

    // 4. 创建SVG基础结构
    const svg = d3.select(svgEl.value)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`) // 将坐标系移到中心

    // 5. 颜色比例尺
    const color = d3.scaleOrdinal()
      .domain(dataset.value.map(d => d.name))
      .range(d3.schemeCategory10) // 使用D3内置颜色方案

    // 6. 饼图生成器
    const pie = d3.pie()
      .value(d => d.value) // 指定数据值访问器
      .sort(null) // 保持数据原始顺序

    // 7. 扇形生成器
    const arc = d3.arc()
      .innerRadius(0) // 实心饼图
      .outerRadius(radius) // 设置外半径

    // 8. 标签位置生成器
    const labelArc = d3.arc()
      .innerRadius(radius * 0.6) // 标签显示在60%半径处
      .outerRadius(radius * 0.6)

    // 9. 绘制扇形
    const arcs = svg.selectAll('.arc')
      .data(pie(dataset.value)) // 转换原始数据为饼图数据
      .enter()
      .append('g')
      .attr('class', 'arc')

    // 10. 绘制扇形路径（带过渡动画）
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name))
      .transition() // 添加入场动画
      .duration(800)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
        return t => arc(interpolate(t))
      })

    // 11. 添加文本标签
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`) // 定位到扇形中心
      .attr('dy', '0.35em') // 垂直居中
      .style('text-anchor', 'middle') // 水平居中
      .text(d => `${d.data.name}: ${d.data.value}%`)
      .style('opacity', 0) // 初始透明
      .transition()
      .delay(500) // 等待扇形动画完成
      .style('opacity', 1) // 渐现文字

    arcs.on('mouseover', function () {
      d3.select(this).transition()
        .duration(100)
        .attr('transform', 'scale(1.05)')
    })
      .on('mouseout', function () {
        d3.select(this).transition()
          .duration(100)
          .attr('transform', 'scale(1)')
      })

    const resize = () => {
      const newWidth = container.offsetWidth
      const newHeight = container.offsetHeight
      svg.attr('viewBox', `0 0 ${newWidth} ${newHeight}`)
    }
    window.addEventListener('resize', resize)


  })
})

</script>


<template>
  <div>
    <div class="user-mian">
      <div class="user-header">
        <div class="user-main-left">
          {{ MasterPinia.name }}

        </div>
        <div class="user-main-right"><el-avatar :src="MasterPinia.avatar" /></div>
      </div>
      <div class="main">
        <div class="main-word">
          <p>{{ MasterPinia.signature }}</p>
        </div>
        <div class="gap">
          <div class="line"></div>
          <div class="dos"></div>
          <div class="line"></div>
        </div>
        <div class="main-d3">
          <!-- <img src="https://s2.loli.net/2025/03/16/UqXHAxe2oIPO53j.png" alt=""> -->
          <div class="pie-container">
            <svg ref="svgEl"></svg>
          </div>
        </div>
        <div class="gap">
          <div class="line"></div>
          <div class="dos"></div>
          <div class="line"></div>
        </div>
        <div class="main-connet animate__heartBeat">
          <div class="intro-card">
            <div class="header">
              <i class="fas fa-cloud"></i>
              <h2>小海网盘</h2>
              <span class="tag">Vue技术栈实践</span>
            </div>
            <div class="content">
              <p class="highlight">轻量级云存储平台</p>
              <div class="features">
                <span><i class="fas fa-upload"></i>分片上传</span>
                <span class="divider">|</span>
                <span><i class="fas fa-lock"></i>加密分享</span>
                <span class="divider">|</span>
                <span><i class="fas fa-mobile"></i>快速响应</span>
              </div>
              <p class="detail">集成文件管理/多格式预览/传输优化，展现Vue工程化开发能力</p>
            </div>
          </div>
        </div>
      </div>
      <div class="main-bottom">
        <span @click="userBody">个人中心</span>
        <div class="main-bottom-line"></div>
        <span><a href="https://github.com/ourcx">帮助中心</a></span>
        <div class="main-bottom-line"></div>
        <span @click="userExit">退出登录</span>
      </div>
    </div>
  </div>
</template>



<style scoped>
.user-mian {
  position: relative;
  width: 100%;
  height: 700px;
  display: flex;
  flex-direction: column;
  /* background-color: #e9f8f5; */
  border-radius: 10px;
  z-index: 10001;
}

.user-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.user-main-left {
  position: position;
  margin: 10px 0 0px 10px;
  font-weight: bolder;
  font-size: 24px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #000000;
}

.user-main-right {
  position: position;
  margin: 10px 10px 5px 0;
}

.main {
  position: relative;
  margin: 5px 0 5px 0;
  width: 100%;
  height: 99%;
  overflow: hidden;

}

.main-word {
  font-size: 12px;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  height: 20px;
  position: relative;
  margin-bottom: 10px;
  color: #27ba9b;

}


.main-d3 {
  width: 100%;
  height: 45%;
  position: relative;
}


.main-d3 img {
  width: 100%;
  height: 100%;
  position: relative;
}

.main-connet {
  width: 100%;
  height: 100%;
  position: relative;
  margin: 5px 0;
  background-color: #e9f8f5;

}

.main-bottom {
  width: 100%;
  height: 8%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
}

.main-bottom span {
  border-top: 1px solid #c0c0c0;
  width: 100%;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
}


.main-bottom-line {
  background-color: #c0c0c0;
  width: 1px;
}

.gap {
  width: 100%;
  height: 3px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
}

.line {
  width: 100px;
  height: 1px;
  background-color: #27ba9b;
  margin: 5px 10px;
  position: relative;
}

.dos {
  width: 5px;
  height: 5px;
  background-color: #27ba9b;
  border-radius: 100%;
  margin: 5px 10px;
  position: relative;
}

.intro-card {
  max-width: 600px;
  margin: 20px 0;
  padding: 25px;
  background: #f8f9fe;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', system-ui;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.header h2 {
  margin: 0;
  font-size: 24px;
}

.tag {
  background: #e8f4ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.highlight {
  color: #27ba9b;
  font-size: 18px;
  font-weight: 600;
  margin: 12px 0;
}

.features {
  display: flex;
  gap: 15px;
  align-items: center;
  color: #7f8c8d;
  margin: 15px 0;
}

.features i {
  margin-right: 5px;
}

.detail {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.fa-cloud {
  color: #3498db;
  font-size: 28px;
}

.pie-container {
  width: 100%;
  height: 10%;
  border: 1px solid #eee;
}

/* 穿透样式作用域修改D3元素 */
:deep(.pie-container text) {
  font-size: 12px;
  fill: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
