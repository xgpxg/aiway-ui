<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import {U} from "../../utils/util";
import SvgIcon from "../../components/SvgIcon/index.vue";

const logs = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null,
  service: null,
  start_time: null,
  end_time: null
})
onMounted(() => {
  loadLogs()
})
const loadLogs = () => {
  R.postJson('/api/log/list/request-logs', {
    page: page.value,
    filter_text: form.value.filter_text ? 'path:' + form.value.filter_text : null,
    service: form.value.service,
    start_time: form.value.start_time,
    end_time: form.value.end_time
  }).then(res => {
    logs.value = res.data.list
    page.value.total = res.data.total
  })
}

const isShowViewLogDialog = ref(false)
const currLog = ref(null)
const toView = (log: any) => {
  currLog.value = log
  isShowViewLogDialog.value = true
}


</script>

<template>
  <div class="flex-v">
    <el-date-picker v-model="form.start_time" @change="loadLogs" class="mr20" type="datetime"
                    style="width: 480px"
                    placeholder="开始时间" value-format="YYYY-MM-DDTHH:mm:ss.SSS"></el-date-picker>
    <el-date-picker v-model="form.end_time" @change="loadLogs" class="mr20" type="datetime" style="width: 480px"
                    placeholder="结束时间" value-format="YYYY-MM-DDTHH:mm:ss.SSS"></el-date-picker>
    <el-input v-model="form.filter_text" @input="loadLogs" prefix-icon="search"
              placeholder="请求路径" clearable></el-input>
    <el-button class="ml20" icon="search" @click="loadLogs" type="primary">查询</el-button>
    <el-button class="ml20">
      <svg-icon icon-class="clean"></svg-icon>
      清理
    </el-button>
  </div>
  <div class="mt20">
    <el-table :data="logs" max-height="calc(100vh - 200px)">
      <el-table-column label="请求ID" prop="request_id" min-width="100" show-overflow-tooltip>
        <template #default="{row}">
          <el-text>{{ row.request_id }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="请求时间" prop="request_time" width="200">
        <template #default="{row}">
          <el-text>{{ U.dateUtil.formatDate(row.request_time, 'yyyy-MM-dd hh:mm:ss.S') }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="路径" prop="path" min-width="150" show-overflow-tooltip>
        <template #default="{row}">
          <el-text>{{ row.method }} {{ row.path }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="响应码" prop="status_code" width="80">
        <template #default="{row}">
          <el-text>{{ row.status_code }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="响应时间" prop="response_time" width="200">
        <template #default="{row}">
          <el-text>{{ U.dateUtil.formatDate(row.response_time, 'yyyy-MM-dd hh:mm:ss.S') }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="耗时" prop="elapsed" width="120">
        <template #default="{row}">
          <el-text>{{ row.elapsed }} ms</el-text>
        </template>
      </el-table-column>
      <el-table-column label="地区" prop="client_province" width="150" show-overflow-tooltip>
        <template #default="{row}">
          <el-text v-if="row.client_city === '内网IP'">
            内网
          </el-text>
          <el-text v-else if="row.client_country==='0'">
            未知
          </el-text>
          <el-text v-else>
            {{ row.client_country }}
            <el-text v-if="row.client_province!=='0'">
              / {{ row.client_province }}
            </el-text>
          </el-text>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template #default="{row}">
          <el-button type="primary" link @click="toView(row)">详情</el-button>
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
  <el-dialog v-model="isShowViewLogDialog" title="日志详情" destroy-on-close>
    <div class="" v-if="currLog">
      <el-descriptions :column="2">
        <el-descriptions-item label="请求ID">{{ currLog.request_id }}</el-descriptions-item>
        <el-descriptions-item label="客户端IP">{{ currLog.client_ip }}</el-descriptions-item>
        <el-descriptions-item label="国家">{{
            currLog.client_country === '0' ? '未知' : currLog.client_country
          }}
        </el-descriptions-item>
        <el-descriptions-item label="省份">{{
            currLog.client_province === '0' ? '未知' : currLog.client_province
          }}
        </el-descriptions-item>
        <el-descriptions-item label="城市">{{ currLog.client_city }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">{{ currLog.method }}</el-descriptions-item>
        <el-descriptions-item label="请求路径">{{ currLog.path }}</el-descriptions-item>
        <el-descriptions-item label="请求时间">{{
            U.dateUtil.formatDate(currLog.request_time, 'yyyy-MM-dd hh:mm:ss.S')
          }}
        </el-descriptions-item>
        <el-descriptions-item label="响应时间">
          {{ U.dateUtil.formatDate(currLog.response_time, 'yyyy-MM-dd hh:mm:ss.S') }}
        </el-descriptions-item>
        <el-descriptions-item label="处理耗时">{{ currLog.elapsed }} ms</el-descriptions-item>
        <el-descriptions-item label="状态码">{{ currLog.status_code }}</el-descriptions-item>
        <el-descriptions-item label="响应大小">{{ currLog.response_size }} 字节</el-descriptions-item>
        <el-descriptions-item label="User Agent">{{ currLog.user_agent }}</el-descriptions-item>
        <el-descriptions-item label="Referer">{{ currLog.referer || '无' }}</el-descriptions-item>
        <el-descriptions-item label="网关节点">{{ currLog.node_address }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>