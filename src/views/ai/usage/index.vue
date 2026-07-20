<script setup lang="ts">
import UsageOverview from "./components/usage-overview.vue"
import TokenTrend from "./components/token-trend.vue"
import ModelRank from "./components/model-rank.vue"
</script>

<template>
  <div>
    <div class="title-block">用量概览</div>
    <usage-overview class="mb20"></usage-overview>

    <div class="title-block">调用趋势</div>
    <el-row :gutter="20">
      <el-col :span="14">
        <token-trend></token-trend>
      </el-col>
      <el-col :span="10">
        <model-rank></model-rank>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>
