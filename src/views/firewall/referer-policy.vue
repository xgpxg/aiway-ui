<script setup lang="ts">

import {ref} from "vue";

const form = ref({
  referer_policy_mode: 'Disable',
  allow_empty_referer: false,
  referer_policy: {}
})

const referer_policy = ref()
</script>

<template>
  <el-form label-position="left" label-width="80">
    <el-form-item label="访问策略">
      <el-radio-group v-model="form.referer_policy_mode">
        <el-radio value="Disable">关闭</el-radio>
        <el-radio value="Allow">允许</el-radio>
        <el-radio value="Deny">拒绝</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="空Referer">
      <el-radio-group v-model="form.allow_empty_referer">
        <el-radio :value="false">不允许</el-radio>
        <el-radio :value="true">允许</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="策略值">
      <el-input v-model="referer_policy" type="textarea" placeholder="IP策略值，例如：192.168.1.1" rows="10"
                :disabled="form.referer_policy === 'Disable'"></el-input>
    </el-form-item>
  </el-form>

</template>

<style scoped lang="scss">

</style>