<script setup lang="ts">

import {computed, onMounted, ref} from "vue";
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
  description: ''
})
const mcpFormRef = ref(null)
const currentMcp = ref(null)
const selectedMcpId = computed(() => {
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
onMounted(() => {
  loadData()
})
const loadData = () => {
  R.postJson('/api/mcp/server/list', {}).then((res) => {
    mcpList.value = res.data
    if (!selectedMcpId.value && mcpList.value.length > 0) {
      selectMcp(mcpList.value[0].id)
    }
  })
}
const openAddMcpDialog = () => {
  mcpForm.value = {name: '', lb_strategy: 'Random'}
  currentMcp.value = null
  mcpDialogTitle.value = '新增模型'
  mcpDialogVisible.value = true
}

const openEditMcpDialog = (row) => {
  mcpForm.value = {...row}
  currentMcp.value = row
  mcpDialogTitle.value = '编辑模型'
  mcpDialogVisible.value = true
}


// 当点击模型时，更新当前选中的 MCP ID
const selectMcp = (mcpId: number) => {
  router.push({
    path: '/mcp/' + mcpId,
  })
}

const save = () => {
  if (currentMcp.value) {
    mcpFormRef.value.validate().then(() => {
      R.postJson('/api/mcp/server/update', {
        id: mcpForm.value.id,
        name: mcpForm.value.name,
        description: mcpForm.value.description,
      }).then((res) => {
        if (res.code === 0) {
          mcpDialogVisible.value = false
          loadData()
        }
      })
    })
  } else {
    mcpFormRef.value.validate().then(() => {
      R.postJson('/api/mcp/server/add', {
        name: mcpForm.value.name,
        description: mcpForm.value.description,
      }).then((res) => {
        if (res.code === 0) {
          mcpDialogVisible.value = false
          loadData()
        }
      })
    })
  }

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
  }).then((res: any) => {
    if (res.code === 0) {
      // 更新列表中的状态
      const target = mcpList.value.find(m => m.id === mcp.id);
      if (target) {
        target.status = newStatus;
      }
    }
  })
}

</script>

<template>
  <el-row :gutter="20" v-if="mcpList.length">
    <el-col :span="6">
      <div class="flex mb10">
        <el-input v-model="filterText" placeholder="MCP名称" prefix-icon="search" clearable></el-input>
        <el-button type="primary" class="ml10" icon="plus" @click="openAddMcpDialog">创建 MCP Server</el-button>
      </div>
      <div class="providers">
        <div
            class="card br5 mb10 cursor-pointer"
            :class="{ 'selected': selectedMcpId === Number(mcp.id) }"
            v-for="mcp in filteredMcpList"
            :key="mcp.id"
            @click="selectMcp(mcp.id)"
        >
          <div class="title flex-space-between">
            {{ mcp.name }}
            <el-switch v-model="mcp.status" active-value="Ok" inactive-value="Disable" size="small"
                       @change="toggleStatus(mcp, $event)" inactive-text="停用" inline-prompt>
            </el-switch>
          </div>
          <div class="mt5">
            <el-text type="info" size="small">
              {{ mcp.description }}
            </el-text>
          </div>
          <div class="mt10 flex-v flex-space-between">
            <div>
              <el-text type="info" size="small">
                {{ mcp.update_time || mcp.create_time }}
              </el-text>
            </div>
            <div>
              <el-button type="primary" link @click.stop="openEditMcpDialog(mcp)"
                         icon="edit"></el-button>
              <el-popconfirm title="确定删除吗？" @confirm="deleteMcp(mcp.id)">
                <template #reference>
                  <el-button @click.stop type="danger" link icon="delete">
                  </el-button>
                </template>
              </el-popconfirm>

            </div>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div v-if="selectedMcpId">
        <div class="card">
          <!--          <tool-list :mcp-server-id="selectedMcpId"/>-->
          <router-view :key="selectedMcpId"></router-view>
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
          <el-button type="primary" link @click="openAddMcpDialog">创建 MCP Server</el-button>
        </el-text>
      </template>
    </el-empty>
  </div>

  <!-- MCP新增/编辑弹窗 -->
  <el-dialog v-model="mcpDialogVisible" :title="modelDialogTitle" width="500px">
    <el-form ref="mcpFormRef" :model="mcpForm" label-width="100px" :rules="rules">
      <el-form-item label="服务名" prop="name">
        <el-input v-model="mcpForm.name" placeholder="请输入MCP服务名，该名称需全局唯一" maxlength="100"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="mcpForm.description" type="textarea" :rows="3" placeholder="填写描述"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="mcpDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.card{
  padding: 10px;
  border: 1px solid var(--el-color-primary-light-9);
}
.selected {
  background-color: var(--el-color-primary-light-11);
  border: 1px solid var(--el-color-primary-light-9);
}
</style>