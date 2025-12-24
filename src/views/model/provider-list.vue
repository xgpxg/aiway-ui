<script setup lang="ts">
import {computed, defineProps, defineEmits, ref} from 'vue'
import {R} from '@/utils/R'
import {ElMessage, ElMessageBox} from 'element-plus'
import SvgIcon from "../../components/SvgIcon/index.vue";

// 定义props和emits
const props = defineProps({
  modelList: {
    type: Array,
    required: true
  },
  selectedModelId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['refresh'])

// 模型提供商相关数据
const providerQuery = ref('')
const currentProvider = ref(null)
const providerDialogVisible = ref(false)
const providerDialogTitle = ref('')
const providerForm = ref({
  id: null,
  model_id: null,
  name: null,
  api_url: null,
  api_key: null,
  target_model_name: null,
  weight: 1
})
const rules = {
  name: [
    {required: true, message: '请输入提供商名称', trigger: 'blur'}
  ],
  api_url: [
    {required: true, message: '请输入API地址', trigger: 'blur'}
  ],
  weight: [
    {required: true, message: '请输入权重值', trigger: 'blur'},
    {type: 'number', message: '权重必须为数字值', trigger: 'blur'}
  ]
}
const formRef = ref(null)

// 根据选中的模型获取提供商列表
const filteredProviderList = computed(() => {
  if (!props.selectedModelId) {
    return []
  }
  const selectedModel = props.modelList.find(model => model.id === props.selectedModelId)
  return selectedModel ? (selectedModel.providers || []).filter(provider => !providerQuery.value || provider.name.indexOf(providerQuery.value) > -1) : []
})

// 获取当前选中模型的负载策略
const currentModelLbStrategy = computed(() => {
  if (!props.selectedModelId) {
    return ''
  }
  const selectedModel = props.modelList.find(model => model.id === props.selectedModelId)
  return selectedModel ? selectedModel.lb_strategy : ''
})

// 判断是否显示权重相关功能
const showWeightColumn = computed(() => {
  return currentModelLbStrategy.value === 'WeightedRandom'
})

// 模型提供商操作
const openAddProviderDialog = () => {
  providerForm.value = {
    id: null,
    model_id: props.selectedModelId,
    name: '',
    api_url: '',
    api_key: '',
    target_model_name: '',
    weight: 1  // 默认权重为1
  }
  currentProvider.value = null
  providerDialogTitle.value = '新增提供商'
  providerDialogVisible.value = true
}

const openEditProviderDialog = (row) => {
  providerForm.value = {
    ...row,
    target_model_name: row.target_model_name || '',
    weight: row.weight || 1  // 确保权重字段存在，默认为1
  }
  currentProvider.value = row
  providerDialogTitle.value = '修改提供商'
  providerDialogVisible.value = true
}

const saveProvider = () => {
  formRef.value.validate().then(() => {

    if (currentProvider.value) {
      // 编辑模式 - 使用更新接口
      const updateData = {
        id: currentProvider.value.id,
        name: providerForm.value.name,
        api_url: providerForm.value.api_url,
        api_key: providerForm.value.api_key,
        target_model_name: providerForm.value.target_model_name,
      }

      // 如果当前模型使用加权随机策略，则包含权重
      if (showWeightColumn.value) {
        updateData['weight'] = providerForm.value.weight
      }

      R.postJson('/api/model/provider/update', updateData).then(res => {
        if (res.code === 0) {
          ElMessage.success('已更新')
          providerDialogVisible.value = false
          emit('refresh') // 通知父组件刷新数据
        }
      })
    } else {
      // 新增模式 - 将提供商与当前选中的模型关联
      const providerData = {
        ...providerForm.value
      }
      if (props.selectedModelId) {
        providerData.model_id = props.selectedModelId
      }
      // 如果target_model_name不为空，则包含该字段
      if (providerData.target_model_name !== undefined && providerData.target_model_name !== null) {
        // 不需要额外处理，因为target_model_name可能为空
      }

      // 如果当前模型使用加权随机策略，则包含权重
      if (!showWeightColumn.value) {
        // 如果不显示权重列，移除权重字段，避免后端错误
        delete providerData.weight
      }

      R.postJson('/api/model/provider/add', providerData).then(res => {
        if (res.code === 0) {
          ElMessage.success('添加成功')
          providerDialogVisible.value = false
          emit('refresh')
        }
      })
    }
  })
}

const deleteProvider = (id) => {
  ElMessageBox.confirm('确定要删除这个模型提供商吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    R.postJson('/api/model/provider/delete', {id}).then(res => {
      if (res.code === 0) {
        ElMessage.success('删除成功')
        emit('refresh') // 通知父组件刷新数据
      }
    })
  })
}

