<script setup lang="ts">
import {onMounted, ref, computed} from 'vue'
import {R} from '@/utils/R'
import {ElMessage, ElMessageBox} from 'element-plus'
import ProviderList from './provider-list.vue'
import SvgIcon from "../../components/SvgIcon/index.vue";

// 模型相关数据
const modelList = ref([])
const modelQuery = ref('')
const currentModel = ref(null)
const modelDialogVisible = ref(false)
const modelDialogTitle = ref('')
const modelForm = ref({
  name: '',
  lb_strategy: 'Random'
})
const rules = {
  name: [
    {required: true, message: '请输入模型名称', trigger: 'blur'},
  ],
  lb_strategy: [
    {required: true, message: '请选择负载均衡策略', trigger: 'change'}
  ]
}
const formRef = ref(null)

// 当前选中的模型ID
const selectedModelId = ref(null)

// 加载模型列表
const loadModelList = () => {
  R.postJson('/api/model/list', {}).then(res => {
    modelList.value = res.data || []
    // 如果当前没有选中的模型且模型列表不为空，则选择第一个模型
    if (!selectedModelId.value && modelList.value.length > 0) {
      selectedModelId.value = modelList.value[0].id
    }
  }).catch(err => {
    console.error('加载模型列表失败:', err)
    modelList.value = []
    ElMessage.error('加载模型列表失败')
  })
}

// 新增模型弹窗
const openAddModelDialog = () => {
  modelForm.value = {name: ''}
  currentModel.value = null
  modelDialogTitle.value = '新增模型'
  modelDialogVisible.value = true
}

// 编辑模型弹窗
const openEditModelDialog = (row) => {
  modelForm.value = {...row}
  currentModel.value = row
  modelDialogTitle.value = '编辑模型'
  modelDialogVisible.value = true
}

// 保存模型
const saveModel = () => {
  formRef.value.validate().then(ok => {
    if (!ok) {
      return
    }
    if (currentModel.value) {
      R.postJson('/api/model/update', {
        id: currentModel.value.id,
        name: modelForm.value.name
      }).then(res => {
        if (res.code === 0) {
          ElMessage.success('已更新')
          modelDialogVisible.value = false
          loadModelList()
        }
      })
    } else {
      // 新增模式
      R.postJson('/api/model/add', modelForm.value).then(res => {
        if (res.code === 0) {
          ElMessage.success('添加成功')
          modelDialogVisible.value = false
          loadModelList()
        }
      })
    }
  })
}

const deleteModel = (id) => {
  ElMessageBox.confirm('确定要删除这个模型吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    R.postJson('/api/model/delete', {id}).then(res => {
      if (res.ok) {
        ElMessage.success('删除成功')
        // 如果删除的是当前选中的模型，则清除选中状态
        if (selectedModelId.value === id) {
          selectedModelId.value = null
        }
        loadModelList()
      }
    })
  })
}


// 切换模型状态
const toggleStatus = (model, newStatus) => {
  R.postJson('/api/model/update', {
    id: model.id,
    status: newStatus
  }).then((res: any) => {
    if (res.code === 0) {
      // 更新列表中的状态
      const targetModel = modelList.value.find(m => m.id === model.id);
      if (targetModel) {
        targetModel.status = newStatus;
      }
    }
  })
}

// 当点击模型时，更新当前选中的模型ID
const selectModel = (modelId) => {
  selectedModelId.value = modelId
}

// 初始化数据
onMounted(() => {
  loadModelList()
})
</script>

<template>
  <el-row :gutter="20" v-if="modelList.length>0">
    <el-col :span="6">
      <div class="flex mb10">
        <el-input v-model="modelQuery" placeholder="模型名称" prefix-icon="search" clearable></el-input>
        <el-button type="primary" class="ml10" icon="plus" @click="openAddModelDialog">新增</el-button>
      </div>
      <div class="providers">
        <div
            class="bg-card br5 mb10 mr5 cursor-pointer"
            :class="{ 'selected': selectedModelId === model.id }"
            v-for="model in modelList"
            :key="model.id"
            @click="selectModel(model.id)"
        >
          <div class="title flex-space-between">
            {{ model.name }}
            <el-tag
                class="ml10"
                :type="model.status === 'Ok' ? 'success' : 'info'"
                size="small"
            >
              {{ model.status === 'Ok' ? '启用' : '停用' }}
            </el-tag>
          </div>
          <div class="mt5">
            <el-text effect="plain" size="small">{{ model.providers ? model.providers.length : 0 }} 提供商</el-text>
          </div>
          <div class="mt10 flex" style="justify-content: flex-end;">
            <el-button type="primary" size="small" link @click.stop="toggleStatus(model,'Disable')"
                       v-if="model.status==='Ok'">停用
            </el-button>
            <el-button type="primary" size="small" link @click.stop="toggleStatus(model,'Ok')"
                       v-if="model.status==='Disable'">启用
            </el-button>
            <el-button type="primary" size="small" link @click.stop="openEditModelDialog(model)">编辑</el-button>
            <el-button type="danger" size="small" link @click.stop="deleteModel(model.id)">删除
            </el-button>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <div v-if="selectedModelId">
        <div class="card">
          <ProviderList
              :modelList="modelList"
              :selectedModelId="selectedModelId"
              @refresh="loadModelList"
          />
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
        <el-text class="flex-v">当前暂无模型，请
          <el-button type="primary" link @click="openAddModelDialog">新增模型</el-button>
        </el-text>
      </template>
    </el-empty>
  </div>

  <!-- 模型新增/编辑弹窗 -->
  <el-dialog v-model="modelDialogVisible" :title="modelDialogTitle" width="500px">
    <el-form ref="formRef" :model="modelForm" label-width="100px" :rules="rules">
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="modelForm.name" placeholder="请输入模型名称，该名称需全局唯一" maxlength="100"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="负载策略" prop="lb_strategy">
        <el-select v-model="modelForm.lb_strategy" placeholder="请选择负载策略">
          <el-option label="随机" value="Random"></el-option>
          <el-option label="轮询" value="RoundRobin"></el-option>
          <el-option label="加权随机" value="WeightedRandom"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="modelDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveModel">确定</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.providers {
  height: calc(100vh - 122px);
  overflow-y: auto;
}

.cursor-pointer {
  cursor: pointer;
  border: 3px solid transparent;
}

.selected {
  border-left: 3px solid #4299fa;
  background-color: #f0f8ff;
}
</style>