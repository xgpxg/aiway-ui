<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import {ElMessage} from "element-plus";

const value = defineModel()

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const defaultForm = {
  id: null,
  nickname: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    R.postJson('/api/user/manage/update/info', {
      id: value.value?.id,
      nickname: form.value.nickname,
    }).then(res => {
      if (res.code === 0) {
        isShow.value = false
        ElMessage.success('已更新')
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
  <el-dialog v-model="isShow" title="更新用户信息" width="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="用户名" prop="name">
        <el-text>{{ value?.username }}</el-text>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请填写昵称" maxlength="50"
                  show-word-limit :disabled="!value"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>