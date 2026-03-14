<script setup>
import {computed, inject, onMounted, ref} from 'vue'
import {R} from '@/utils/R'
import {useRoute} from 'vue-router'

const route = useRoute()
const mcpServer = inject('mcpServer')

// 工具列表相关
const toolList = ref([])
const filterText = ref('')
const loading = ref(false)
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})

// 过滤后的工具列表
const filteredToolList = computed(() => {
  return toolList.value.filter(item => item.name.includes(filterText.value))
})

// 代理配置相关
const showProxyConfigDialog = ref(false)
const proxyConfigForm = ref({
  url: '',
  headers: []
})
const toolFormRef = ref()

// 表单验证规则
const rules = {
  url: [
    {required: true, message: '请填写目标服务地址', trigger: 'blur'},
    {min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur'}
  ]
}

onMounted(() => {
  loadTools()
})

/**
 * 加载工具列表
 */
const loadTools = () => {
  R.postJson('/api/mcp/tool/list', {
    page: page.value,
    mcp_server_id: Number(route.params.mcpServiceId)
  }).then((res) => {
    toolList.value = res.data.list
    page.value.total = res.data.total
  })
}

/**
 * 打开代理配置对话框
 */
const openProxyConfigDialog = () => {
  const proxyConfig = mcpServer.value.proxy_config
  if (!proxyConfig) {
    proxyConfigForm.value = {
      url: '',
      headers: []
    }
  } else {
    proxyConfigForm.value.url = proxyConfig.url
    proxyConfigForm.value.headers = proxyConfig.headers
        ? Object.entries(proxyConfig.headers).map(([name, value]) => ({name, value}))
        : []
  }
  showProxyConfigDialog.value = true
}

/**
 * 切换工具状态
 * @param {Object} row - 工具数据
 * @param {string} newStatus - 新状态
 */
const toggleStatus = (row, newStatus) => {
  R.postJson('/api/mcp/tool/update_status', {
    id: row.id,
    status: newStatus
  }).then((res) => {
    if (res.code === 0) {
      loadTools()
    }
  })
}

/**
 * 更新 MCP 服务器配置
 */
const updateMcpServer = () => {
  toolFormRef.value.validate().then(() => {
    const headersMap = {}
    proxyConfigForm.value.headers.forEach(item => {
      if (item.name && item.value) {
        headersMap[item.name] = item.value
      }
    })

    R.postJson('/api/mcp/server/update', {
      id: Number(route.params.mcpServiceId),
      proxy_config: {
        url: proxyConfigForm.value.url,
        headers: headersMap
      }
    }).then((res) => {
      if (res.code === 0) {
        showProxyConfigDialog.value = false
        mcpServer.value.proxy_config = {
          url: proxyConfigForm.value.url,
          headers: headersMap
        }
      }
    })
  })
}

/**
 * 同步服务器工具
 */
const syncServerTools = () => {
  loading.value = true
  R.postJson('/api/mcp/server/sync_proxy_server_tools', {
    id: route.params.mcpServiceId
  }).then((res) => {
    if (res.code === 0) {
      loadTools()
    }
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="flex mb10">
    <el-input v-model="filterText" placeholder="工具名称" prefix-icon="Search" clearable/>
    <el-button class="ml10" icon="Refresh" @click="loadTools"/>
    <el-button type="primary" class="ml10" icon="Setting" @click="openProxyConfigDialog">代理配置</el-button>
    <el-button type="primary" class="ml10" icon="Refresh" @click="syncServerTools" :loading="loading">同步 Tools
    </el-button>
  </div>

  <div>
    <div class="mt10">
      <el-table class="mt10" :data="filteredToolList">
        <el-table-column prop="name" label="工具名称" min-width="100" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="工具描述" min-width="300" show-overflow-tooltip/>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.status" active-value="Ok" inactive-value="Disable"
                       @change="toggleStatus(row, $event)" active-text="启用" inactive-text="停用" inline-prompt/>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="showProxyConfigDialog" width="500px" title="MCP 代理">
    <el-form ref="toolFormRef" :model="proxyConfigForm" :rules="rules" label-width="100px">
      <el-form-item label="URL" prop="url">
        <el-input v-model="proxyConfigForm.url" placeholder="请填写目标服务地址，仅支持 Streamable HTTP 模式"/>
      </el-form-item>
      <el-form-item label="Headers" prop="headers">
        <el-button type="primary" @click="proxyConfigForm.headers.push({ name: '', value: '' })" class="mb10">添加
        </el-button>
        <div v-for="(item, index) in proxyConfigForm.headers" :key="index" class="flex-space-between fill-width mb10">
          <el-input v-model="item.name" placeholder="Header 名称"/>
          <span class="ml5 mr5">-</span>
          <el-input v-model="item.value" placeholder="Header 值"/>
          <el-button text type="danger" icon="Minus" @click="proxyConfigForm.headers.splice(index, 1)"
                     class="ml5"></el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showProxyConfigDialog = false">取消</el-button>
      <el-button type="primary" @click="updateMcpServer">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>