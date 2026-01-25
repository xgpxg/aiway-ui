<script setup lang="ts">
import {ref, onMounted, watch, onUnmounted} from 'vue'
import * as echarts from 'echarts'
import {R} from "@/utils/R";
import {U} from "@/utils/util";

const props = defineProps(['nodeId', 'state'])

interface DataPoint {
  t: number
  v: number
}

let chart: echarts.EChartsType
const chartRef = ref<HTMLElement | null>(null)
const timeDimension = ref<string>('minute')
const data = ref<DataPoint[]>([])
const timer = ref<any>(null)
const chartOption = {
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const item = params[0]
      return `${U.dateUtil.formatDate(item.data[0], 'hh:mm:ss')}<br/>已用: ${U.renderSize(item.data[1])}`
    },
  },
  xAxis: {
    type: 'time',
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    name: '用量',
    max: props.state?.mem_total,
    axisLabel: {
      formatter: (value: number) => {
        return U.renderSize(value)
      }
    }
  },
  visualMap: {
    type: 'continuous',
    min: 0,
    max: props.state?.mem_total,
    top: 'middle',
    right: 10,
    inRange: {
      color: ['#99d193', '#ffae00', '#ff0000']
    },
    show: false,
  },
  series: [{
    data: [],
    type: 'line',
    smooth: true,
    showSymbol: false,
    areaStyle: {
      opacity: 0.2
    },
    lineStyle: {
      width: 1,
    }
  }],
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    //containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      throttle: 100
    }
  ]
}


onMounted(() => {
  setTimeout(() => {
    initChart();
  }, 100);


  timer.value = setInterval(() => {
    loadData()
  }, 5000)

  window.addEventListener('resize', () => {
    if (chart) {
      chart.resize()
    }
  })

})

onUnmounted(() => {
  clearInterval(timer.value)
})

const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption(chartOption)

    loadData()
  }
}

const loadData = async () => {
  const now = Date.now()
  let startTimestamp = 0

  switch (timeDimension.value) {
    case 'minute':
      startTimestamp = now - 60 * 1000
      break
    case 'five_minute':
      startTimestamp = now - 5 * 60 * 1000
      break
    case 'hour':
      startTimestamp = now - 60 * 60 * 1000
      break
    case 'day':
      startTimestamp = now - 24 * 60 * 60 * 1000
      break
    default:
      startTimestamp = now - 60 * 1000
  }

  const response = await R.get(`/api/node/${props.nodeId}/memory_usage`, {
    start_timestamp: startTimestamp,
    end_timestamp: now,
  })

  // 更新本地数据
  data.value = response.data

  // 更新图表数据
  chart.setOption({
    series: [{
      data: response.data.map((item: any) => [item.t, item.v])
    }]
  })
}

// 切换时间维度
const switchTimeDimension = (dimension: string) => {
  timeDimension.value = dimension
  loadData()
}

// 监听时间维度变化
watch(timeDimension, () => {
  loadData()
})

</script>

<template>
  <div class="chart">
    <div class="header">
      <h4>内存用量</h4>
      <div>
        <el-button
            v-for="dimension in ['minute', 'five_minute', 'hour', 'day']"
            :key="dimension"
            :type="timeDimension === dimension ? 'primary' : 'default'"
            @click="switchTimeDimension(dimension)"
            size="small"
        >
          <template v-if="dimension === 'minute'">近1分钟</template>
          <template v-else-if="dimension === 'five_minute'">近5分钟</template>
          <template v-else-if="dimension === 'hour'">近1小时</template>
          <template v-else-if="dimension === 'day'">近1天</template>
        </el-button>
      </div>
    </div>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style scoped lang="scss">
.chart {
  height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    display: flex;
    justify-content: space-between;
  }

  .chart-container {
    flex: 1;
    width: 100%;
  }
}

</style>