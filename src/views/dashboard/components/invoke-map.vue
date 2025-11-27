<script setup lang="ts">
import {ref, onMounted, onUnmounted, computed} from 'vue'
import * as echarts from 'echarts'
import chinaMapData from '/public/map/china.json'
import {R} from "@/utils/R";

const DEFAULT = [
  {name: '北京', value: 0},
  {name: '天津', value: 0},
  {name: '上海', value: 0},
  {name: '重庆', value: 0},
  {name: '河北', value: 0},
  {name: '河南', value: 0},
  {name: '云南', value: 0},
  {name: '辽宁', value: 0},
  {name: '黑龙江', value: 0},
  {name: '湖南', value: 0},
  {name: '安徽', value: 0},
  {name: '山东', value: 0},
  {name: '新疆', value: 0},
  {name: '江苏', value: 0},
  {name: '浙江', value: 0},
  {name: '江西', value: 0},
  {name: '湖北', value: 0},
  {name: '广西', value: 0},
  {name: '甘肃', value: 0},
  {name: '山西', value: 0},
  {name: '内蒙古', value: 0},
  {name: '陕西', value: 0},
  {name: '吉林', value: 0},
  {name: '福建', value: 0},
  {name: '贵州', value: 0},
  {name: '广东', value: 0},
  {name: '青海', value: 0},
  {name: '西藏', value: 0},
  {name: '四川', value: 0},
  {name: '宁夏', value: 0},
  {name: '海南', value: 0},
  {name: '台湾', value: 0},
  {name: '香港', value: 0},
  {name: '澳门', value: 0}
]

const chartRef = ref<HTMLElement | null>(null)
// 地图实例
let chartInstance: echarts.ECharts | null = null
// 地图数据
const provinceData = ref<{ name: string; value: number }[]>()
// 时间范围
const timeRanges = ref([
  {label: '今天', value: 'today'},
  {label: '昨天', value: 'yesterday'},
  {label: '近7天', value: 'last7Days'},
  {label: '近30天', value: 'last30Days'},
  {label: '近一年', value: 'lastYear'}
])
// 已选的时间范围，默认今天
const selectedTimeRange = ref('today')

onMounted(() => {
  if (chartRef.value) {
    initChart()
  }
  loadData()
})

const loadData = () => {
  const {startTime, endTime} = getTimeRange(selectedTimeRange.value);
  R.postJson('/api/metrics/region/count', {
    start_timestamp: startTime,
    end_timestamp: endTime
  }).then((res: any) => {
    // 没有数据，使用默认的，用0填充
    if (res.data.length === 0) {
      updateData(DEFAULT)
      return
    }
    // 更新
    updateData(res.data)
  })
}

// 每10秒钟刷新
const timer = setInterval(() => {
  loadData()
}, 10000)

onUnmounted(() => {
  clearInterval(timer)
})


// 获取时间范围的时间戳
const getTimeRange = (range: string) => {
  const now = new Date();
  let startTime: number, endTime: number;

  switch (range) {
      // 今天
    case 'today':
      // 今天0点时间戳
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startTime = Math.floor(today.getTime() / 1000);
      // 今天23:59:59时间戳作为结束时间
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      endTime = Math.floor(endOfToday.getTime() / 1000);
      break;
      // 昨天
    case 'yesterday':
      // 昨天0点时间戳
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      startTime = Math.floor(yesterday.getTime() / 1000);
      // 昨天23:59:59时间戳作为结束时间
      const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
      endTime = Math.floor(endOfYesterday.getTime() / 1000);
      break;
      // 近7天
    case 'last7Days':
      // 7天前0点时间戳
      const last7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      startTime = Math.floor(last7Days.getTime() / 1000);
      // 今天23:59:59时间戳作为结束时间
      const endOfPeriod7 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      endTime = Math.floor(endOfPeriod7.getTime() / 1000);
      break;
      // 近30天
    case 'last30Days':
      // 30天前0点时间戳
      const last30Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      startTime = Math.floor(last30Days.getTime() / 1000);
      // 今天23:59:59时间戳作为结束时间
      const endOfPeriod30 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      endTime = Math.floor(endOfPeriod30.getTime() / 1000);
      break;
      // 近一年
    case 'lastYear':
      // 去年今天的时间戳
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      startTime = Math.floor(lastYear.getTime() / 1000);
      // 今年今天前一天的23:59:59时间戳作为结束时间
      const endOfPeriodYear = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
      endTime = Math.floor(endOfPeriodYear.getTime() / 1000);
      break;
    default:
      // 默认今天
      const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startTime = Math.floor(defaultStart.getTime() / 1000);
      // 今天23:59:59时间戳作为结束时间
      const defaultEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      endTime = Math.floor(defaultEnd.getTime() / 1000);
  }

  return {startTime, endTime};
}


const handleTimeRangeChange = (range: string) => {
  selectedTimeRange.value = range
  loadData()
}


const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)

// 注册地图数据
  echarts.registerMap('china', chinaMapData)

  // 设置图表选项
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
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>调用次数: ${params.value}`
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#ffffff', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
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
  // 监听窗口变化
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
}

// 更新数据的方法
const updateData = (newData: { name: string; value: number }[]) => {
  provinceData.value = newData
  if (chartInstance) {
    const maxValue = Math.max(...newData.map(item => item.value))
    const visualMax = maxValue > 0 ? maxValue : 10

    chartInstance.setOption({
      series: [{
        data: newData
      }],
      visualMap: {
        max: visualMax
      }
    })
    chartInstance.setOption({
      series: [{
        data: newData
      }],
      visualMap: {
        max: visualMax
      }
    })
  }
}
</script>

<template>
  <div class="invoke-map-container">
    <div class="header">
      <div class="title">地域分布</div>
      <div class="time-filter">
        <el-button
            v-for="range in timeRanges"
            :key="range.value"
            :type="selectedTimeRange === range.value ? 'primary' : 'default'"
            size="small"
            @click="handleTimeRangeChange(range.value)"
        >
          {{ range.label }}
        </el-button>
      </div>
    </div>
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .title {
      font-size: 16px;
      font-weight: normal;
    }

    .time-filter {
      display: flex;
      gap: 8px;
    }
  }

  .chart-wrapper {
    flex: 1;
    max-height: 350px;
  }
}
</style>