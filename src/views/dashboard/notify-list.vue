<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {R} from "@/utils/R";
import {Search} from "@element-plus/icons-vue";

interface Message {
  id: number
  title: string
  content: string
  create_time: string
  level: 'Info' | 'Warn' | 'Error'
  read_status: 'Unread' | 'Read'
}

const activeTab = ref('all')
const keyword = ref('')
const messages = ref<Message[]>([])
const form = ref({level: null as string | null})
const page = ref({page_num: 1, page_size: 10, total: 0})

const levelMap: Record<string, { label: string; type: string }> = {
  Error: {label: '错误', type: 'danger'},
  Warn: {label: '警告', type: 'warning'},
  Info: {label: '提醒', type: 'primary'},
}

onMounted(() => {
  loadMessages()
})

const loadMessages = () => {
  R.postJson('/api/message/list', {
    page: page.value,
    level: form.value.level,
    filter_text: keyword.value || undefined
  }).then((res: any) => {
    if (res.code === 0) {
      messages.value = res.data.list
      page.value.total = res.data.total
    }
  })
}

const markAsRead = (msg: Message) => {
  if (msg.read_status === 'Read') return
  R.postJson('/api/message/read', {id: msg.id}).then(res => {
    if (res.code === 0) loadMessages()
  })
}

const markAllAsRead = () => {
  R.postJson('/api/message/read', {id: -1}).then(res => {
    if (res.code === 0) loadMessages()
  })
}

const onSearch = () => {
  page.value.page_num = 1
  loadMessages()
}

const onTabChange = (val: string) => {
  form.value.level = val === 'all' ? null : val
  page.value.page_num = 1
  loadMessages()
}

const handlePageChange = (pageNum: number) => {
  page.value.page_num = pageNum
  loadMessages()
}
</script>

<template>
  <div>
    <div class="">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-radio-group v-model="activeTab" @change="onTabChange">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="Error">错误</el-radio-button>
            <el-radio-button value="Warn">警告</el-radio-button>
            <el-radio-button value="Info">提醒</el-radio-button>
          </el-radio-group>
          <el-input
              v-model="keyword"
              placeholder="搜索标题或内容"
              clearable
              style="width: 220px; margin-left: 16px"
              @keyup.enter="onSearch"
              @clear="onSearch"
          >
            <template #prefix>
              <el-icon>
                <Search/>
              </el-icon>
            </template>
          </el-input>
          <el-button type="primary" style="margin-left: 8px" @click="onSearch" icon="search">搜索</el-button>
        </div>
        <el-button type="primary" link @click="markAllAsRead">全部标记为已读</el-button>
      </div>

      <el-table :data="messages" stripe empty-text="暂无通知" @row-click="markAsRead">
        <el-table-column label="级别" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="levelMap[row.level]?.type" disable-transitions>
              {{ levelMap[row.level]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="content" label="内容" min-width="300" show-overflow-tooltip/>
        <el-table-column prop="create_time" label="时间" width="170" align="center"/>
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-text :type="row.read_status === 'Unread' ? 'warning' : 'info'">
              {{ row.read_status === 'Unread' ? '未读' : '已读' }}
            </el-text>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap" v-if="page.total > 0">
        <el-pagination
            background
            layout="prev, pager, next, total"
            :page-size="page.page_size"
            :current-page="page.page_num"
            :total="page.total"
            pager-count="5"
            hide-on-single-page
            @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .toolbar-left {
    display: flex;
    align-items: center;
  }
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style>