const toggleStatus = (provider: any, newStatus: string) => {
  R.postJson('/api/model/provider/update', {
    id: provider.id,
    status: newStatus
  }).then((res: any) => {
    if (res.code === 0) {
      emit('refresh') // 通知父组件刷新数据
    }
  })
}
</script>
<template>
  <div>
    <div class="flex mb10">
      <el-input v-model="providerQuery" placeholder="提供商名称" prefix-icon="search" clearable></el-input>
      <el-button type="" class="ml10" icon="refresh" @click="emit('refresh')"></el-button>
      <el-button type="primary" class="ml10" icon="plus" @click="openAddProviderDialog">新增提供商</el-button>
    </div>

    <div class="card">
      <div class="mt10">
        <el-table class="mt10" :data="filteredProviderList">
          <el-table-column prop="name" label="提供商" min-width="100" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="api_url" label="API地址" min-width="300" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.api_url }}
            </template>
          </el-table-column>
          <el-table-column label="API Key" min-width="100" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.api_key ? row.api_key.substring(0, 5) + '******' : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="目标模型" min-width="150" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.target_model_name || '-' }}
            </template>
          </el-table-column>
          <!-- 权重列 - 仅在加权随机策略时显示 -->
          <el-table-column v-if="showWeightColumn" prop="weight" label="权重" width="100" show-overflow-tooltip>
            <template #default="{row}">
              {{ row.weight }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{row}">
              <el-switch v-model="row.status" active-value="Ok" inactive-value="Disable"
                         @change="toggleStatus(row, $event)" active-text="启用" inactive-text="停用" inline-prompt>
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template #default="{row}">
              <el-button link type="primary" @click="openEditProviderDialog(row)">编辑</el-button>
              <el-button link type="danger" @click="deleteProvider(row.id)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty image-size="100">
              <template #image>
                <svg-icon icon-class="empty" size="100"></svg-icon>
              </template>
              <template #description>
                <el-text class="flex-v">当前模型暂无提供商数据，请
                  <el-button type="primary" link @click="openAddProviderDialog">添加提供商</el-button>
                </el-text>
              </template>
            </el-empty>
          </template>
        </el-table>
      </div>
    </div>

    <!-- 模型提供商新增/编辑弹窗 -->
    <el-dialog v-model="providerDialogVisible" :title="providerDialogTitle" width="600px">
      <el-form ref="formRef" :model="providerForm" :rules="rules" label-width="100px">
        <el-form-item label="提供商名称" prop="name">
          <el-input v-model="providerForm.name" placeholder="请输入提供商名称" maxlength="100"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="API地址" prop="api_url">
          <el-input v-model="providerForm.api_url" placeholder="请输入API地址" maxlength="500"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="API Key" prop="api_key">
          <el-input v-model="providerForm.api_key" placeholder="请输入API Key" show-password></el-input>
        </el-form-item>
        <el-form-item label="目标模型" prop="target_model_name">
          <el-input v-model="providerForm.target_model_name"
                    placeholder="请输入提供商处的模型名称，不填则使用默认名称"></el-input>
        </el-form-item>
        <!-- 权重输入框 - 仅在加权随机策略时显示 -->
        <el-form-item v-if="showWeightColumn" label="权重" prop="weight">
          <el-input-number v-model="providerForm.weight" :min="1" :max="100" placeholder="请填写权重"/>
          <el-text type="info" size="small" class="fill-width">权重值越大，被选中的概率越高</el-text>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="providerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProvider">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<style scoped>
</style>