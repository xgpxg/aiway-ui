<script setup>

</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="card">
          <div class="title">
            今日请求数：<span class="number">1,000</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>累计：123,123,899</el-text>
              <el-text>较昨日：↑ 13.12%</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="title">
            当前连接数：<span class="number">32</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>短连接：11</el-text>
              <el-text>SSE：21</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="title">
            失败响应数：<span class="number">13</span>
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>安全拦截：213</el-text>
              <el-text type="warning">4xx：2</el-text>
              <el-text type="danger">5xx：11</el-text>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card">
          <div class="title">
            网关状态：正常
          </div>
          <div class="content">
            <div class="flex-space-between">
              <el-text>共 3 个节点</el-text>
              <el-text>3 运行中</el-text>
              <el-text>0 异常</el-text>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 16px;

    .number {
      font-size: 16px;
      color: var(--el-color-primary);
    }
  }

  .content {
    margin-top: 10px;
  }

}
</style>