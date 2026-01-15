<script setup>
const VERSION = import.meta.env.VITE_VERSION

</script>

<template>
  <el-descriptions>
    <el-descriptions-item label="当前版本">{{ VERSION }}</el-descriptions-item>
  </el-descriptions>
</template>

<style scoped lang="scss">

</style>