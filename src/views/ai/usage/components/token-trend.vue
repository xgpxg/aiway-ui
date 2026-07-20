<script setup lang="ts">
import * as echarts from 'echarts'
import {onMounted, onUnmounted, ref} from "vue"
import {R} from '@/utils/R.js'

let myChart = null
const chartRef = ref(null)
const activeTimeRange = ref('hour')

onMounted(() => {
  initChart()
})

const timer = setInterval(() => {
  updateChartData()
}, 10000)

onUnmounted(() => {
  clearInterval(timer)
  if (myChart) {
    myChart.dispose()
  }
})

const selectTimeRange = (range: string) => {
  activeTimeRange.value = range
  updateChartData()
  if (myChart) {
    myChart.dispatchAction({type: 'dataZoom', start: 0, end: 100})
  }
}

const getDayStart = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000
}

const getDayEnd = (date: Date): number => {
  return getDayStart(date) + 86400 - 1
}

const calculateTimeRange = () => {
  const now = new Date()
  const todayStart = getDayStart(now)
  const todayEnd = getDayEnd(now)
  let startTime, endTime

  switch (activeTimeRange.value) {
    case 'hour':
      endTime = Math.floor(now.getTime() / 1000)
      startTime = endTime - 60 * 60
      break
    case 'today':
      startTime = todayStart
      endTime = todayEnd
      break
    case 'yesterday':
      startTime = todayStart - 86400
      endTime = todayStart - 1
      break
    case '7days':
      startTime = todayStart - 7 * 86400
      endTime = todayEnd
      break
    default:
      endTime = Math.floor(now.getTime() / 1000)
      startTime = endTime - 60 * 60
  }

  return {startTime, endTime}
}

const loadData = async (startTime, endTime) => {
  try {
    const res = await R.postJson('/api/model/usage/trend', {
      start_timestamp: startTime,
      end_timestamp: endTime
    })
    if (res.code === 0) {
      return res.data || []
    }
    return []
  } catch {
    return []
  }
}

const getInterval = (): number => {
  switch (activeTimeRange.value) {
    case 'hour': return 60
    default: return 3600
  }
}

const formatTime = (ts: number): string => {
  const date = new Date(ts * 1000)
  if (activeTimeRange.value === 'hour') {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return `${date.getMonth() + 1}-${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const updateChartData = async () => {
  const {startTime, endTime} = calculateTimeRange()
  const rawData = await loadData(startTime, endTime)

  const interval = getInterval()
  const dataMap: Record<number, {tokens: number, call_count: number}> = {}
  rawData.forEach(item => {
    const slot = Math.floor(item.time / interval) * interval
    dataMap[slot] = {
      tokens: (dataMap[slot]?.tokens || 0) + (item.tokens || 0),
      call_count: (dataMap[slot]?.call_count || 0) + (item.call_count || 0),
    }
  })

  const xAxisData: string[] = []
  const tokenData: number[] = []
  const requestData: number[] = []

  for (let t = Math.ceil(startTime / interval) * interval; t <= endTime; t += interval) {
    xAxisData.push(formatTime(t))
    const d = dataMap[t]
    tokenData.push(d?.tokens || 0)
    requestData.push(d?.call_count || 0)
  }

  if (myChart) {
    myChart.setOption({
      xAxis: {data: xAxisData},
      series: [
        {name: 'Token消耗', data: tokenData},
        {name: '请求数', data: requestData}
      ]
    })
  }
}

const initChart = () => {
  myChart = echarts.init(chartRef.value)

  window.addEventListener('resize', () => {
    if (myChart) myChart.resize()
  })

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: {color: '#606266'},
      axisPointer: {
        type: 'cross',
        label: {backgroundColor: '#6a7985'}
      }
    },
    legend: {
      top: '25',
      right: '95',
      type: 'scroll',
      itemWidth: 14,
      itemHeight: 10,
      textStyle: {fontSize: 12},
      data: ['Token消耗', '请求数']
    },
    grid: {
      top: '60',
      left: '60',
      right: '60',
      bottom: '40',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      name: '时间',
      nameTextStyle: {color: '#909399', fontSize: 12},
      axisLine: {lineStyle: {color: '#e4e7ed'}},
      axisLabel: {color: '#909399', fontSize: 12},
      axisTick: {show: false}
    },
    yAxis: [
      {
        type: 'value',
        name: 'Token数',
        nameTextStyle: {color: '#909399', fontSize: 12},
        axisLine: {show: false},
        axisLabel: {
          color: '#909399',
          fontSize: 12,
          formatter: (val) => val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : val >= 1000 ? (val / 1000).toFixed(1) + 'K' : val
        },
        splitLine: {lineStyle: {type: 'dashed', color: '#f0f0f0'}},
        axisTick: {show: false}
      },
      {
        type: 'value',
        name: '请求数',
        nameTextStyle: {color: '#909399', fontSize: 12},
        axisLine: {show: false},
        axisLabel: {color: '#909399', fontSize: 12},
        splitLine: {show: false},
        axisTick: {show: false}
      }
    ],
    dataZoom: [{type: 'inside', start: 0, end: 100}],
    series: [
      {
        name: 'Token消耗',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        yAxisIndex: 0,
        lineStyle: {width: 2, color: '#409eff'},
        areaStyle: {
          opacity: 0.15,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#409eff'},
            {offset: 1, color: '#b3d8ff'}
          ])
        },
        emphasis: {focus: 'series'}
      },
      {
        name: '请求数',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        yAxisIndex: 1,
        lineStyle: {width: 1, color: '#67c23a'},
        areaStyle: {
          opacity: 0.1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#67c23a'},
            {offset: 1, color: '#b3e880'}
          ])
        },
        emphasis: {focus: 'series'}
      }
    ]
  }

  myChart.setOption(option)
  updateChartData()
}
</script>

<template>
  <div class="chart-container">
    <div class="header">
      <div class="title">Token消耗趋势</div>
      <div class="time-controls">
        <el-button size="small" :type="activeTimeRange === 'hour' ? 'primary' : 'default'"
                   @click="selectTimeRange('hour')">近1小时</el-button>
        <el-button size="small" :type="activeTimeRange === 'today' ? 'primary' : 'default'"
                   @click="selectTimeRange('today')">今天</el-button>
        <el-button size="small" :type="activeTimeRange === 'yesterday' ? 'primary' : 'default'"
                   @click="selectTimeRange('yesterday')">昨天</el-button>
        <el-button size="small" :type="activeTimeRange === '7days' ? 'primary' : 'default'"
                   @click="selectTimeRange('7days')">近7天</el-button>
      </div>
    </div>
    <div ref="chartRef" id="token-trend-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  padding: 16px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  #token-trend-chart {
    height: 400px;
    width: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: normal;
    }

    .time-controls {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
