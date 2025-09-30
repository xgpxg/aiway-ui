<script setup>

</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input prefix-icon="search" placeholder="搜索路由名称/匹配规则/关联服务"></el-input>
      <el-button class="ml20" icon="search">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary">添加路由</el-button>
    </div>
    <div class="mt20">
      <el-table>
        <el-table-column label="路由名称" width="200"></el-table-column>
        <el-table-column label="HOST" width="200"></el-table-column>
        <el-table-column label="匹配规则"></el-table-column>
        <el-table-column label="关联服务" width="200"></el-table-column>
        <el-table-column label="更新时间" width="200"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>