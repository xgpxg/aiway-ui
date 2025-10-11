<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";
import HelpTip from "../../components/Tip/HelpTip.vue";

const value = defineModel('value')

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const defaultForm = {
  name: null,
  description: null,
  version: null,
  file: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  service_group: [
    {required: true, message: '请选择关联服务', trigger: 'blur'}
  ],
  nodes: [
    {required: true, message: '请填写节点', trigger: 'blur'}
  ]
}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    let api: string;
    if (value.value) {
      api = '/api/plugin/update'
    } else {
      api = '/api/plugin/add'
    }
    R.postJson(api, form.value).then(res => {
      if (res.code === 0) {
        isShow.value = false
      }
    })
  })
}

watch(value, (newVal: any) => {
  if (!newVal) {
    form.value = defaultForm
    return
  }
  form.value = {...defaultForm, ...newVal}
})

const reset = () => {
  form.value = structuredClone(defaultForm)
  value.value = null
}
</script>

<template>
  <el-drawer title="添加插件" v-model="isShow" size="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="插件名称" prop="name">
        <el-input v-model="form.name" placeholder="填写插件名称，建议使用英文名称" maxlength="100"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="插件功能" prop="description">
        <el-input v-model="form.description" placeholder="简要描述插件功能" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="插件文件" prop="file">
      </el-form-item>
      <el-form-item label="插件版本" prop="version">
        <el-input v-model="form.version" placeholder="填写插件版本" maxlength="20" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  width: 100%;
  padding-right: 0;
}

:deep(.el-form-item__error--inline) {
  margin-left: 0;
}
</style>