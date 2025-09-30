<script setup>

</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input prefix-icon="search" placeholder="搜索插件名称"></el-input>
      <el-button class="ml20" icon="search">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary">添加插件</el-button>
    </div>
    <div class="mt20">
      <el-table>
        <el-table-column label="插件名称" width="200"></el-table-column>
        <el-table-column label="功能描述"></el-table-column>
        <el-table-column label="当前版本" width="200"></el-table-column>
        <el-table-column label="插件文件" width="200"></el-table-column>
        <el-table-column label="创建时间" width="200"></el-table-column>
        <el-table-column label="操作" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>