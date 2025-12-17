<script setup lang="ts">

import CpuUsage from "./cpu-usage.vue";
import NodeMonitor from "./node-monitor.vue";
import SvgIcon from "../../components/SvgIcon/index.vue";

import { ref } from "vue";

const active = ref("192.168.1.12:6000");
</script>

<template>
  <div>
    <el-tabs v-model="active">
      <el-tab-pane label="192.168.1.12:6000" name="192.168.1.12:6000">
        <template #label>
          <svg-icon icon-class="server" size="20" class="mr5"></svg-icon>
          192.168.1.12:6000
        </template>
        <node-monitor></node-monitor>
      </el-tab-pane>
      <el-tab-pane label="192.168.1.13:6000" name="192.168.1.13:6000">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.card {
  border: 1px solid #f0f0f0;
  background: #ffffff;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>