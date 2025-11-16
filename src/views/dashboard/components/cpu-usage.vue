<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

// 定义时间维度枚举
type TimeDimension = 'minute' | 'hour' | 'day' | 'month'

interface CPUDataPoint {
  timestamp: number
  usage: number
}

const chartRef = ref<HTMLElement | null>(null)
const timeDimension = ref<TimeDimension>('minute')
const chart = ref<echarts.EChartsType | null>(null)

// 生成模拟数据
const generateMockData = (dimension: TimeDimension): CPUDataPoint[] => {
  const data: CPUDataPoint[] = []
  const now = Date.now()
  
  switch (dimension) {
    case 'minute':
      // 最近1小时，每分钟一个数据点
      for (let i = 59; i >= 0; i--) {
        data.push({
          timestamp: now - i * 60 * 1000,
          usage: Math.floor(Math.random() * 30) + Math.sin(i / 10) * 20 + 30
        })
      }
      break
    case 'hour':
      // 最近24小时，每小时一个数据点
      for (let i = 23; i >= 0; i--) {
        data.push({
          timestamp: now - i * 3600 * 1000,
          usage: Math.floor(Math.random() * 40) + Math.sin(i / 4) * 15 + 35
        })
      }
      break
    case 'day':
      // 最近30天，每天一个数据点
      for (let i = 29; i >= 0; i--) {
        data.push({
          timestamp: now - i * 24 * 3600 * 1000,
          usage: Math.floor(Math.random() * 50) + Math.sin(i / 5) * 10 + 25
        })
      }
      break
    case 'month':
      // 最近12个月，每月一个数据点
      for (let i = 11; i >= 0; i--) {
        data.push({
          timestamp: now - i * 30 * 24 * 3600 * 1000,
          usage: Math.floor(Math.random() * 60) + Math.sin(i / 2) * 10 + 20
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
      text: 'CPU 使用率监控',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const item = params[0]
        return `${formatTime(item.data[0], timeDimension.value)}<br/>使用率: ${item.data[1].toFixed(2)}%`
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => formatTime(item.timestamp, timeDimension.value)),
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: '使用率 (%)',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      data: data.map(item => [item.timestamp, item.usage]),
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
        width: 2
      }
    }],
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
  initChart()
  
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
  <div class="cpu-monitor-container">
    <div class="header">
      <div class="title">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <path d="M9 1v3"/>
            <path d="M15 1v3"/>
          </svg>
        </div>
        <h3>CPU 使用率监控</h3>
      </div>
      <div class="time-switcher">
        <button 
          :class="{ active: timeDimension === 'minute' }" 
          @click="switchTimeDimension('minute')"
        >
          分钟
        </button>
        <button 
          :class="{ active: timeDimension === 'hour' }" 
          @click="switchTimeDimension('hour')"
        >
          小时
        </button>
        <button 
          :class="{ active: timeDimension === 'day' }" 
          @click="switchTimeDimension('day')"
        >
          天
        </button>
        <button 
          :class="{ active: timeDimension === 'month' }" 
          @click="switchTimeDimension('month')"
        >
          月
        </button>
      </div>
    </div>
    
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped lang="scss">
.cpu-monitor-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #ffffff;
  height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .title {
      display: flex;
      align-items: center;
      
      .icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        
        svg {
          color: white;
        }
      }
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }
    
    .time-switcher {
      display: flex;
      gap: 8px;
      
      button {
        padding: 6px 12px;
        border: 1px solid #e0e0e0;
        background: #ffffff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
        color: #666;
        transition: all 0.2s;
        
        &:hover {
          border-color: #667eea;
          color: #667eea;
        }
        
        &.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }
      }
    }
  }
  
  .chart-container {
    flex: 1;
    width: 100%;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .cpu-monitor-container {
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      
      .time-switcher {
        align-self: flex-end;
      }
    }
  }
}
</style>