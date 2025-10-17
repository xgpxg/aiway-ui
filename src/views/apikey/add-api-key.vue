<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";

const value = defineModel('value')

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const defaultForm = {
  id: null,
  name: null,
  principal: null,
  exp_time: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],

}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    R.postJson('/api/key/add', {
      id: value.value?.id,
      name: form.value.name,
      principal: form.value.principal,
      exp_time: form.value.exp_time,
    }).then(res => {
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
  debugger
}
</script>

<template>
  <el-dialog v-model="isShow" :title="value ? '修改密钥' : '添加密钥'" width="400" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="密钥名称" prop="name">
        <el-input v-model="form.name" placeholder="填写密钥名称" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="所属主体" prop="principal">
        <el-input v-model="form.principal" placeholder="填写密钥所属主体" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="到期时间" prop="exp_time">
        <el-date-picker v-model="form.exp_time" type="datetime" placeholder="选择到期时间"
                        style="width: 100%"></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
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