<script setup>
import * as d3 from 'd3'
import { onMounted, ref, onBeforeMount, toRaw,onBeforeUnmount } from 'vue'
import { useD3Store } from '@/stores/D3/D3data'
const loading = ref(true)
const d3Store = useD3Store()
const chart = async function () {
  await d3Store.getUersList()
  const data = d3Store.datas
  // 创建工具提示元素
  const tooltip = d3.select("#tooltip");
  let mousePosition = [0, 0]; // 新增：跟踪鼠标位置

  // 可视化参数
  const width = 1210;
  const height = 480;
  const maxRadius = 50;
  const minRadius = 20;
  const padding = 8;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid #ddd")
    .style("background-color", "#fff")
    .on("mousemove", function (event) { // 新增：实时获取鼠标位置
      mousePosition = d3.pointer(event, this);
    });

  const radiusScale = d3.scaleLinear()
    .domain([0, 100])
    .range([minRadius, maxRadius]);

  const colorScale = d3.scaleSequential()
    .domain([0, 100])
    .interpolator(d3.interpolatePlasma);

  // 修改力导向模拟
  const simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("collide", d3.forceCollide(d => radiusScale(d.value) + padding))
    .force("mouse", () => { // 新增：鼠标斥力
      data.forEach(d => {
        const dx = d.x - mousePosition[0];
        const dy = d.y - mousePosition[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 在鼠标周围100像素范围内施加斥力
        if (distance < 100) {
          const force = (100 - distance) / 10;
          d.vx += (dx / distance) * force;
          d.vy += (dy / distance) * force;
        }
      });
    })
    .alphaDecay(0.02); // 调低alphaDecay保持持续运动

  const circles = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", d => radiusScale(d.value))
    .attr("fill", d => colorScale(d.value))
    .attr("opacity", 0.8)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .on("mouseover", function (event, d) {
      // 高亮当前圆形
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", radiusScale(d.value) * 1.2);

      tooltip.transition().style("opacity", 0.9);
    })
    .on("mousemove", function (event, d) {
      tooltip
        .html(`Value: ${d.value}`)
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 25}px`);
    })
    .on("mouseleave", function (event, d) {
      // 恢复原始大小
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", radiusScale(d.value));

      tooltip.transition().style("opacity", 0);
    });


  // 添加文字标签
  const labels = svg.selectAll("text")
    .data(data)
    .enter().append("text")
    .text(d => d.name)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .attr("font-size", "20px")
    .attr("font-weight", "bold");

  // 移除原来的拖拽调用
  // 新增边界约束函数
  function enforceBoundaries(d) {
    d.x = Math.max(radiusScale(d.value), Math.min(width - radiusScale(d.value), d.x));
    d.y = Math.max(radiusScale(d.value), Math.min(height - radiusScale(d.value), d.y));
  }

  simulation.on("tick", () => {
    data.forEach(enforceBoundaries);
    circles
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y + 4);
  });

  // 持续运行模拟
  simulation.alpha(1).restart();

  // 添加响应式支持
  window.addEventListener('resize', () => {
    const newWidth = document.getElementById('visualization')
    svg.attr("width", newWidth);
    simulation.force("x", d3.forceX(newWidth / 2)).restart();
  });
}




let load= setTimeout(() => {
  loading.value = false
  chart()
}, 4000);




onBeforeUnmount(() => {
  clearTimeout(load)
})


//走马灯的图片
const listImg = [
  "https://s2.loli.net/2025/05/28/rHvJMm9PzCW4gOD.png",
  "https://s2.loli.net/2024/11/26/ePbaUhqZo3IjivL.jpg",
  "https://s2.loli.net/2024/11/26/zWsKNXGykTCbgS4.jpg",
  "https://s2.loli.net/2024/11/26/Qfui9AjIeXJ51oE.png"
]


// 活化石

// 教员晚年已经知道中国即将发生些什么事情。他号召全党全军全国人民读马克马列的五本书一一《共产党宣言》、马克思《法兰西内战》、马克思《哥达纲领批判》、列宁《国家与革命》、恩格斯《反杜林论》
</script>

<template>
  <div class="storage-content">
    <div class="storage-content-body" v-loading="loading">
      <div width="100%" height="100%" id="chart" style="user-select: none;">
      </div>
    </div>
    <div class="storage-content-footer">
      <h1>公告</h1>
      <div class="content">
        <div class="block">
          <el-carousel height="100%" motion-blur id="carousel">
            <el-carousel-item v-for="item in listImg" :key="item" id="carousel-item">
              <div class="shadow-overlay"></div>
              <h3 class="justify-center" text="2xl">
                <div class="image">
                  <el-image :src="item" lazy />
                </div>
              </h3>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <p>
        <el-result icon="info"></el-result>
        本可视化展示的是一个简单的力导向图，其中节点的半径表示节点的值，颜色表示节点的值,为了确保性能，在一定时间后静止运行
      </p>
    </div>
  </div>

</template>


<style scoped>
.storage-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
}

.storage-content-body {
  width: 100%;
  height: 50%;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.storage-content-footer {
  width: 100%;
  height: 50%;
  margin-top: 1%;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 1% 4%;
  color: black;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.storage-content-footer h1 {
  margin: 0;
}

.content,
.block,
#carousel,
#carousel-item,
.justify-center {
  height: 100%;
}

.justify-center {
  background-color: #b4b5b6;
}

p {
  color: #b4b5b6;
  text-align: center;
}


.el-carousel-item {
  position: relative; /* 创建定位上下文 */
}

.shadow-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0px -200px 200px -80px rgba(0, 0, 0, 0.8);
  z-index: 2; /* 高于图片的层级 */
  pointer-events: none; /* 允许点击穿透 */
}

.el-image {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1; /* 低于遮罩层级 */
}

.justify-center {
  height: 100%;
}
</style>
