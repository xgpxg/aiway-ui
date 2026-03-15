<script setup lang="ts">

import {computed, onMounted, provide, ref} from "vue";
import {R} from "../../utils/R";
import {useRoute, useRouter} from "vue-router";
import SvgIcon from "../../components/SvgIcon/index.vue";

const router = useRouter()
const route = useRoute()

const mcpList = ref([])
const mcpDialogVisible = ref(false)
const mcpDialogTitle = ref('')
const mcpForm = ref({
  name: '',
  description: '',
  server_type: 'Http',
})
const mcpFormRef = ref(null)
const mcpServer = ref(null)
const currMcpServer = ref(null)
const currMcpId = computed(() => {
  return Number(route.params.mcpServiceId)
})
const filterText = ref('')
const filteredMcpList = computed(() => {
  return mcpList.value.filter(item => item.name.includes(filterText.value))
})
const rules = {
  name: [
    {required: true, message: '请输入MCP名称', trigger: 'blur'},
    {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
  ],
}

provide('mcpServer', mcpServer)


onMounted(() => {
  loadData()
})

const loadData = () => {
  R.postJson('/api/mcp/server/list', {}).then((res) => {
    mcpList.value = res.data
    if (!currMcpId.value && mcpList.value.length > 0) {
      selectMcp(mcpList.value[0])
    } else {
      let index = mcpList.value.findIndex(item => item.id === currMcpId.value)
      if (index > -1) {
        selectMcp(mcpList.value[index])
      } else {
        selectMcp(mcpList.value[0])
      }
    }
  })
}
const openAddMcpDialog = () => {
  mcpForm.value = {name: '', lb_strategy: 'Random', server_type: 'Http',}
  currMcpServer.value = null
  mcpDialogTitle.value = '创建 MCP Server'
  mcpDialogVisible.value = true
}

const openEditMcpDialog = (row) => {
  mcpForm.value = {...row}
  currMcpServer.value = row
  mcpDialogTitle.value = '修改 MCP Server'
  mcpDialogVisible.value = true
}


// 当点击模型时，更新当前选中的 MCP ID
const selectMcp = (mcp) => {
  mcpServer.value = mcp
  router.push({
    path: `/mcp/${mcp.id}`
  })
}
const save = () => {
  mcpFormRef.value?.validate().then(() => {
    const isEdit = !!currMcpServer.value
    const api = isEdit ? '/api/mcp/server/update' : '/api/mcp/server/add'
    const payload = isEdit
        ? {id: mcpForm.value.id, ...mcpForm.value}
        : {...mcpForm.value}

    R.postJson(api, payload).then((res) => {
      if (res.code === 0) {
        mcpDialogVisible.value = false
        loadData()
      }
    })
  })
}

const deleteMcp = (mcpId) => {
  R.postJson('/api/mcp/server/delete', {
    ids: [mcpId]
  }).then((res: any) => {
    if (res.code === 0) {
      loadData()
    }
  })
}

const toggleStatus = (mcp, newStatus) => {
  R.postJson('/api/mcp/server/update_status', {
    id: mcp.id,
    status: newStatus
  }).then((res) => {
    if (res.code === 0) {
      mcp.status = newStatus
    }
  })
}

</script>

<template>
  <el-row :gutter="20" v-if="mcpList.length">
    <el-col :span="6">
      <div class="flex mb10">
        <el-input v-model="filterText" placeholder="名称" prefix-icon="search" clearable></el-input>
        <el-button type="primary" class="ml10" icon="plus" @click="openAddMcpDialog">MCP Server</el-button>
      </div>
      <div class="list">
        <div
            class="card br5 mb10 cursor-pointer"
            :class="{ 'selected': currMcpId === Number(mcp.id) }"
            v-for="mcp in filteredMcpList"
            :key="mcp.id"
            @click="selectMcp(mcp)"
        >
          <div class="title flex-space-between">
            {{ mcp.name }}
            <el-switch v-model="mcp.status" active-value="Ok" inactive-value="Disable" size="small"
                       @change="toggleStatus(mcp, $event)" @click.stop inactive-text="停用" inline-prompt>
            </el-switch>
          </div>
          <div class="mt5">
            <el-text type="info" size="small" v-if="mcp.description">
              {{ mcp.description }}
            </el-text>
            <el-text type="info" size="small" v-else>
              暂无描述
            </el-text>
          </div>
          <div class="mt10 flex-v flex-space-between">
            <div>
              <el-text type="info" size="small">
                {{ mcp.update_time || mcp.create_time }}
              </el-text>
              <span class="ml20">
                <el-text type="info" size="small" v-if="mcp.server_type==='Http'">
                 接口
                </el-text>
                <el-text type="info" size="small" v-if="mcp.server_type==='Proxy'">
                 代理
                </el-text>
              </span>

            </div>
            <div>
              <el-button type="primary" link @click.stop="openEditMcpDialog(mcp)"
                         icon="edit"></el-button>
              <el-popconfirm title="确定删除吗？" @confirm="deleteMcp(mcp.id)">
                <template #reference>
                  <el-button type="danger" link icon="delete" @click.stop></el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div v-if="currMcpId">
        <div>
          <router-view :key="currMcpId"></router-view>
        </div>
      </div>
    </el-col>
  </el-row>
  <div v-else>
    <el-empty image-size="200">
      <template #image>
        <svg-icon icon-class="empty" size="200"></svg-icon>
      </template>
      <template #description>
        <el-text class="flex-v">当前暂无MCP服务，请
          <el-button type="primary" link @click="openAddMcpDialog" class="ml10">创建 MCP Server</el-button>
        </el-text>
      </template>
    </el-empty>
  </div>

  <!-- MCP新增/编辑弹窗 -->
  <el-dialog v-model="mcpDialogVisible" :title="mcpDialogTitle" width="500px">
    <el-form ref="mcpFormRef" :model="mcpForm" label-width="70px" :rules="rules">
      <el-form-item label="服务名" prop="name">
        <el-input v-model="mcpForm.name" placeholder="请输入MCP服务名，该名称需全局唯一" maxlength="100"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="mcpForm.description" type="textarea" :rows="3" placeholder="填写描述" maxlength="200"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="服务类型" prop="server_type">
        <el-radio-group v-model="mcpForm.server_type" :disabled="!!currMcpServer">
          <el-radio-button label="Http" value="Http">HTTP接口</el-radio-button>
          <el-radio-button label="Proxy" value="Proxy">代理</el-radio-button>
        </el-radio-group>
        <div v-if="mcpForm.server_type === 'Http'" class="fill-width">
          <el-text type="info" size="small">
            将MCP请求转发给指定的服务或指定的URL，无需改动现有业务系统。
          </el-text>
        </div>
        <div v-if="mcpForm.server_type === 'Proxy'" class="fill-width">
          <el-text type="info" size="small">
            将MCP请求代理到已有的MCP Server。
          </el-text>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="mcpDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.list {
  height: calc(100vh - 122px);
  overflow-y: auto;
}

.card {
  padding: 10px;
  border: 1px solid var(--el-color-primary-light-9);
}

.selected {
  background-color: var(--el-color-primary-light-11);
  border: 1px solid var(--el-color-primary-light-9);
}
</style>