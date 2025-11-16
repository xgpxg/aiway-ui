<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {R} from "@/utils/R";
import {U} from "@/utils/util";
import SvgIcon from "../../components/SvgIcon/index.vue";

const state = ref({
  node_count: 0,
  online_node_count: 0,
  offline_node_count: 0,
  request_today_count: 0,
  request_count: 0,
  request_invalid_count: 0,
  response_2xx_count: 0,
  response_3xx_count: 0,
  response_4xx_count: 0,
  response_5xx_count: 0,
  http_connect_count: 0,
  avg_response_time: 0,
  avg_qps: 0,
})

onMounted(() => {
  loadState()
})

const loadState = () => {
  R.get('/api/metrics/gateway/state').then(res => {
    state.value = res.data
  })
}

const timer = setInterval(() => {
  loadState()
}, 3000)
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <div class="card">
        <div class="title">
          节点状态
        </div>
        <div class="mt5">
          <div>
            <span class="number success">{{ state.online_node_count.toLocaleString() }}</span>
            <el-text type="info" size="small" class="ml5  mr5">运行中</el-text>
            <el-text type="info" size="large" class="ml5  mr5">/</el-text>
            <span class="number">{{ state.node_count.toLocaleString() }}</span>
            <el-text type="info" size="small" class="ml5  mr5">个节点</el-text>
          </div>
        </div>
        <div class="mt5">
          <el-text size="small">7个节点异常，请关注</el-text>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card">
        <div class="title">
          <el-text type="info" size="small">
            连接状态
          </el-text>
        </div>
        <div class="mt5">
          <div>
            <span class="number">{{ state.http_connect_count.toLocaleString() }}</span>
            <el-text type="info" size="small" class="ml10">个连接</el-text>
          </div>
        </div>
        <div class="flex-space-between mt5">
          <div>
            <el-text size="small" type="info">HTTP：</el-text>
            <el-text size="small" type="info">203,00</el-text>
          </div>
          <div>
            <el-text size="small" type="info">SSE：</el-text>
            <el-text size="small" type="info">312</el-text>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card">
        <div class="title">
          <el-text type="info" size="small">
            性能指标
          </el-text>
        </div>
        <div class="mt5">
          <div>
            <span class="number">{{ state.avg_qps.toLocaleString() }}</span>
            <el-text type="info" size="small" class="ml10">QPS</el-text>
          </div>
        </div>
        <div class="flex-space-between mt5">
          <div>
            <el-text size="small" type="info">ART：</el-text>
            <el-text size="small" type="info">{{ state.avg_response_time.toLocaleString() }} ms</el-text>
          </div>
          <div>
            <el-text size="small" type="info">IN：</el-text>
            <el-text size="small" type="info">103 MB</el-text>
          </div>
          <div>
            <el-text size="small" type="info">OUT：</el-text>
            <el-text size="small" type="info">1.12 GB</el-text>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card">
        <div class="title">
          <el-text type="info" size="small">
            预警和通知
          </el-text>
        </div>
        <div class="mt5">
          <div class="flex-space-between">
            <div>
              <span class="number error">2</span>
              <el-text type="info" size="small" class="ml10">错误</el-text>
            </div>
            <div>
              <span class="number warning">1</span>
              <el-text type="info" size="small" class="ml10">警告</el-text>
            </div>
            <div>
              <span class="number info">42</span>
              <el-text type="info" size="small" class="ml10">提醒</el-text>
            </div>
          </div>
        </div>
        <div class="mt5">
          <el-text size="small" type="danger" truncated>
            用户服务在过去的5分钟内出现30次异常调用，异常率超过阈值，请及时处理。建议检查服务日志，定位问题根源并采取相应措施。
          </el-text>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.card {
  //border: 1px solid #f0f0f0;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px 20px;
  //box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: var(--el-font-size-extra-small);
    color: var(--el-text-color-secondary)
  }
}

.number {
  font-size: 20px;
  font-weight: 600;

  &.info {
    color: var(--el-color-primary);
  }

  &.success {
    color: #67c23a;
  }

  &.warning {
    color: #e6a23c;
  }

  &.error {
    color: #f56c6c;
  }
}

</style>