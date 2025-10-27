<script setup lang="ts">
import {R} from "../../utils/R";
import {ElMessage} from "element-plus";
import {watch} from "vue";

const value = defineModel()

const update = () => {
  R.postJson('/api/firewall/update', value.value).then(res => {
    if (res.code === 0) {
      ElMessage.success('防火墙配置已更新')
    }
  })
}

watch(value, (newVal) => {
  if (newVal['max_connections'] === '') {
    newVal['max_connections'] = null
  }
}, {deep: true})
</script>

<template>
  <el-form label-position="left" label-width="90" @submit.prevent>
    <el-form-item label="最大连接数">
      <el-input v-model.number="value['max_connections']" placeholder="单个网关节点的最大连接数，留空则不限制"
                type="number"
                class="half-width"></el-input>
      <el-text type="info" size="small" class="fill-width">
        合理设置网关节点的最大连接数，可保持系统的稳定性以及防止DDOS攻击。该配置对所有网关节点生效。
      </el-text>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" @click="update">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>