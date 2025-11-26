<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import {ElButton, ElTabs, ElTabPane, ElBadge, ElEmpty, ElTag} from 'element-plus'
import {R} from "@/utils/R";
import SvgIcon from "../../components/SvgIcon/index.vue";

interface Message {
  id: number
  title: string
  content: string
  create_time: string
  level: 'Info' | 'Warn' | 'Error'
  read_status: 'Unread' | 'Read'
}

const activeTab = ref('all')
const messages = ref<Message[]>([])
const form = ref({
  level: null
})

const page = ref({
  page_num: 1,
  page_size: 5,
  total: 0
})

const unreadCounts = ref({
  all: 0,
  info: 0,
  warn: 0,
  error: 0
})

onMounted(() => {
  loadMessages()
})
const loadMessages = () => {
  R.postJson('/api/message/list', {
    page: page.value,
    level: form.value.level
  }).then((res: any) => {
    if (res.code === 0) {
      messages.value = res.data.list
      page.value.total = res.data.total
      unreadCounts.value = {
        all: res.data.ext.unread_count.info + res.data.ext.unread_count.warn + res.data.ext.unread_count.error,
        info: res.data.ext.unread_count.info,
        warn: res.data.ext.unread_count.warn,
        error: res.data.ext.unread_count.error
      }
    }
  })
}

// 标记消息为已读
const markAsRead = (message: Message) => {
  if (message.read_status === 'Read') {
    return
  }
  R.postJson('/api/message/read', {
    id: message.id
  }).then((res: any) => {
    if (res.code === 0) {
      loadMessages()
    }
  })
}

const markAllAsRead = () => {
  R.postJson('/api/message/read', {
    id: -1
  }).then((res: any) => {
    if (res.code === 0) {
      loadMessages()
    }
  })
}


watch(activeTab, (newVal) => {
  form.value.level = newVal === 'all' ? null : newVal
  loadMessages()
})

// 删除消息
const deleteMessage = (id: number) => {
  // TODO
}

defineExpose({
  loadMessages
})
</script>

<template>
  <div class="message-container">
    <el-tabs v-model="activeTab" class="message-tabs" stretch>
      <el-tab-pane name="all">
        <template #label>
          <el-badge :value="unreadCounts.all" :max="99" :hidden="unreadCounts.all === 0" type="primary">
            <span>全部</span>
          </el-badge>
        </template>
      </el-tab-pane>

      <el-tab-pane name="Error">
        <template #label>
          <el-badge :value="unreadCounts.error" :max="99" :hidden="unreadCounts.error === 0" type="danger">
            <span> 错误 </span>
          </el-badge>
        </template>
      </el-tab-pane>

      <el-tab-pane name="Warn">
        <template #label>
          <el-badge :value="unreadCounts.warn" :max="99" :hidden="unreadCounts.warn === 0" type="warning">
            <span> 警告 </span>
          </el-badge>
        </template>
      </el-tab-pane>


      <el-tab-pane name="Info">
        <template #label>
          <el-badge :value="unreadCounts.info" :max="99" :hidden="unreadCounts.info === 0" type="info">
            <span> 提醒 </span>
          </el-badge>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="message-content">
      <div v-if="messages.length === 0" class="empty flex-column-v">
        <svg-icon icon-class="empty2" size="100"></svg-icon>
        <el-text type="info">暂无消息</el-text>
      </div>

      <div v-else class="message-list">
        <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-item"
            :class="{ 'unread': msg.read_status === 'Unread' }"
            @click="markAsRead(msg)"
        >
          <div class="message-header">
            <div class="message-title">
              <el-tag
                  :type="msg.level === 'Info' ? 'primary' : msg.level === 'Warn' ? 'warning' : 'danger'"
                  size="small" disable-transitions
              >
                {{ msg.level === 'Info' ? '提醒' : msg.level === 'Warn' ? '警告' : '错误' }}
              </el-tag>
              <span class="title-text">{{ msg.title }}</span>
            </div>
            <div class="message-actions">
              <span class="message-time">{{ msg.create_time }}</span>
              <el-button
                  type="info"
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
      <el-pagination
          background
          layout="prev, pager, next, total"
          :page-size="page.page_size"
          :current-page="page.page_num"
          :total="page.total"
          hide-on-single-page
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadMessages()}"
          class="mt10 fr">
      </el-pagination>
    </div>

    <div class="message-footer" v-if="messages.length > 0">
      <el-button type="primary" link @click="markAllAsRead">
        全部标记为已读
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-container {
  height: 510px;
  display: flex;
  flex-direction: column;

  .message-tabs {
    :deep(.el-tabs__header) {
      margin: 0;

      .el-tabs__nav-wrap::after {
        height: 1px;
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

        &.unread {
          background-color: var(--el-color-primary-light-11);
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
