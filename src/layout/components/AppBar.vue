<script setup lang="ts">
import {ref} from "vue";

const active = ref('1')
</script>

<template>
  <div class="" style="width:100%">
    <el-menu
        :default-active="active"
        class="fill-width"
        mode="horizontal"
        @select="handleSelect"
    >
      <el-menu-item index="1">网关</el-menu-item>
      <el-menu-item index="2">模型代理</el-menu-item>
      <el-menu-item index="3">模型部署</el-menu-item>
    </el-menu>
  </div>
</template>


<style lang="scss" scoped>
:deep(.el-menu--horizontal) {
  &.el-menu {
    border-bottom: none;
  }
}
</style>