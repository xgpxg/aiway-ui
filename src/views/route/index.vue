<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import AddRoute from "./add-route.vue";

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

const addRouteRef = ref()
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input v-model="form.filter_text" @input="loadRoutes" prefix-icon="search"
                placeholder="搜索路由名称/匹配规则/关联服务"></el-input>
      <el-button class="ml20" icon="search" @click="loadRoutes">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary" @click="addRouteRef.show()">添加路由</el-button>
    </div>
    <div class="mt20">
      <el-table :data="routes">
        <el-table-column label="路由名称" width="200" prop="name"></el-table-column>
        <el-table-column label="域名" width="150" prop="host"></el-table-column>
        <el-table-column label="路径匹配" prop="path" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column label="Header匹配" width="120">
          <template #default="{row}">
            <el-button link v-if="Object.keys(row.header).length>0" type="primary">
              已配置({{ Object.keys(row.header).length }})
            </el-button>
            <el-text v-else type="info">未配置</el-text>
          </template>
        </el-table-column>
        <el-table-column label="URL参数匹配" width="120">
          <template #default="{row}">
            <el-button link v-if="Object.keys(row.query).length>0">
              已配置({{ Object.keys(row.query).length }})
            </el-button>
            <el-text v-else type="info">未配置</el-text>
          </template>
        </el-table-column>
        <el-table-column label="关联服务" width="120" prop="service"></el-table-column>
        <el-table-column label="更新时间" width="170" prop="update_time">
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
  <add-route ref="addRouteRef"></add-route>
</template>

<style scoped lang="scss">

</style>