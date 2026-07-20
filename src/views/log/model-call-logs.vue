<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import SvgIcon from "../../components/SvgIcon/index.vue";
import CleanLogDialog from "./clean-log-dialog.vue";

const logs = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  model_name: null,
  provider_name: null,
  start_time: null,
  end_time: null
})
onMounted(() => {
  loadLogs()
})
const loadLogs = () => {
  R.postJson('/api/log/list/model-call-logs', {
    page: page.value,
    model_name: form.value.model_name,
    provider_name: form.value.provider_name,
    start_time: form.value.start_time,
    end_time: form.value.end_time
  }).then(res => {
    logs.value = res.data.list
    page.value.total = res.data.total
  })
}

const isShowCleanDialog = ref(false)
</script>

<template>
  <div class="flex-v">
    <el-date-picker v-model="form.start_time" @change="loadLogs" class="mr20" type="datetime"
                    style="width: 280px"
                    placeholder="开始时间" value-format="YYYY-MM-DDTHH:mm:ss.SSS"></el-date-picker>
    <el-date-picker v-model="form.end_time" @change="loadLogs" class="mr20" type="datetime" style="width: 280px"
                    placeholder="结束时间" value-format="YYYY-MM-DDTHH:mm:ss.SSS"></el-date-picker>
    <el-input v-model="form.model_name" @input="loadLogs" prefix-icon="search"
              placeholder="模型名称" clearable style="width: 180px"></el-input>
    <el-input v-model="form.provider_name" @input="loadLogs" prefix-icon="search"
              placeholder="提供商" clearable style="width: 160px" class="ml10"></el-input>
    <el-button class="ml20" icon="search" @click="loadLogs" type="primary">查询</el-button>
    <el-button class="ml20" @click="isShowCleanDialog = true">
      <svg-icon icon-class="clean"></svg-icon>
      清理
    </el-button>
  </div>
  <div class="mt20">
    <el-table :data="logs" max-height="calc(100vh - 200px)">
      <el-table-column label="请求ID" prop="request_id" min-width="80" show-overflow-tooltip>
        <template #default="{row}">
          <el-text>{{ row.request_id }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="模型名称" prop="model_name" min-width="140" show-overflow-tooltip>
        <template #default="{row}">
          {{ row.model_name }}
        </template>
      </el-table-column>
      <el-table-column label="提供商" prop="provider_name" width="120" show-overflow-tooltip>
        <template #default="{row}">
          <el-text>{{ row.provider_name }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="请求时间" prop="request_time" width="180">
        <template #default="{row}">
          <el-text>{{ U.dateUtil.formatDate(row.request_time, 'yyyy-MM-dd hh:mm:ss.S') }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="耗时" prop="elapsed" width="100">
        <template #default="{row}">
          <el-text>{{ row.elapsed }} ms</el-text>
        </template>
      </el-table-column>
      <el-table-column label="状态码" prop="status_code" width="80">
        <template #default="{row}">
          <el-text v-if="row.status_code >= 400" type="danger">{{ row.status_code }}</el-text>
          <el-text v-else>{{ row.status_code }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="流式" prop="is_stream" width="70">
        <template #default="{row}">
          <el-tag v-if="row.is_stream" type="success" size="small">是</el-tag>
          <el-tag v-else type="info" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="TTFT" prop="ttft_ms" width="90">
        <template #default="{row}">
          <el-text>{{ row.ttft_ms != null ? row.ttft_ms + ' ms' : '-' }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="PT" prop="prompt_tokens" width="80" align="right">
        <template #default="{row}">
          <el-text>{{ row.prompt_tokens != null ? row.prompt_tokens : '-' }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="CT" prop="completion_tokens" width="80" align="right">
        <template #default="{row}">
          <el-text>{{ row.completion_tokens != null ? row.completion_tokens : '-' }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="TT" prop="total_tokens" width="90" align="right">
        <template #default="{row}">
          <el-text type="primary">{{ row.total_tokens != null ? row.total_tokens : '-' }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="网关节点" prop="node_address" width="150" show-overflow-tooltip>
        <template #default="{row}">
          <el-text>{{ row.node_address }}</el-text>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        layout="prev, pager, next, total"
        :page-size="page.page_size"
        :current-page="page.page_num"
        :total="page.total"
        hide-on-single-page
        @current-change="(pageNum: number) => {page.page_num = pageNum; loadLogs()}"
        class="mt10 fr">
    </el-pagination>
  </div>
  <clean-log-dialog v-model="isShowCleanDialog" index="model-call-logs" @success="loadLogs"></clean-log-dialog>
</template>

<style scoped lang="scss">

</style>
