<script setup>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import ScaleLine from 'ol/control/ScaleLine';
import { fromLonLat, toLonLat } from 'ol/proj';
import { ref, onMounted, onUnmounted } from 'vue';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { useMasterPinia } from '@/stores/masterPinia';
const coordinates = ref({
  lat: 0,
  lng: 0
});
const masterPinia = useMasterPinia()
const error = ref(null);
const mapElement = ref(null)
//不一样的底图
// 创建高德地图的 XYZ 瓦片源
const amapSource = new XYZ({
  url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}&lang=zh_cn&scale=1&size=1',
});
const visible = ref(true);
const loading = ref(true);
const getLocation = () => {
  if (!navigator.geolocation) {
    error.value = "您的浏览器不支持地理位置定位功能";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      coordinates.value = {
        lat: position.coords.latitude.toFixed(6),
        lng: position.coords.longitude.toFixed(6)
      };
      console.log(coordinates.value);
      initMap();
    },
    err => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          error.value = "用户拒绝了定位请求";
          break;
        case err.POSITION_UNAVAILABLE:
          error.value = "位置信息不可用";
          break;
        case err.TIMEOUT:
          error.value = "获取位置超时";
          break;
        default:
          error.value = "获取位置失败";
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000
    }
  );
};


const initMap = () => {
  const amapLayer = new TileLayer({
    source: amapSource,
  });
  const point = fromLonLat([coordinates.value.lng, coordinates.value.lat]);
  const views = new View({
    center: point,
    zoom: 16,
    maxZoom: 17,
  })
  const map = new Map({
    target: mapElement.value,
    layers: [amapLayer],
    view: views,
    canvas: {
      willReadFrequently: true
    },
    controls: [
      new ScaleLine({
      }),
    ]
  });
  // 创建数据源
  const source = new VectorSource();

  // 创建矢量图层
  const vectorLayer = new VectorLayer({
    source: source
  });

  const marker = new Feature({
    geometry: new Point(point),
  });

  // 设置标记样式（使用自定义图标）
  const markerStyle = new Style({
    image: new Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      scale: 0.8
    })
  });

  marker.setStyle(markerStyle);

  // 创建矢量图层源并添加标记
  const vectorSource = new VectorSource({
    features: [marker]
  });
  const PointvectorLayer = new VectorLayer({
    source: vectorSource
  });

  // 添加到地图
  map.addLayer(vectorLayer);
  map.addLayer(PointvectorLayer);
  loading.value = false
}

const submit = () => {
  visible.value = false
  getLocation()
}
</script>

<template>
  <div class="main">
    <div class="loginStatue">
      <div class="btn" v-if="visible">
        <el-button class="btn" type="primary" @click="submit">获取坐标</el-button>
      </div>
      <div class="map" v-if="!visible" v-loading="loading">
        <el-descriptions title="当前的登录位置" :column="1">
          <el-descriptions-item label="用户名">{{ masterPinia.name }}</el-descriptions-item>
          <el-descriptions-item label="用户邮箱">{{ masterPinia.email }}</el-descriptions-item>
          <el-descriptions-item label="坐标（墨卡托投影系）">{{ fromLonLat([coordinates.lng, coordinates.lat]) }}</el-descriptions-item>
        </el-descriptions>
        <div id="map" ref="mapElement"></div>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}

.loginStatue {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 7% 5%;
}

.map {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

#map {
  width: 100%;
  height: 80%;
}

.btn {
  width: 100%;
}

/* 按钮悬停效果增强 */
.btn .el-button {
  width: 100%;
  transition: all 0.3s ease;
}

.btn .el-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(32, 160, 255, 0.3);
}
</style>
