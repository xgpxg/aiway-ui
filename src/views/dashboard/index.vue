<script setup>

import Statistics from "./statistics.vue";
import RequestChart from "./request-chart.vue";
import NotidyList from "./notidy-list.vue";
</script>

<template>
<div class="pd10">
  <statistics></statistics>
  <el-row :gutter="20" class="mt10">
    <el-col :span="12">
      <request-chart></request-chart>
    </el-col>
    <el-col :span="12">
      <notidy-list></notidy-list>
    </el-col>
  </el-row>
</div>
</template>

<style scoped lang="scss">

</style>