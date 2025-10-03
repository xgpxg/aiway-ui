<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";

const services = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null
})
onMounted(() => {
  loadServices()
})
const loadServices = () => {
  R.postJson('/api/service/list', {
    page: page.value,
    filter_text: form.value.filter_text
  }).then(res => {
    services.value = res.data.list
    page.value.total = res.data.total
  })
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input prefix-icon="search" placeholder="搜索服务名称"></el-input>
      <el-button class="ml20" icon="search" @click="loadServices">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary">添加服务</el-button>
    </div>
    <div class="mt20">
      <el-table :data="services">
        <el-table-column label="服务名" width="200" prop="name"></el-table-column>
        <el-table-column label="描述" width="200" prop="description"></el-table-column>
        <el-table-column label="分组"></el-table-column>
        <el-table-column label="状态" width="120" prop="status"></el-table-column>
        <el-table-column label="节点" width="250">
          <template #default="{row}">
            <el-tag v-for="node in row.nodes">
              {{ node }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负载策略" width="120" prop="lb"></el-table-column>
        <el-table-column label="创建时间" width="170" prop="create_time"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button type="primary" link @click="deleteService(row)">编辑</el-button>
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
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadServices()}"
          class="mt10 fr">
      </el-pagination>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>