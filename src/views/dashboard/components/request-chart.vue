<script setup lang="ts">import * as echarts from 'echarts';
import {onMounted, onUnmounted, ref} from "vue";
import {R} from '@/utils/R.js';

let myChart = null;
const chartRef = ref(null);
const activeTimeRange = ref('hour');

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
  }
})

// 每10秒钟刷新
const timer = setInterval(() => {
  updateChartData()
}, 10000)

onUnmounted(() => {
  clearInterval(timer)
})

const selectTimeRange = (range) => {
  activeTimeRange.value = range;
  updateChartData();

  // 重置缩放
  if (myChart) {
    myChart.dispatchAction({
      type: 'dataZoom',
      start: 0,
      end: 100
    });
  }
}

// 根据时间范围计算起止时间戳
const calculateTimeRange = () => {
  const now = new Date();
  let startTime, endTime;

  switch (activeTimeRange.value) {
    case 'hour':
      // 近一小时，精确到分钟
      endTime = Math.floor(now.getTime() / 1000);
      startTime = endTime - 60 * 60; // 1小时前
      break;
    case 'today':
      // 今天 00:00:00 到现在
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
      endTime = Math.floor(now.getTime() / 1000);
      break;
    case 'yesterday':
      // 昨天 00:00:00 到 23:59:59
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).getTime() / 1000;
      endTime = startTime + 24 * 60 * 60 - 1;
      break;
    case '7days':
      // 近7天
      endTime = Math.floor(now.getTime() / 1000);
      startTime = endTime - 7 * 24 * 60 * 60; // 7天前
      break;
    default:
      // 默认近一小时
      endTime = Math.floor(now.getTime() / 1000);
      startTime = endTime - 60 * 60;
  }

  return {startTime, endTime};
}

// 获取图表数据
const loadData = async (startTime, endTime) => {
  try {
    const res = await R.postJson('/api/metrics/status/count', {
      start_timestamp: startTime,
      end_timestamp: endTime
    });

    if (res.code === 0) {
      return res.data;
    } else {
      console.error('获取图表数据失败:', res.msg);
      return [];
    }
  } catch (error) {
    console.error('获取图表数据异常:', error);
    return [];
  }
}

// 更新图表数据
const updateChartData = async () => {
  const {startTime, endTime} = calculateTimeRange();
  const rawData = await loadData(startTime, endTime);

  // 处理数据
  const xAxisData = [];
  const success2xx = [];
  const redirect3xx = [];
  const clientError4xx = [];
  const serverError5xx = [];
  const totalRequests = [];

  // 按时间排序数据
  rawData.sort((a, b) => a.state_time - b.state_time);

  rawData.forEach(item => {
    // 格式化时间显示
    const date = new Date(item.state_time * 1000);
    if (activeTimeRange.value === 'hour') {
      xAxisData.push(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
    } else {
      xAxisData.push(`${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
    }

    success2xx.push(item.status_2xx || 0);
    redirect3xx.push(item.status_3xx || 0);
    clientError4xx.push(item.status_4xx || 0);
    serverError5xx.push(item.status_5xx || 0);

    // 计算总请求数
    const total = (item.status_2xx || 0) + (item.status_3xx || 0) + (item.status_4xx || 0) + (item.status_5xx || 0);
    totalRequests.push(total);
  });

  // 更新图表
  if (myChart) {
    myChart.setOption({
      xAxis: {
        data: xAxisData
      },
      series: [
        {
          name: '总和',
          data: totalRequests
        },
        {
          name: '2xx',
          data: success2xx
        },
        {
          name: '3xx',
          data: redirect3xx
        },
        {
          name: '4xx',
          data: clientError4xx
        },
        {
          name: '5xx',
          data: serverError5xx
        }
      ]
    });
  }
}

const initChart = () => {

  myChart = echarts.init(chartRef.value);

  // 自适应窗口变化
  window.addEventListener('resize', () => {
    if (myChart) {
      myChart.resize();
    }
  });

  // 初始化空图表
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: {
        color: '#606266'
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      top: '25',
      right: '15',
      type: 'scroll',
      itemWidth: 14,
      itemHeight: 10,
      textStyle: {
        fontSize: 12
      },
      data: ['总和', '2xx', '3xx', '4xx', '5xx']
    },
    grid: {
      top: '60',
      left: '40',
      right: '20',
      bottom: '40',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      name: '时间',
      nameTextStyle: {
        color: '#909399',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#e4e7ed'
        }
      },
      axisLabel: {
        color: '#909399',
        fontSize: 12
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '请求数',
      nameTextStyle: {
        color: '#909399',
        fontSize: 12
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#909399',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#f0f0f0'
        }
      },
      axisTick: {
        show: false
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: '总和',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        lineStyle: {
          width: 1,
          color: '#409eff'
        },
        areaStyle: {
          opacity: 0.1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#409eff'},
            {offset: 1, color: '#b3d8ff'}
          ])
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '2xx',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        lineStyle: {
          width: 1,
          color: '#67c23a'
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#67c23a'},
            {offset: 1, color: '#b3e880'}
          ])
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '3xx',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        lineStyle: {
          width: 1,
          color: '#9d7cf1'
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#9d7cf1'},
            {offset: 1, color: '#eae7f4'}
          ])
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '4xx',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        lineStyle: {
          width: 1,
          color: '#f5856c'
        },
        areaStyle: {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#f5856c'},
            {offset: 1, color: '#fdeee8'}
          ])
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: '5xx',
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbolSize: 6,
        data: [],
        lineStyle: {
          width: 1,
          color: '#f12727'
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#f12727'},
            {offset: 1, color: '#ffaaaa'}
          ])
        },
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: '#f12727'
        }
      }
    ]
  };

  option && myChart.setOption(option);

  // 获取初始数据
  updateChartData();
}
</script>

<template>
  <div class="chart-container">
    <div class="header">
      <div class="title">请求趋势</div>
      <div class="time-controls">
        <el-button
            size="small"
            :type="activeTimeRange === 'hour' ? 'primary' : 'default'"
            @click="selectTimeRange('hour')"
        >
          近一小时
        </el-button>
        <el-button
            size="small"
            :type="activeTimeRange === 'today' ? 'primary' : 'default'"
            @click="selectTimeRange('today')"
        >
          今天
        </el-button>
        <el-button
            size="small"
            :type="activeTimeRange === 'yesterday' ? 'primary' : 'default'"
            @click="selectTimeRange('yesterday')"
        >
          昨天
        </el-button>
        <el-button
            size="small"
            :type="activeTimeRange === '7days' ? 'primary' : 'default'"
            @click="selectTimeRange('7days')"
        >
          近7天
        </el-button>
      </div>
    </div>
    <div ref="chartRef" id="request-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.chart-container {
  padding: 10px;
  background: transparent;

  #request-chart {
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