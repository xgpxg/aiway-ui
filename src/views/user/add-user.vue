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
  username: null,
  nickname: null,
  password: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  username: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
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
    let api: string;
    if (value.value) {
      api = '/api/user/manage/update'
    } else {
      api = '/api/user/manage/add'
    }
    R.postJson(api, {
      id: value.value?.id,
      username: form.value.username,
      nickname: form.value.nickname,
      password: form.value.password,
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
}
</script>

<template>
  <el-dialog v-model="isShow" :title="value ? '添加用户' : '修改用户'" width="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请填写用户名" maxlength="50"
                  show-word-limit :disabled="!!value" type="password"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="form.password" placeholder="请填写登录密码" minlength="6" maxlength="50"
                  show-word-limit :disabled="!!value"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请填写昵称，可选，默认与用户名相同" maxlength="100"
                  show-word-limit :disabled="!!value"></el-input>
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