<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 注册地图
// 模拟各省调用数据
const provinceData = ref([
  { name: '北京', value: 125 },
  { name: '天津', value: 78 },
  { name: '上海', value: 178 },
  { name: '重庆', value: 98 },
  { name: '河北', value: 132 },
  { name: '河南', value: 113 },
  { name: '云南', value: 92 },
  { name: '辽宁', value: 108 },
  { name: '黑龙江', value: 89 },
  { name: '湖南', value: 112 },
  { name: '安徽', value: 99 },
  { name: '山东', value: 145 },
  { name: '新疆', value: 67 },
  { name: '江苏', value: 168 },
  { name: '浙江', value: 189 },
  { name: '江西', value: 82 },
  { name: '湖北', value: 128 },
  { name: '广西', value: 76 },
  { name: '甘肃', value: 58 },
  { name: '山西', value: 95 },
  { name: '内蒙古', value: 73 },
  { name: '陕西', value: 102 },
  { name: '吉林', value: 86 },
  { name: '福建', value: 142 },
  { name: '贵州', value: 69 },
  { name: '广东', value: 210 },
  { name: '青海', value: 42 },
  { name: '西藏', value: 35 },
  { name: '四川', value: 156 },
  { name: '宁夏', value: 53 },
  { name: '海南', value: 65 },
  { name: '台湾', value: 98 },
  { name: '香港', value: 87 },
  { name: '澳门', value: 43 }
])

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  if (chartRef.value) {
    initChart()
  }
})

const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  // 使用 XMLHttpRequest 加载中国地图数据
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://cdn.jsdelivr.net/npm/echarts/map/json/china.json')
  xhr.onload = () => {
    if (xhr.status === 200) {
      // 注册地图数据
      echarts.registerMap('china', JSON.parse(xhr.responseText))
      
      // 设置图表选项
      const option = {
        title: {
          text: '全国调用热力图',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `${params.name}<br/>调用次数: ${params.value}`
          }
        },
        visualMap: {
          min: 0,
          max: 250,
          left: 'left',
          top: 'bottom',
          text: ['高','低'],
          calculable: true,
          inRange: {
            color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
          }
        },
        series: [
          {
            name: '调用次数',
            type: 'map',
            map: 'china',
            roam: false,
            zoom: 1.2,
            emphasis: {
              label: {
                show: true
              }
            },
            data: provinceData.value
          }
        ]
      }
      
      chartInstance.setOption(option)
    } else {
      console.error('Failed to load map data')
      // 显示错误信息
      if (chartInstance) {
        const errorOption = {
          title: {
            text: '地图数据加载失败',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#999',
              fontSize: 16
            }
          }
        }
        chartInstance.setOption(errorOption)
      }
    }
  }
  xhr.send()
  
  // 监听窗口变化
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
}

// 更新数据的方法
const updateData = (newData: { name: string; value: number }[]) => {
  provinceData.value = newData
  if (chartInstance) {
    chartInstance.setOption({
      series: [{
        data: newData
      }]
    })
  }
}
</script>

<template>
  <div class="invoke-map-container">
    <div ref="chartRef" class="chart-wrapper"></div>
  </div>
</template>

<style scoped lang="scss">
.invoke-map-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-overlay);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  
  .chart-wrapper {
    flex: 1;
    max-height: 350px;
  }
}
</style>