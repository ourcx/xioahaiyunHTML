<script setup>
import { ref, onMounted, onBeforeUnmount, shallowRef, reactive, toRaw } from 'vue'
import * as d3 from 'd3'
import apiClient from '@/utils/api'
import { useMasterPinia } from '@/stores/masterPinia'
const MasterPinia = useMasterPinia()
const height = 850
const width = ref(0)
const svgElement = ref(null)
const chartContainer = ref(null)
const loading = ref(true)
// 数据集（使用shallowRef避免深度响应式转换）
const dataset = reactive({
  nodes: [

  ],
  links: [
  ]
})

// D3相关引用
const simulation = shallowRef(null)
const colorScale = d3.scaleOrdinal(d3.schemeSet2)
// 初始化图表
function initChart() {
  const svg = d3.select(svgElement.value)
  console.log(dataset.links)
  console.log(dataset.nodes)

  // 创建连线
  const links = svg.selectAll(".link")
    .data(dataset.links)
    .join("line")
    .classed("link", true)
    .attr("stroke", "#999")
    .attr("stroke-opacity", 10)
    .attr("stroke-width", 10)
    .attr("marker-end", "url(#arrow)")
    .attr("marker-start", "url(#arrow)")
    .attr("marker-mid", "url(#arrow)")


  // 创建节点
  const nodes = svg.selectAll(".node")
    .data(dataset.nodes)
    .join("circle")
    .classed("node", true)
    .attr("r", 40)
    .attr("fill", d => colorScale(d.id))
    .call(drag(simulation.value))
    .style("cursor", "pointer")


  // 添加标签
  nodes.append("title").text(d => d.name)
  const labels = svg.selectAll("text")
    .data(dataset.nodes)
    .enter().append("text")
    .text(d => d.name)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("pointer-events", "none")
    .call(drag(simulation.value))



  // 初始化力导向模拟
  simulation.value = d3.forceSimulation(dataset.nodes)
    .force("link", d3.forceLink(dataset.links).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width.value / 2, height / 2))
    .force("collision", d3.forceCollide().radius(12))
     .alphaTarget(0.5)
  //       .alphaDecay(0.05) // 默认0.0228
  // .velocityDecay(0.4)

  // 更新连线坐标
  simulation.value.on("tick", () => {
    links
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    nodes
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  })
}

// 拖拽交互
function drag(simulation) {
  function dragstarted(event) {
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  function dragended(event) {
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
}

// 响应式处理
function handleResize() {
  width.value = chartContainer.value?.clientWidth || 0
  if (simulation.value) {
    simulation.value.force("center", d3.forceCenter(width.value / 2, height / 2))
    simulation.value.alpha(1).restart()
  }
}

function updateDataset(newNodes, newLinks) {
  Object.assign(dataset, {
    nodes: [ { id: 0, name: MasterPinia.name, email: MasterPinia.email },...newNodes],
    links: [...newLinks]
  })
}
onMounted(async () => {
  try {
    const response = await apiClient.get("/data/relationD3")
    const res = response.data

    if (res.code === 200) {
      // 正确更新响应式对象
      console.log(res)
      updateDataset(res.nodes, res.links)
    } else {
      console.error("API 返回错误:", res.message)
    }
  } catch (error) {
    console.error("请求失败:", error)
  }
})
// 生命周期
let heart = setInterval(() => {
  handleResize()
  initChart()
  window.addEventListener('resize', handleResize)
}, 4000);
let load = setTimeout(() => {
  loading.value = false
}, 4000);


onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (simulation.value) simulation.value.stop()
  clearTimeout(load)
  clearInterval(heart)
})


</script>

<template>
  <div class="storage-content">
    <div class="storage-content-body" v-loading="loading">
      <div width="100%" height="100%" id="chart" style="user-select: none;">
        <div ref="chartContainer" class="force-graph-container">
          <svg ref="svgElement" :width="width" :height="height"></svg>
        </div>
      </div>
    </div>
    <div class="storage-content-footer">
      <h1>相关说明</h1>
      <h4>本图展示了一个好友关系的力导向图，可以展示好友之间的关系</h4>

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
  height: 90%;
  background-color: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.storage-content-footer {
  width: 100%;
  height: 10%;
  margin-top: 1%;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 1% 4%;
  color: black;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.force-graph-container {
  width: 100%;
  height: 800px;
}

.node:hover {
  cursor: pointer;
  stroke: #333;
  stroke-width: 2px;
}

.node {
  opacity: 0.8;
}
</style>
