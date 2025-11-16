<script setup lang="ts">

import CpuUsage from "./cpu-usage.vue";
import SystemInfo from "./system-info.vue";
import MemeryUsage from "./memery-usage.vue";
import DiskUsage from "./disk-usage.vue";
import NetworkUsage from "./network-usage.vue";
import ConnectUsage from "./connect-usage.vue";
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="8">
      <system-info></system-info>
    </el-col>
    <el-col :span="8">
      <cpu-usage></cpu-usage>
    </el-col>
    <el-col :span="8">
      <memery-usage></memery-usage>
    </el-col>
  </el-row>
  <el-row :gutter="10" class="mt20">
    <el-col :span="8">
      <disk-usage></disk-usage>
    </el-col>
    <el-col :span="8">
      <network-usage></network-usage>
    </el-col>
    <el-col :span="8">
      <connect-usage></connect-usage>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>