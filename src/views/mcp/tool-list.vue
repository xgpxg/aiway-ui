<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import ApiParamTable from "./api-param-table.vue";
import {ElMessageBox} from "element-plus";
import {useRoute} from "vue-router";

const route = useRoute()
const mcpServerId = computed(() => {
  return Number(route.params.mcpServiceId)
})
const toolList = ref([])
const filterText = ref('')
const filteredMcpList = computed(() => {
  return toolList.value.filter(item => item.name.includes(filterText.value))
})
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const showToolAddDialog = ref(false)
const showApiParamDialog = ref(false)
const paramForm = ref([])
const paramSchema = ref({})
const toolForm = ref({
  name: '',
  description: '',
  service: '',
  url: '',
})
const toolFormRef = ref()
const rules = {
  name: [
    {required: true, message: '请填写工具名称', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 2 到 100 个字符', trigger: 'blur'}
  ],
  description: [
    {required: true, message: '请填写工具描述', trigger: 'blur'},
    {min: 2, max: 100, message: '长度在 2 到 500 个字符', trigger: 'blur'}
  ],
}
const errMsg = ref('')
const selectedTool = ref(null)
onMounted(() => {
  loadData()
})
const loadData = () => {
  R.postJson('/api/mcp/tool/list', {
    page: page.value,
    mcp_server_id: mcpServerId.value
  }).then((res) => {
    toolList.value = res.data.list
    page.value.total = res.data.total
  })
}

const saveTool = () => {

  // 校验目标服务和地址至少填写一个
  if (!toolForm.value.service && !toolForm.value.url) {
    errMsg.value = '目标服务和地址至少填写一个'
    return
  } else {
    errMsg.value = ''
  }
  // 校验表单
  toolFormRef.value.validate().then(() => {
    R.postJson('/api/mcp/tool/add', {
      mcp_server_id: mcpServerId.value,
      name: toolForm.value.name,
      description: toolForm.value.description,
      service: toolForm.value.service,
      url: toolForm.value.url,
    }).then(() => {
      showToolAddDialog.value = false
      loadData()
    })
  })

}
const deleteTool = (row) => {
  // 确认删除
  ElMessageBox.confirm('确认删除该工具？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    R.postJson('/api/mcp/tool/delete', {
      ids: [row.id]
    }).then(() => {
      loadData()
    })
  })
}

const openApiParamDialog = (tool) => {
  selectedTool.value = tool
  paramForm.value = tool.request_param || []
  paramSchema.value = tool.input_schema || {}
  showApiParamDialog.value = true
}

const updateApiParam = () => {
  R.postJson('/api/mcp/tool/update', {
    id: selectedTool.value.id,
    request_param: paramForm.value,
    input_schema: paramSchema.value,
  }).then(() => {
    showApiParamDialog.value = false
    loadData()
  })
}

const toggleStatus = (row, newStatus) => {
  debugger
  R.postJson('/api/mcp/tool/update_status', {
    id: row.id,
    status: newStatus
  }).then((res) => {
    if (res.code === 0) {
      loadData()
    }
  })
}
</script>

<template>
  <div class="flex mb10">
    <el-input v-model="filterText" placeholder="工具名称" prefix-icon="search" clearable></el-input>
    <el-button type="" class="ml10" icon="refresh" @click="loadData"></el-button>
    <el-button type="primary" class="ml10" icon="plus" @click="showToolAddDialog=true">新增工具</el-button>
  </div>

  <div class="card">
    <div class="mt10">
      <el-table class="mt10" :data="filteredMcpList">
        <el-table-column prop="name" label="名称" min-width="100" show-overflow-tooltip>
          <template #default="{row}">
            {{ row.name }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{row}">
            <el-switch v-model="row.status" active-value="Ok" inactive-value="Disable"
                       @change="toggleStatus(row, $event)" active-text="启用" inactive-text="停用" inline-prompt>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{row}">
            <el-button link type="primary" @click="openApiParamDialog(row)">接口配置</el-button>
            <el-button link type="danger" @click="deleteTool(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="showToolAddDialog" width="500px" title="添加工具">
    <el-form ref="toolFormRef" :model="toolForm" :rules="rules" label-width="100px">
      <el-form-item label="工具名称" prop="name">
        <el-input v-model="toolForm.name" placeholder="请填写工具名称，仅支持英文和数字，以及下划线和中划线"></el-input>
      </el-form-item>
      <el-form-item label="工具描述" prop="description">
        <el-input v-model="toolForm.description" placeholder="请填写工具描述"></el-input>
      </el-form-item>
      <el-form-item label="目标服务" prop="service">
        <el-input v-model="toolForm.service" placeholder="请填写目标服务名称，例如：user-service"></el-input>
      </el-form-item>
      <el-form-item label="目标地址" prop="url">
        <el-input v-model="toolForm.url" placeholder="标服务地址，可选，当填写该项后，将以该地址为准"></el-input>
      </el-form-item>
      <el-form-item label="" v-if="errMsg">
        <el-text type="danger">{{ errMsg }}</el-text>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showToolAddDialog = false">取消</el-button>
      <el-button type="primary" @click="saveTool">添加</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="showApiParamDialog" width="70vw" title="接口参数配置">
    <api-param-table v-model:value="paramForm" v-model:schema="paramSchema"></api-param-table>
    <template #footer>
      <el-button @click="showApiParamDialog = false">取消</el-button>
      <el-button type="primary" @click="updateApiParam">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>