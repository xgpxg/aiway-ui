<script setup>

</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-select class="mr20" placeholder="级别" style="width: 200px">
        <el-option label="全部" value=""></el-option>
        <el-option label="DEBUG" value="DEBUG"></el-option>
        <el-option label="INFO" value="INFO"></el-option>
        <el-option label="WARN" value="WARN"></el-option>
        <el-option label="ERROR" value="ERROR"></el-option>
      </el-select>
      <el-date-picker class="mr20" type="datetimerange" start-placeholder="开始时间"
                      end-placeholder="结束时间"></el-date-picker>
      <el-input prefix-icon="search" placeholder="搜索日志关键字"></el-input>
      <el-button class="ml20" icon="search">查询</el-button>
    </div>
    <div class="mt20">
      <el-table>
        <el-table-column label="时间" width="200"></el-table-column>
        <el-table-column label="级别" width="200"></el-table-column>
        <el-table-column label="内容"></el-table-column>
        <el-table-column label="来源服务" width="200"></el-table-column>
        <el-table-column label="操作" width="200"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>