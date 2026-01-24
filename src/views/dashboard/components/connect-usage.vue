<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import * as echarts from 'echarts'

// 定义时间维度枚举
type TimeDimension = 'minute' | 'hour' | 'day' | 'month'

interface ConnectionDataPoint {
  timestamp: number
  tcp: number
  http: number
  sse: number
}

const chartRef = ref<HTMLElement | null>(null)
const timeDimension = ref<TimeDimension>('minute')
const chart = ref<echarts.EChartsType | null>(null)

// 生成模拟数据
const generateMockData = (dimension: TimeDimension): ConnectionDataPoint[] => {
  const data: ConnectionDataPoint[] = []
  const now = Date.now()

  switch (dimension) {
    case 'minute':
      // 最近1小时，每分钟一个数据点
      for (let i = 59; i >= 0; i--) {
        data.push({
          timestamp: now - i * 60 * 1000,
          tcp: Math.floor(Math.random() * 500) + Math.sin(i / 10) * 200 + 300,
          http: Math.floor(Math.random() * 400) + Math.sin(i / 8) * 150 + 200,
          sse: Math.floor(Math.random() * 100) + Math.sin(i / 12) * 50 + 50
        })
      }
      break
    case 'hour':
      // 最近24小时，每小时一个数据点
      for (let i = 23; i >= 0; i--) {
        data.push({
          timestamp: now - i * 3600 * 1000,
          tcp: Math.floor(Math.random() * 2000) + Math.sin(i / 4) * 1000 + 1500,
          http: Math.floor(Math.random() * 1500) + Math.sin(i / 5) * 800 + 1000,
          sse: Math.floor(Math.random() * 300) + Math.sin(i / 6) * 150 + 150
        })
      }
      break
    case 'day':
      // 最近30天，每天一个数据点
      for (let i = 29; i >= 0; i--) {
        data.push({
          timestamp: now - i * 24 * 3600 * 1000,
          tcp: Math.floor(Math.random() * 5000) + Math.sin(i / 5) * 2000 + 3000,
          http: Math.floor(Math.random() * 4000) + Math.sin(i / 6) * 1500 + 2000,
          sse: Math.floor(Math.random() * 1000) + Math.sin(i / 7) * 500 + 500
        })
      }
      break
    case 'month':
      // 最近12个月，每月一个数据点
      for (let i = 11; i >= 0; i--) {
        data.push({
          timestamp: now - i * 30 * 24 * 3600 * 1000,
          tcp: Math.floor(Math.random() * 10000) + Math.sin(i / 2) * 5000 + 8000,
          http: Math.floor(Math.random() * 8000) + Math.sin(i / 3) * 4000 + 6000,
          sse: Math.floor(Math.random() * 2000) + Math.sin(i / 4) * 1000 + 1000
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
        let tooltipText = `${formatTime(data[params[0].dataIndex].timestamp, timeDimension.value)}<br/>`
        params.forEach((param: any) => {
          tooltipText += `${param.seriesName}: ${param.data[1]}<br/>`
        })
        return tooltipText
      }
    },
    legend: {
      data: ['TCP连接数', 'HTTP连接数', 'SSE连接数'],
      top: 30
    },
    xAxis: {
      type: 'time',
      data: data.map(item => formatTime(item.timestamp, timeDimension.value)),
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: '连接数'
    },
    series: [
      {
        name: 'TCP连接数',
        data: data.map(item => [item.timestamp, item.tcp]),
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
              color: 'rgba(102, 126, 234, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(102, 126, 234, 0.01)'
            }]
          }
        },
        lineStyle: {
          color: '#667eea',
          width: 1
        }
      },
      {
        name: 'HTTP连接数',
        data: data.map(item => [item.timestamp, item.http]),
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
              color: 'rgba(118, 75, 162, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(118, 75, 162, 0.01)'
            }]
          }
        },
        lineStyle: {
          color: '#764ba2',
          width: 1
        }
      },
      {
        name: 'SSE连接数',
        data: data.map(item => [item.timestamp, item.sse]),
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
              color: 'rgba(253, 197, 179, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(253, 197, 179, 0.01)'
            }]
          }
        },
        lineStyle: {
          color: '#fdc5b3',
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
  <div class="connect-monitor-container">
    <el-descriptions title="连接数">
    </el-descriptions>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped lang="scss">
.connect-monitor-container {
  height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .chart-container {
    flex: 1;
    width: 100%;
  }
}

</style>