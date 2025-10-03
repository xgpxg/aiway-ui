<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {R} from "@/utils/R";

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
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="card">
          <div class="title">
            今日请求数：<span class="number">{{ state.request_today_count}}</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>累计：{{ state.request_count }}</el-text>
              <el-text>异常(5xx)：{{ state.response_5xx_count }}</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="title">
            当前连接数：<span class="number">{{ state.http_connect_count}}</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>平均QPS：{{ state.avg_qps }}</el-text>
              <el-text>短连接：11</el-text>
              <el-text>SSE：21</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="title">
            失败响应数：<span class="number">{{ state.response_4xx_count + state.response_5xx_count}}</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text type="warning">4xx：{{ state.response_4xx_count}}</el-text>
              <el-text type="danger">5xx：{{ state.response_5xx_count}}</el-text>
              <el-text>拦截：213</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="title">
            网关状态：正常
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>共 {{ state.node_count }} 个节点</el-text>
              <el-text>{{ state.online_node_count }} 运行中</el-text>
              <el-text>{{ state.offline_node_count }} 离线</el-text>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;

    .number {
      font-size: 16px;
      color: var(--el-color-primary);
    }
  }

  .content {
    margin-top: 10px;
  }

}
</style>