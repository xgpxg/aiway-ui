<script setup lang="ts">

import {ElMessage, ElMessageBox} from "element-plus";
import {R} from "../../utils/R";
import {U} from "../../utils/util"

const value = defineModel()

const rules = {
  api_secret_encrypt_key: [
    {
      required: true,
      message: '请输入API Key加密密钥',
      trigger: 'blur'
    },
    {
      min: 32,
      max: 32,
      message: 'API Key加密密钥长度为32位',
      trigger: 'blur'
    },
    {
      pattern: /^[\x00-\x7F]*$/,
      message: 'API Key加密密钥只能是ascii字符',
      trigger: 'blur'
    }
  ]
}
const old = value.value['api_secret_encrypt_key']

const update = () => {
  ElMessageBox.confirm('修改后将导致已创建的API Key无法使用，请确认操作', '确定修改加密密钥', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    R.postJson('/api/firewall/update', value.value).then(res => {
      if (res.code === 0) {
        ElMessage.success('密钥已更新')
      }
    })
  }).catch(() => {
    value.value['api_secret_encrypt_key'] = old
  })
}

const randomGen = () => {
  value.value['api_secret_encrypt_key'] = U.randomString(32)
}
</script>

<template>
  <el-form :model="value" :rules="rules" label-position="left" label-width="140" @submit.prevent>
    <el-form-item label="API Key加解密密钥" prop="api_secret_encrypt_key">
      <el-input class="half-width" placeholder="请输入API Key加密密钥，长度固定为32位"
                v-model="value['api_secret_encrypt_key']" minlength="32" maxlength="32" show-word-limit
                type="password" show-password>
      </el-input>
      <el-button @click="randomGen" class="ml10">随机生成</el-button>
      <el-text type="info" size="small" class="fill-width">
        API Key密钥用于API Key的加密/解密，请妥善保存。该密钥请不要频繁修改，修改后将导致已创建的API Key无法使用。
      </el-text>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="update">保存</el-button>
    </el-form-item>
  </el-form>

</template>

<style scoped lang="scss">

</style>