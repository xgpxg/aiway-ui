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
  password: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  password: [
    {required: true, message: '请填写登录密码', trigger: 'blur'},
    {min: 6, message: '密码长度不能少于6位', trigger: 'blur'},
  ],
}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    R.postJson('/api/user/manage/update/password', {
      id: value.value?.id,
      password: form.value.password,
    }).then(res => {
      if (res.code === 0) {
        isShow.value = false
        ElMessage.success('密码重置成功，下次登录时生效')
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

const randomPassword = () => {
  form.value.password = U.randomString(8)
}
</script>

<template>
  <el-dialog v-model="isShow" title="重置登录密码" width="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="用户名" prop="name">
        <el-text>{{ value?.username }}</el-text>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <div class="flex-v fill-width">
          <el-input v-model="form.password" placeholder="请填写或随机生成新密码" maxlength="100"
                    show-word-limit :disabled="!value"></el-input>
          <el-button class="ml10" @click="randomPassword">随机生成</el-button>
        </div>
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