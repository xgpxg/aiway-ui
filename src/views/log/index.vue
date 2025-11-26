<script setup lang="ts">

import {ref} from "vue";
import AiwayLogs from "./aiway-logs.vue";

const active = ref('aiway-logs')
</script>

<template>
  <div class="pd20">
    <el-tabs v-model="active" tab-position="left">
      <el-tab-pane label="通用日志" name="aiway-logs">
        <div class="mt10">
          <aiway-logs></aiway-logs>
        </div>
      </el-tab-pane>
      <el-tab-pane label="请求日志" name="request-logs">
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<style scoped lang="scss">

</style>