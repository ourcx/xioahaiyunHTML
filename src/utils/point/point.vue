<template>
  <div class="canvas-container" :style="{transform: `scale(${scaleVal})`}">
    <!-- 使用 ref 获取 canvas 元素的直接引用 -->
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import type { CanvasProps } from "./CanvasPoint.ts";


const mouse = reactive({
  x: undefined as number | undefined, // 鼠标 x 坐标
  y: undefined as number | undefined, // 鼠标 y 坐标
  radius: 10, // 鼠标扰动半径
});


class Particle {
  x: number;
  y: number;
  originX: number; // 粒子的原始x坐标
  originY: number; // 粒子的原始y坐标
  radius: number;
  color: string;
  vx: number; // x轴速度
  vy: number; // y轴速度
  ease: number = 0.05; // 缓动系数，控制返回速度
  friction: number = 0.95; // 摩擦力，让移动逐渐减慢

  // 新增：粒子受到的推力强度
  pushStrength: number = props.pushStrength || 40;

  constructor(x: number, y: number, color: string = "#2EA9DF", radius: number = 1) {
    this.x = x + (Math.random() - 0.5) * 50;
    this.y = y + (Math.random() - 0.5) * 50;
    this.originX = x;
    this.originY = y;
    this.color = color;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }


  update() {
    // --- 鼠标扰动逻辑 ---
    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx_mouse = this.x - mouse.x;
      const dy_mouse = this.y - mouse.y;
      const distance = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

      // 如果粒子在鼠标的扰动半径内
      if (distance < mouse.radius) {
        // 计算推力的方向和大小
        const forceDirectionX = dx_mouse / distance;
        const forceDirectionY = dy_mouse / distance;

        // 距离越近，推力越强
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = forceDirectionX * force * this.pushStrength;
        const directionY = forceDirectionY * force * this.pushStrength;

        // 将推力施加到速度上
        this.vx += directionX;
        this.vy += directionY;
      }
    }

    // --- 缓动返回原始位置的逻辑 (原有逻辑) ---
    const dx_origin = this.originX - this.x;
    const dy_origin = this.originY - this.y;

    this.vx = (dx_origin * this.ease) + (this.vx * this.friction);
    this.vy = (dy_origin * this.ease) + (this.vy * this.friction);

    this.x += this.vx;
    this.y += this.vy;
  }
}


const canvasRef = ref<HTMLCanvasElement | null>(null);
const props = withDefaults(defineProps<CanvasProps>(), {
  text: "Hello",
  width: window.innerWidth,
  height: window.innerHeight,
  scaleVal: 0.5,
  color: "#2752d9",
  pushStrength: 40,
  skip: 3,
});
const scaleVal = ref(props.scaleVal);

let particles: Particle[] = [];
let animationFrameId: number;

const init = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  const WIDTH = props.width;
  const HEIGHT = props.height;
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  if (!offscreenCtx) return;

  offscreenCanvas.width = WIDTH;
  offscreenCanvas.height = HEIGHT;

  offscreenCtx.font = "bold 100px sans-serif";
  offscreenCtx.textAlign = "center";
  offscreenCtx.textBaseline = "middle";
  offscreenCtx.fillText(props.text, WIDTH / 2, HEIGHT / 2);

  const imgData = offscreenCtx.getImageData(0, 0, WIDTH, HEIGHT).data;
  particles = [];
  const skip = props.skip; // 稍微增加 skip 可以提高性能

  for (let y = 0; y < HEIGHT; y += skip) {
    for (let x = 0; x < WIDTH; x += skip) {
      const opacityIndex = (x + y * WIDTH) * 4 + 3;
      if (imgData[opacityIndex] > 0) {
        particles.push(
          new Particle(
            x,
            y,
            props.color,
            1.5 // 稍微增大粒子半径
          )
        );
      }
    }
  }
};

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    // animate 函数中不需要传递 mouse 对象，因为 particle.update 内部可以直接访问
    particle.update();
    particle.draw(ctx);
  }

  animationFrameId = requestAnimationFrame(animate);
};

// 窗口大小变化时的处理器
const handleResize = () => {
  init();
};


const handleMouseMove = (event: MouseEvent) => {
  // event.offsetX/Y 获取相对于 canvas 左上角的坐标
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
};

const handleMouseLeave = () => {
  // 鼠标移出时，清空坐标，让粒子回归原位
  mouse.x = undefined;
  mouse.y = undefined;
};

onMounted(() => {
  init();
  animate();
  window.addEventListener("resize", handleResize);

  // 为 canvas 添加鼠标事件监听
  canvasRef.value?.addEventListener("mousemove", handleMouseMove);
  canvasRef.value?.addEventListener("mouseleave", handleMouseLeave);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);

  // 移除 canvas 的鼠标事件监听，防止内存泄漏
  canvasRef.value?.removeEventListener("mousemove", handleMouseMove);
  canvasRef.value?.removeEventListener("mouseleave", handleMouseLeave);

  cancelAnimationFrame(animationFrameId);
});
</script>
