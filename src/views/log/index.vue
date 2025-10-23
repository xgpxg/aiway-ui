<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
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
  level: null,
  start_time: null,
  end_time: null
})
onMounted(() => {
  loadLogs()
})
const loadLogs = () => {
  R.postJson('/api/log/list', {
    page: page.value,
    filter_text: form.value.filter_text,
    service: form.value.service,
    level: form.value.level,
    start_time: form.value.start_time,
    end_time: form.value.end_time
  }).then(res => {
    logs.value = res.data.list
    page.value.total = res.data.total
  })
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-select v-model="form.level" @change="loadLogs" clearable class="mr20" placeholder="级别" style="width: 200px">
        <el-option label="DEBUG" value="DEBUG"></el-option>
        <el-option label="INFO" value="INFO"></el-option>
        <el-option label="WARN" value="WARN"></el-option>
        <el-option label="ERROR" value="ERROR"></el-option>
      </el-select>
      <el-date-picker v-model="form.start_time" @change="loadLogs" class="mr20" type="datetime" style="width: 450px"
                      placeholder="开始时间" value-format="YYYY-MM-DDTHH:mm:ss.SSS"></el-date-picker>
      <el-date-picker v-model="form.end_time" @change="loadLogs" class="mr20" type="datetime" style="width: 450px"
                      placeholder="结束时间" value-format="YYYY-MM-DDTHH:mm:ss.SSS"></el-date-picker>
      <el-input v-model="form.filter_text" @input="loadLogs" prefix-icon="search"
                placeholder="搜索日志关键字" clearable></el-input>
      <el-button class="ml20" icon="search" @click="loadLogs" type="primary">查询</el-button>
      <el-button class="ml20">
        <svg-icon icon-class="clean"></svg-icon>
        清理
      </el-button>
    </div>
    <div class="mt20">
      <el-table :data="logs" max-height="calc(100vh - 200px)">
        <el-table-column label="时间" prop="time" width="200"></el-table-column>
        <el-table-column label="级别" prop="level" width="120">
          <template #default="{row}">
            <el-tag v-if="row.level === 'DEBUG'" type="info" disable-transitions>{{ row.level }}</el-tag>
            <el-tag v-if="row.level === 'INFO'" type="primary" disable-transitions>{{ row.level }}</el-tag>
            <el-tag v-if="row.level === 'WARN'" type="warning" disable-transitions>{{ row.level }}</el-tag>
            <el-tag v-if="row.level === 'ERROR'" type="danger" disable-transitions>{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="来源服务" prop="service" width="120"></el-table-column>
        <el-table-column label="内容" prop="message">
          <template #default="{row}">
           <el-text truncated line-clamp="3">{{row.message}}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200"></el-table-column>
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
  </div>
</template>

<style scoped lang="scss">

</style>