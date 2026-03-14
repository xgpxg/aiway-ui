<script setup>
import {computed, onMounted, ref} from 'vue'
import {R} from '@/utils/R'
import HttpParamTable from './api-param-table.vue'
import {ElMessageBox} from 'element-plus'
import {useRoute} from 'vue-router'
import ServiceSelect from '../service/service-select.vue'
import ApiParamTable from "./api-param-table.vue";

const route = useRoute()

// 工具列表相关
const toolList = ref([])
const filterText = ref('')
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})

// 过滤后的工具列表
const filteredToolList = computed(() => {
  return toolList.value.filter(item => item.name.includes(filterText.value))
})

// 表单相关
const showToolAddDialog = ref(false)
const showToolRouteDialog = ref(false)
const currTool = ref(null)
const paramForm = ref([])
const paramSchema = ref({})
const toolForm = ref({
  name: '',
  description: '',
  route_type: 'Service',
  service_name: '',
  service_path: '',
  url: '',
  method: 'GET'
})
const toolFormRef = ref()

// 表单验证规则
const rules = {
  name: [
    {required: true, message: '请填写工具名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 100 个字符', trigger: 'blur'}
  ],
  description: [
    {required: true, message: '请填写工具描述', trigger: 'blur'},
    {min: 2, max: 100, message: '长度在 2 到 500 个字符', trigger: 'blur'}
  ],
  route_type: [
    {required: true, message: '请选择路由类型', trigger: 'change'}
  ],
  service_name: [
    {required: true, message: '请选择服务', trigger: 'blur'},
    {min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur'}
  ],
  url: [
    {required: true, message: '请填写目标服务地址', trigger: 'blur'},
    {min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur'}
  ],
  method: [
    {required: true, message: '请选择请求方法', trigger: 'blur'},
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
 * 保存工具
 */
const saveTool = () => {
  toolFormRef.value.validate().then(() => {
    R.postJson('/api/mcp/tool/add', {
      mcp_server_id: Number(route.params.mcpServiceId),
      name: toolForm.value.name,
      description: toolForm.value.description,
      route_type: 'Service'
    }).then(() => {
      showToolAddDialog.value = false
      loadTools()
    })
  })
}

/**
 * 删除工具
 * @param {Object} row - 工具数据
 */
const deleteTool = (row) => {
  ElMessageBox.confirm('确认删除该工具？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    R.postJson('/api/mcp/tool/delete', {
      ids: [row.id]
    }).then(() => {
      loadTools()
    })
  })
}

/**
 * 打开工具路由对话框
 * @param {Object} tool - 工具数据
 */
const openToolRouteDialog = (tool) => {
  currTool.value = tool
  toolForm.value = tool
  paramForm.value = tool.request_param || []
  paramSchema.value = tool.input_schema || {}
  showToolRouteDialog.value = true
}

/**
 * 更新 API 参数
 */
const updateHttpParam = () => {
  toolFormRef.value.validate().then(() => {
    R.postJson('/api/mcp/tool/update', {
      id: currTool.value.id,
      route_type: toolForm.value.route_type,
      service_name: toolForm.value.service_name,
      service_path: toolForm.value.service_path,
      url: toolForm.value.url,
      method: toolForm.value.method,
      request_param: paramForm.value,
      input_schema: paramSchema.value
    }).then(() => {
      showToolRouteDialog.value = false
      loadTools()
    })
  })
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
</script>

<template>
  <div class="flex mb10">
    <el-input v-model="filterText" placeholder="工具名称" prefix-icon="Search" clearable/>
    <el-button class="ml10" icon="Refresh" @click="loadTools"/>
    <el-button type="primary" class="ml10" icon="Plus" @click="showToolAddDialog = true">添加工具</el-button>
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
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="openToolRouteDialog(row)">路由</el-button>
            <el-button link type="danger" @click="deleteTool(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="showToolAddDialog" width="500px" title="添加工具">
    <el-form ref="toolFormRef" :model="toolForm" :rules="rules" label-width="100px">
      <el-form-item label="工具名称" prop="name">
        <el-input v-model="toolForm.name" placeholder="请填写工具名称，仅支持英文和数字，以及下划线和中划线"/>
      </el-form-item>
      <el-form-item label="工具描述" prop="description">
        <el-input v-model="toolForm.description" type="textarea" :rows="3"
                  placeholder="请准确描述工具的主要功能"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showToolAddDialog = false">取消</el-button>
      <el-button type="primary" @click="saveTool">添加</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="showToolRouteDialog" width="50vw" title="工具路由">
    <el-form ref="toolFormRef" :model="toolForm" label-width="80px" :rules="rules">
      <el-form-item label="目标服务" prop="route_type" required>
        <el-radio-group v-model="toolForm.route_type">
          <el-radio-button value="Service">已有服务</el-radio-button>
          <el-radio-button value="Url">指定 URL</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="toolForm.route_type === 'Service'" label="目标服务" prop="service_name">
        <div class="flex-v fill-width">
          <service-select v-model="toolForm.service_name" style="width: 200px"/>
          <el-input v-model="toolForm.service_path" placeholder="路径" class="ml10"/>
        </div>
      </el-form-item>
      <el-form-item v-if="toolForm.route_type === 'Url'" label="目标地址" prop="url">
        <el-input v-model="toolForm.url" placeholder="指定接口地址，工具将自动请求该地址"/>
      </el-form-item>
      <el-form-item label="请求方法" prop="method">
        <el-radio-group v-model="toolForm.method">
          <el-radio-button value="GET">GET</el-radio-button>
          <el-radio-button value="POST">POST</el-radio-button>
          <el-radio-button value="PUT">PUT</el-radio-button>
          <el-radio-button value="PATCH">PATCH</el-radio-button>
          <el-radio-button value="DELETE">DELETE</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <api-param-table v-if="['Service', 'Url'].includes(toolForm.route_type)"
                     label="接口参数"
                     v-model:value="paramForm"
                     v-model:schema="paramSchema"/>
    <template #footer>
      <el-button @click="showToolRouteDialog = false">取消</el-button>
      <el-button type="primary" @click="updateHttpParam">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>