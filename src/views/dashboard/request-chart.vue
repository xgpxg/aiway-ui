<script setup>import * as echarts from 'echarts';
import {onMounted} from "vue";

onMounted(() => {
  initChart()
})

const initChart = () => {
  const chartDom = document.getElementById('request-chart');
  const myChart = echarts.init(chartDom);
  const option = {
    title: {
      text: '请求趋势',
      left: 'left',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    legend: {
      top: '5%',
      right: '25%',
      data: ['累计请求', '2xx', '3xx', '4xx', '5xx']
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      name: '时间',
      nameLocation: 'middle',
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      name: '请求数',
      nameLocation: 'middle',
      nameGap: 30,
    },
    series: [
      {
        name: '累计请求',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1290, 1330, 2120],
        lineStyle: {
          color: '#409eff'
        },
        areaStyle: {
          opacity: 0.1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#409eff'},
            {offset: 1, color: '#b3d8ff'}
          ])
        }
      },
      {
        name: '2xx',
        type: 'line',
        smooth: true,
        data: [780, 890, 850, 880, 1200, 1250, 1240],
        lineStyle: {
          color: '#67c23a'
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#67c23a'},
            {offset: 1, color: '#b3e880'}
          ])
        }
      },
      {
        name: '3xx',
        type: 'line',
        smooth: true,
        data: [20, 25, 30, 35, 60, 55, 350],
        lineStyle: {
          color: '#9d7cf1'
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#9d7cf1'},
            {offset: 1, color: '#eae7f4'}
          ])
        }
      },
      {
        name: '4xx',
        type: 'line',
        smooth: true,
        data: [10, 15, 18, 12, 20, 18, 1125],
        lineStyle: {
          color: '#f5856c'
        },
        areaStyle: {
          opacity: 0.4,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#f5856c'},
            {offset: 1, color: '#fdeee8'}
          ])
        }
      },
      {
        name: '5xx',
        type: 'line',
        smooth: true,
        data: [10, 12, 15, 10, 15, 10, 333],
        lineStyle: {
          color: '#f12727'
        },
        areaStyle: {
          opacity: 0.6,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#f12727'},
            {offset: 1, color: '#ffaaaa'}
          ])
        }
      }
    ],
    grid: {
      top: '22%',
      left: '1%',
      right: '1%',
      bottom: '5%',
    }
  };

  option && myChart.setOption(option);
}
</script>

<template>
  <div class="card">
    <div class="operate">
      <div class="content">
        <el-select style="width: 120px">
          <el-option label="近1小时" value="1"></el-option>
          <el-option label="今天" value="1"></el-option>
          <el-option label="本月" value="3"></el-option>
          <el-option label="今年" value="4"></el-option>
        </el-select>
      </div>
    </div>
    <div id="request-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  #request-chart {
    height: 300px;
    width: 100%;
  }

  .operate {
    position: relative;
    z-index: 1;

    .content {
      position: absolute;
      right: 0;
      top: 10px;
    }
  }
}

</style>