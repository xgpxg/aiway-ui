<script setup lang="ts">
import {R} from "../../utils/R";
import {ElMessage} from "element-plus";

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
  <el-form label-position="left" label-width="80">
    <el-form-item label="访问策略" @submit.prevent>
      <el-radio-group v-model="value['ip_policy_mode']">
        <el-radio-button value="Disable">关闭</el-radio-button>
        <el-radio-button value="Allow">允许</el-radio-button>
        <el-radio-button value="Deny">拒绝</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="策略值">
      <el-input-tag v-model="value['ip_policy']" type="textarea"
                    placeholder="填写IP地址，例如：192.168.1.1" rows="5"
                    :disabled="value['ip_policy_mode'] === 'Disable'"></el-input-tag>
    </el-form-item>
    <el-form-item label="受信IP">
      <el-input-tag v-model="value['ip_policy']" type="textarea"
                    placeholder="填写受信IP，例如：192.168.1.1"
                    rows="5" @keydown.enter.prevent></el-input-tag>
      <el-text type="info" size="small">受信IP不受防火墙限制，请谨慎使用，建议只允许已知的内网IP作为受信IP。</el-text>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="update">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>