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
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="card">
          <div class="flex-space-between">
            <div class="title">
              <svg-icon icon-class="request-count" size="16" class="mr5"></svg-icon>
              今日请求数
            </div>
            <span class="number">{{ state.request_today_count.toLocaleString() }}</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text size="small">累计：{{ U.simplifyNum(state.request_count, true) }}</el-text>
              <el-text size="small" type="danger" class="cursor-pointer">
                异常：{{ state.response_5xx_count.toLocaleString() }}
              </el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="flex-space-between">
            <div class="title">
              <svg-icon icon-class="connect-count" size="16" class="mr5"></svg-icon>
              当前连接数
            </div>
            <span class="number">{{ state.http_connect_count.toLocaleString() }}</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text size="small">短连接：11</el-text>
              <el-text size="small">SSE：21</el-text>
              <el-text size="small">平均QPS：{{ state.avg_qps.toLocaleString() }}</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="flex-space-between">
            <div class="title">
              <svg-icon icon-class="avg-response-time" size="16" class="mr5"></svg-icon>
              平均响应时间
            </div>
            <div>
              <span class="number"> {{ state.avg_response_time.toLocaleString() }}</span>
              <el-text type="info" class="ml10">ms</el-text>
            </div>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text size="small">网关响应：5 ms</el-text>
              <el-text size="small">服务响应：20 ms</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="flex-space-between">
            <div class="title">
              <svg-icon icon-class="gateway-status" size="16" class="mr5"></svg-icon>
              网关状态
            </div>
            <span>正常</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text size="small">共 {{ state.node_count.toLocaleString() }} 个节点</el-text>
              <el-text size="small">{{ state.online_node_count.toLocaleString() }} 运行中</el-text>
              <el-text size="small">{{ state.offline_node_count.toLocaleString() }} 离线</el-text>
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
  border-radius: 6px;

  .title {
    font-size: 14px;
    margin-bottom: 10px;
    color: #494949;
  }

  .number {
    font-size: 20px;
    color: #202020;
    padding: 0;
  }

  .content {
    margin-top: 10px;

    .el-text {

    }
  }

}
</style>