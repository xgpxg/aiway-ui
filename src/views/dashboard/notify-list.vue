<script setup lang="ts">
import {ref} from 'vue'

interface NotifyItem {
  id: number
  title: string
  content: string
  time: string
  type: 'info' | 'warning' | 'error'
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
    type: 'warning'
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
    type: 'warning'
  },
  {
    id: 5,
    title: '系统维护完成',
    content: '网关系统例行维护已完成，所有节点均已恢复正常运行。本次维护更新了安全补丁并优化了部分核心组件性能。',
    time: '2025-11-14 13:45:12',
    type: 'info'
  }
])

// 格式化内容显示，超长显示省略号
const formatContent = (content: string, maxLength: number = 60): string => {
  if (content.length <= maxLength) {
    return content
  }
  return content.substring(0, maxLength) + '...'
}
</script>

<template>
  <div class="notify-container">
    <div class="card">
      <div class="title">网关事件</div>

      <div class="notify-list">
        <div
            v-for="item in notifications"
            :key="item.id"
            class="notify-item"
            :class="item.type"
        >
          <div class="notify-header">
            <div class="notify-title" :class="item.type">{{ item.title }}</div>
            <div class="notify-time">{{ item.time }}</div>
          </div>

          <div class="notify-content">
            <el-text truncated>{{ formatContent(item.content) }}</el-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notify-container {

}

.card {
  border-radius: 6px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #303133;
  }
}

.notify-list {
  .notify-item {
    padding: 12px 0;
    border-bottom: 1px dashed #f0f0f0;

    &:last-child {
      border-bottom: none;
    }


    .notify-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;

      .notify-title {
        font-size: 14px;
        font-weight: 500;

        &.error {
          color: #f56c6c;
        }

        &.warning {
          color: #e6a23c;
        }

        &.info {
          color: #409eff;
        }
      }

      .notify-time {
        font-size: 12px;
        color: #909399;
        margin-left: 10px;
        white-space: nowrap;
      }
    }

    .notify-content {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }
  }
}
</style>