<script setup lang="ts">

import {ElMessage} from "element-plus";
import {R} from "../../utils/R";

const value = defineModel()
const update = () => {
  R.postJson('/api/firewall/update', value.value).then(res => {
    if (res.code === 0) {
      ElMessage.success('防火墙配置已更新')
    }
  })
}

</script>

<template>
  <el-form label-position="left" label-width="80" @submit.prevent>
    <el-form-item label="访问策略">
      <el-radio-group v-model="value['referer_policy_mode']">
        <el-radio-button value="Disable">关闭</el-radio-button>
        <el-radio-button value="Allow">允许</el-radio-button>
        <el-radio-button value="Deny">拒绝</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="空Referer">
      <el-radio-group v-model="value['allow_empty_referer']">
        <el-radio-button :value="false">不允许</el-radio-button>
        <el-radio-button :value="true">允许</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="策略值">
      <el-input-tag v-model="value['referer_policy']" type="textarea"
                    placeholder="Referer策略值，例如：https://example.com" rows="10"
                    :disabled="value['referer_policy'] === 'Disable'"></el-input-tag>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="update">保存</el-button>
    </el-form-item>
  </el-form>

</template>

<style scoped lang="scss">

</style>