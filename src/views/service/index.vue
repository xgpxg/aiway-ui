<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import AddService from "./add-service.vue";

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

const deleteService = (route: any) => {
  R.postJson('/api/service/delete', {
    ids: [route.id]
  }).then(() => {
    loadServices()
  })
}

const addServiceRef = ref()

const currService = ref()
const toEdit = (service: any) => {
  currService.value = {...service}
  addServiceRef.value.show()
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input v-model="form.filter_text" prefix-icon="search" placeholder="搜索服务名称"
                @input="loadServices"></el-input>
      <el-button class="ml20" icon="search" @click="loadServices">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary" @click="addServiceRef.show()">添加服务</el-button>
    </div>
    <div class="mt20">
      <el-table :data="services">
        <el-table-column label="服务名" width="200" prop="name"></el-table-column>
        <el-table-column label="描述" width="200" prop="description"></el-table-column>
        <el-table-column label="节点" >
          <template #default="{row}">
            <el-tag v-for="node in row.nodes">
              {{ node }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负载策略" width="120" prop="lb"></el-table-column>
        <el-table-column label="状态" width="120" prop="status"></el-table-column>
        <el-table-column label="创建时间" width="170" prop="create_time"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button type="primary" link @click="toEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteService(row)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
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
  <add-service ref="addServiceRef" v-model:value="currService" @close="loadServices"></add-service>
</template>

<style scoped lang="scss">

</style>