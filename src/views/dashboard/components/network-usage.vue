<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import * as echarts from 'echarts'

// 定义时间维度枚举
type TimeDimension = 'minute' | 'hour' | 'day' | 'month'

interface NetworkDataPoint {
  timestamp: number
  in: number
  out: number
}

const chartRef = ref<HTMLElement | null>(null)
const timeDimension = ref<TimeDimension>('minute')
const chart = ref<echarts.EChartsType | null>(null)

// 生成模拟数据
const generateMockData = (dimension: TimeDimension): NetworkDataPoint[] => {
  const data: NetworkDataPoint[] = []
  const now = Date.now()

  switch (dimension) {
    case 'minute':
      // 最近1小时，每分钟一个数据点
      for (let i = 59; i >= 0; i--) {
        data.push({
          timestamp: now - i * 60 * 1000,
          in: Math.floor(Math.random() * 1000) + Math.sin(i / 10) * 500 + 500,
          out: Math.floor(Math.random() * 800) + Math.sin(i / 8) * 400 + 400
        })
      }
      break
    case 'hour':
      // 最近24小时，每小时一个数据点
      for (let i = 23; i >= 0; i--) {
        data.push({
          timestamp: now - i * 3600 * 1000,
          in: Math.floor(Math.random() * 5000) + Math.sin(i / 4) * 2000 + 3000,
          out: Math.floor(Math.random() * 4000) + Math.sin(i / 5) * 1500 + 2500
        })
      }
      break
    case 'day':
      // 最近30天，每天一个数据点
      for (let i = 29; i >= 0; i--) {
        data.push({
          timestamp: now - i * 24 * 3600 * 1000,
          in: Math.floor(Math.random() * 20000) + Math.sin(i / 5) * 10000 + 15000,
          out: Math.floor(Math.random() * 18000) + Math.sin(i / 6) * 8000 + 12000
        })
      }
      break
    case 'month':
      // 最近12个月，每月一个数据点
      for (let i = 11; i >= 0; i--) {
        data.push({
          timestamp: now - i * 30 * 24 * 3600 * 1000,
          in: Math.floor(Math.random() * 100000) + Math.sin(i / 2) * 50000 + 80000,
          out: Math.floor(Math.random() * 90000) + Math.sin(i / 3) * 40000 + 70000
        })
      }
      break
  }

  return data
}

// 格式化时间显示
const formatTime = (timestamp: number, dimension: TimeDimension): string => {
  const date = new Date(timestamp)

  switch (dimension) {
    case 'minute':
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    case 'hour':
      return `${date.getHours().toString().padStart(2, '0')}:00`
    case 'day':
      return `${date.getMonth() + 1}-${date.getDate()}`
    case 'month':
      return `${date.getFullYear()}-${date.getMonth() + 1}`
    default:
      return date.toLocaleString()
  }
}

// 格式化网络流量显示
const formatNetwork = (bytes: number): string => {
  if (bytes > 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  } else if (bytes > 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  } else if (bytes > 1024) {
    return (bytes / 1024).toFixed(2) + ' KB'
  } else {
    return bytes + ' B'
  }
}

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chart.value = echarts.init(chartRef.value)
    updateChart()
  }
}

// 更新图表
const updateChart = () => {
  if (!chart.value) return

  const data = generateMockData(timeDimension.value)

  const option = {
    title: {
      text: '',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const inItem = params[0]
        const outItem = params[1]
        const dataIndex = inItem.dataIndex
        const networkData = data[dataIndex]
        return `${formatTime(networkData.timestamp, timeDimension.value)}<br/>
                入站: ${formatNetwork(networkData.in)}/s<br/>
                出站: ${formatNetwork(networkData.out)}/s`
      }
    },
    legend: {
      data: ['入站流量', '出站流量'],
      top: 30
    },
    xAxis: {
      type: 'time',
      data: data.map(item => formatTime(item.timestamp, timeDimension.value)),
      boundaryGap: false
    },
    yAxis: [
      {
        type: 'value',
        name: '流量 (bytes/s)',
        axisLabel: {
          formatter: (value: number) => {
            if (value > 1024 * 1024 * 1024) {
              return (value / (1024 * 1024 * 1024)).toFixed(1) + 'G'
            } else if (value > 1024 * 1024) {
              return (value / (1024 * 1024)).toFixed(1) + 'M'
            } else if (value > 1024) {
              return (value / 1024).toFixed(1) + 'K'
            } else {
              return value
            }
          }
        }
      }
    ],
    series: [
      {
        name: '入站流量',
        data: data.map(item => [item.timestamp, item.in]),
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(234,102,227,0.3)'
            }, {
              offset: 1,
              color: 'rgba(102, 126, 234, 0.01)'
            }]
          }
        },
        lineStyle: {
          color: '#ea66c0',
          width: 1
        }
      },
      {
        name: '出站流量',
        data: data.map(item => [item.timestamp, item.out]),
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(75,162,105,0.3)'
            }, {
              offset: 1,
              color: 'rgba(118, 75, 162, 0.01)'
            }]
          }
        },
        lineStyle: {
          color: '#4ba28e',
          width: 1
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  }

  chart.value.setOption(option)
}

// 切换时间维度
const switchTimeDimension = (dimension: TimeDimension) => {
  timeDimension.value = dimension
  updateChart()
}

// 监听时间维度变化
watch(timeDimension, () => {
  updateChart()
})

// 组件挂载时初始化图表
onMounted(() => {
  setTimeout(() => {
    initChart()
  }, 100)

  // 窗口大小改变时重置图表大小
  window.addEventListener('resize', () => {
    if (chart.value) {
      chart.value.resize()
    }
  })

  // 模拟实时数据更新
  setInterval(() => {
    updateChart()
  }, 10000)
})
</script>

<template>
  <div class="network-monitor-container">
    <el-descriptions title="网络流量">
    </el-descriptions>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped lang="scss">
.network-monitor-container {
  height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chart-container {
    flex: 1;
    width: 100%;
  }
}
</style>