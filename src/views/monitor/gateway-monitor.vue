<script setup lang="ts">

</script>

<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <div class="card">
        <div class="title">
          运行状态
        </div>
        <div class="mt5">
          <div>
            <span class="number success">3</span>
            <el-text type="info" size="large" class="ml5  mr5">/</el-text>
            <span class="number">10</span>
          </div>
        </div>
        <div class="mt5">
          <el-text size="small">7个节点异常，请关注</el-text>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card">
        <div class="title">
          <el-text type="info" size="small">
            连接状态
          </el-text>
        </div>
        <div class="mt5">
          <div>
            <span class="number">203,312</span>
            <el-text type="info" size="small" class="ml10">个连接</el-text>
          </div>
        </div>
        <div class="flex-space-between mt5">
          <div>
            <el-text size="small" type="info">HTTP：</el-text>
            <el-text size="small" type="info">203,00</el-text>
          </div>
          <div>
            <el-text size="small" type="info">SSE：</el-text>
            <el-text size="small" type="info">312</el-text>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card">
        <div class="title">
          <el-text type="info" size="small">
            性能指标
          </el-text>
        </div>
        <div class="mt5">
          <div>
            <span class="number">12,192</span>
            <el-text type="info" size="small" class="ml10">QPS</el-text>
          </div>
        </div>
        <div class="flex-space-between mt5">
          <div>
            <el-text size="small" type="info">IN：</el-text>
            <el-text size="small" type="info">103 MB</el-text>
          </div>
          <div>
            <el-text size="small" type="info">OUT：</el-text>
            <el-text size="small" type="info">1.12 GB</el-text>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <div class="card">
        <div class="title">
          <el-text type="info" size="small">
            性能指标
          </el-text>
        </div>
        <div class="mt5">
          <div>
            <span class="number">12,192</span>
            <el-text type="info" size="small" class="ml10">QPS</el-text>
          </div>
        </div>
        <div class="flex-space-between mt5">
          <div>
            <el-text size="small" type="info">IN：</el-text>
            <el-text size="small" type="info">103 MB</el-text>
          </div>
          <div>
            <el-text size="small" type="info">OUT：</el-text>
            <el-text size="small" type="info">1.12 GB</el-text>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.card {
  //border: 1px solid #f0f0f0;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px 20px;
  //box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: var(--el-font-size-extra-small);
    color: var(--el-text-color-secondary)
  }
}

.number {
  font-size: 20px;
  font-weight: 600;

  &.success {
    color: #67c23a;
  }
}

</style>