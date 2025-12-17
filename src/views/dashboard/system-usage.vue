<script setup lang="ts">

import CpuUsage from "./components/cpu-usage.vue";
import MemoryUsage from "./components/memory-usage.vue";
</script>

<template>
  <div class="container">
    <div class="node">
      <div class="item">
        <cpu-usage></cpu-usage>
      </div>
      <div class="item">
        <memory-usage></memory-usage>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container{
  height: 100%;
  overflow-x: auto;
  .node{
    display: flex;
    gap: 10px;
    .item{
      width: 300px;
    }
  }
}
</style>