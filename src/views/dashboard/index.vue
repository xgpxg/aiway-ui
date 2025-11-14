<script setup>

import Statistics from "./statistics.vue";
import RequestChart from "./request-chart.vue";
import NotifyList from "./notify-list.vue";
import RankList from "./rank-list.vue";
</script>

<template>
  <div class="pd10">
    <el-row :gutter="20">
      <el-col :span="24">
        <statistics></statistics>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt10">
      <el-col :span="12">
        <request-chart></request-chart>
      </el-col>
      <el-col :span="12">
        <rank-list></rank-list>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt10">
      <el-col :span="12">

      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>