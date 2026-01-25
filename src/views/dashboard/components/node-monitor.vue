<script setup lang="ts">
import CpuUsage from "./cpu-usage.vue";
import SystemInfo from "./system-info.vue";
import MemeryUsage from "./memery-usage.vue";
import DiskUsage from "./disk-usage.vue";
import NetworkUsage from "./network-usage.vue";
import ConnectUsage from "./connect-usage.vue";

const props = defineProps(['nodeId', 'attr', 'state']);
</script>

<template>
  <el-row :gutter="10">
    <el-col :span="24" class="mb10">
      <system-info :attr="attr" :state="state"></system-info>
    </el-col>
    <el-col :span="24" class="mb10">
      <cpu-usage :node-id="nodeId"></cpu-usage>
    </el-col>
    <el-col :span="24" class="mb10">
      <memery-usage :node-id="nodeId" :state="state"></memery-usage>
    </el-col>
<!--    <el-col :span="24" class="mb10">
      <disk-usage></disk-usage>
    </el-col>-->
    <el-col :span="24" class="mb10">
      <network-usage :node-id="nodeId"></network-usage>
    </el-col>
    <el-col :span="24" class="mb10">
      <connect-usage :node-id="nodeId"></connect-usage>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">

</style>