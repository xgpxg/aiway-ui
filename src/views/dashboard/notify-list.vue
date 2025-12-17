<script setup lang="ts">
import {ref} from 'vue'

interface NotifyItem {
  id: number
  title: string
  content: string
  time: string
  type: 'info' | 'warn' | 'error'
}

const notifications = ref<NotifyItem[]>([
  {
    id: 1,
    title: '服务异常告警',
    content: '用户服务在过去的5分钟内出现30次异常调用，异常率超过阈值，请及时处理。建议检查服务日志，定位问题根源并采取相应措施。',
    time: '2025-11-14 14:30:25',
    type: 'error'
  },
  {
    id: 2,
    title: '性能下降提醒',
    content: '订单服务响应时间从平均100ms上升到800ms，性能下降明显。可能由于数据库连接池不足或查询语句需要优化。',
    time: '2025-11-14 14:25:10',
    type: 'warn'
  },
  {
    id: 3,
    title: '新服务上线通知',
    content: '商品推荐服务已成功上线并接入网关，该服务提供个性化商品推荐功能，支持实时推荐和批量推荐两种模式。',
    time: '2025-11-14 14:15:42',
    type: 'info'
  },
  {
    id: 4,
    title: '安全风险提示',
    content: '检测到多次来自特定IP的异常访问请求，疑似恶意扫描行为。系统已自动将该IP加入观察名单，建议安全团队关注。',
    time: '2025-11-14 14:10:33',
    type: 'warn'
  },
  {
    id: 5,
    title: '系统维护完成',
    content: '网关系统例行维护已完成，所有节点均已恢复正常运行。本次维护更新了安全补丁并优化了部分核心组件性能。',
    time: '2025-11-14 13:45:12',
    type: 'info'
  }
])

</script>

<template>
  <div class="notify-container">
    <div class="card">
      <div class="title">网关事件</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div v-for="item in notifications.filter(item => item.type === 'info')">
            <el-text size="large">{{item.title}}</el-text>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notify-container {
  width: 100%;
}

.card {
  border-radius: 6px;
  background: #ffffff;
  padding: 20px;

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #303133;
  }
}

</style>