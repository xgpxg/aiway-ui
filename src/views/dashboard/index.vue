<script setup>
import GatewayMonitor from "./components/gateway-monitor.vue";
import InvokeMap from "./components/invoke-map.vue";
import NodeList from "./components/node-list.vue";
import RequestChart from "./components/request-chart.vue";
</script>

<template>
  <div class="pd10">
    <el-row :gutter="20">
      <el-col :span="24">
        <gateway-monitor></gateway-monitor>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt10">
      <el-col :span="12">
        <invoke-map></invoke-map>
      </el-col>
      <el-col :span="12">
        <request-chart></request-chart>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt10">
      <el-col :span="24">
        <node-list></node-list>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>