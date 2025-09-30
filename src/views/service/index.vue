<script setup>

</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input prefix-icon="search" placeholder="搜索服务名称"></el-input>
      <el-button class="ml20" icon="search">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary">添加服务</el-button>
    </div>
    <div class="mt20">
      <el-table>
        <el-table-column label="服务名" width="200"></el-table-column>
        <el-table-column label="节点数量" width="200"></el-table-column>
        <el-table-column label="分组"></el-table-column>
        <el-table-column label="状态" width="200"></el-table-column>
        <el-table-column label="创建时间" width="200"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>