<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";

const routes = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null
})
onMounted(() => {
  loadRoutes()
})
const loadRoutes = () => {
  R.postJson('/api/route/list', {
    page: page.value,
    filter_text: form.value.filter_text
  }).then(res => {
    routes.value = res.data.list
    page.value.total = res.data.total
  })
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input v-model="form.filter_text" @input="loadRoutes" prefix-icon="search"
                placeholder="搜索路由名称/匹配规则/关联服务"></el-input>
      <el-button class="ml20" icon="search" @click="loadRoutes">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary">添加路由</el-button>
    </div>
    <div class="mt20">
      <el-table :data="routes">
        <el-table-column label="路由名称" width="200" prop="name"></el-table-column>
        <el-table-column label="HOST" width="200" prop="host"></el-table-column>
        <el-table-column label="匹配规则" prop="path"></el-table-column>
        <el-table-column label="关联服务" width="200" prop="service"></el-table-column>
        <el-table-column label="更新时间" width="200" prop="update_time">
          <template #default="{row}">
            {{ row.update_time || row.create_time }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button type="primary" link @click="deleteRoute(row)">编辑</el-button>
            <el-button type="danger" link @click="toEdit(row)">删除</el-button>
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
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadRoutes()}"
          class="mt10 fr">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>