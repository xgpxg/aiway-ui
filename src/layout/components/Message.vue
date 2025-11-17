<script setup lang="ts">
import {ref, computed} from 'vue'
import {ElButton, ElIcon, ElTabs, ElTabPane, ElBadge, ElEmpty, ElTag} from 'element-plus'
import {Bell, Warning, InfoFilled, CircleClose} from '@element-plus/icons-vue'

interface Message {
  id: number
  title: string
  content: string
  time: string
  type: 'info' | 'warning' | 'error'
  read: boolean
}

const activeTab = ref('all')

// 模拟消息数据
const messages = ref<Message[]>([
  {
    id: 1,
    title: '系统通知',
    content: '您的账户在另一地点登录，如非本人操作请及时修改密码。您的账户在另一地点登录，如非本人操作请及时修改密码。',
    time: '2025-11-17 14:30',
    type: 'warning',
    read: false
  },
  {
    id: 2,
    title: '系统维护',
    content: '系统将于今晚00:00-02:00进行例行维护，届时服务可能会短暂中断。',
    time: '2025-11-17 10:15',
    type: 'info',
    read: false
  },
  {
    id: 3,
    title: '安全警告',
    content: '检测到多次登录尝试失败，系统已临时锁定您的账户30分钟。',
    time: '2025-11-17 09:20',
    type: 'error',
    read: true
  },
  {
    id: 4,
    title: '功能更新',
    content: '新版本API网关已发布，新增负载均衡策略和熔断机制。',
    time: '2025-11-16 16:45',
    type: 'info',
    read: false
  },
  {
    id: 5,
    title: '性能提醒',
    content: '当前系统负载较高，建议优化资源配置或增加节点。',
    time: '2025-11-16 14:20',
    type: 'warning',
    read: true
  },
  {
    id: 6,
    title: '紧急错误',
    content: '数据库连接异常，已自动切换至备用节点，请尽快处理主节点问题。',
    time: '2025-11-16 11:30',
    type: 'error',
    read: false
  }
])

// 计算未读消息数量
const unreadCounts = computed(() => {
  return {
    all: messages.value.filter(msg => !msg.read).length,
    info: messages.value.filter(msg => msg.type === 'info' && !msg.read).length,
    warning: messages.value.filter(msg => msg.type === 'warning' && !msg.read).length,
    error: messages.value.filter(msg => msg.type === 'error' && !msg.read).length
  }
})

// 获取当前标签页的消息
const currentMessages = computed(() => {
  if (activeTab.value === 'all') {
    return messages.value
  }
  return messages.value.filter(msg => msg.type === activeTab.value)
})

// 标记消息为已读
const markAsRead = (id: number) => {
  const message = messages.value.find(msg => msg.id === id)
  if (message) {
    message.read = true
  }
}

// 标记所有消息为已读
const markAllAsRead = () => {
  messages.value.forEach(msg => {
    msg.read = true
  })
}

// 删除消息
const deleteMessage = (id: number) => {
  messages.value = messages.value.filter(msg => msg.id !== id)
}
</script>

<template>
  <div class="message-container">
    <el-tabs v-model="activeTab" class="message-tabs" stretch>
      <el-tab-pane name="all">
        <template #label>
          <el-badge :value="unreadCounts.all" :max="99" :hidden="unreadCounts.all === 0" type="primary">
            <span>全部消息</span>
          </el-badge>
        </template>
      </el-tab-pane>

      <el-tab-pane name="error">
        <template #label>
          <el-badge :value="unreadCounts.error" :max="99" :hidden="unreadCounts.error === 0" type="danger">
            <span>
              错误
            </span>
          </el-badge>
        </template>
      </el-tab-pane>

      <el-tab-pane name="warning">
        <template #label>
          <el-badge :value="unreadCounts.warning" :max="99" :hidden="unreadCounts.warning === 0" type="warning">
            <span>
              警告
            </span>
          </el-badge>
        </template>
      </el-tab-pane>


      <el-tab-pane name="info">
        <template #label>
          <el-badge :value="unreadCounts.info" :max="99" :hidden="unreadCounts.info === 0" type="info">
            <span>
              提醒
            </span>
          </el-badge>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="message-content">
      <div v-if="currentMessages.length === 0" class="empty">
        <el-empty description="暂无消息"/>
      </div>

      <div v-else class="message-list">
        <div
            v-for="msg in currentMessages"
            :key="msg.id"
            class="message-item"
            :class="{ 'unread': !msg.read }"
            @click="markAsRead(msg.id)"
        >
          <div class="message-header">
            <div class="message-title">
              <el-tag
                  :type="msg.type === 'info' ? 'primary' : msg.type === 'warning' ? 'warning' : 'danger'"
                  size="small"
              >
                {{ msg.type === 'info' ? '提醒' : msg.type === 'warning' ? '警告' : '错误' }}
              </el-tag>
              <span class="title-text">{{ msg.title }}</span>
            </div>
            <div class="message-actions">
              <span class="message-time">{{ msg.time }}</span>
              <el-button
                  type="danger"
                  link
                  size="small"
                  @click.stop="deleteMessage(msg.id)"
              >
                删除
              </el-button>
            </div>
          </div>

          <div class="message-body">
            {{ msg.content }}
          </div>
        </div>
      </div>
    </div>

    <div class="message-footer" v-if="currentMessages.length > 0">
      <el-button type="primary" link @click="markAllAsRead">
        全部标记为已读
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-container {
  height: 550px;
  display: flex;
  flex-direction: column;

  .message-tabs {
    :deep(.el-tabs__header) {
      margin: 0;

      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }

    :deep(.el-tabs__item) {
      font-size: 14px;
      font-weight: normal;

      &.is-active {
        font-weight: bold;
      }
    }

    :deep(.el-badge) {
      .el-badge__content {
        top: 11px;
        right: -8px;
      }
    }
  }

  .message-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;

    .empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .message-list {
      .message-item {
        padding: 12px 16px;
        border-bottom: 1px solid var(--el-border-color-light);
        cursor: pointer;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        &.unread {
          background-color: var(--el-color-primary-light-9);
          //border-left: 3px solid var(--el-color-primary);

          &:hover {
            background-color: var(--el-color-primary-light-8);
          }
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .message-title {
            display: flex;
            align-items: center;
            gap: 8px;

            .title-text {
              font-weight: 500;
              font-size: 14px;
            }
          }

          .message-actions {
            display: flex;
            align-items: center;
            gap: 12px;

            .message-time {
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
        }

        .message-body {
          font-size: 13px;
          color: var(--el-text-color-regular);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
      }
    }
  }

  .message-footer {
    flex-shrink: 0;
    padding: 12px 16px;
    border-top: 1px solid var(--el-border-color-light);
    text-align: center;
  }
}
</style>
