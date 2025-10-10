<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import AddRoute from "./add-route.vue";
import ServiceSelect from "../service/service-select.vue";

const routes = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null,
  service: null,
})
onMounted(() => {
  loadRoutes()
})
const loadRoutes = () => {
  R.postJson('/api/route/list', {
    page: page.value,
    filter_text: form.value.filter_text,
    service: form.value.service
  }).then(res => {
    routes.value = res.data.list
    page.value.total = res.data.total
  })
}

const addRouteRef = ref()

const deleteRoute = (route: any) => {
  R.postJson('/api/route/delete', {
    ids: [route.id]
  }).then(() => {
    loadRoutes()
  })
}

const currRoute = ref(null)
const toEdit = (route: any) => {
  currRoute.value = {...route}
  addRouteRef.value.show()
}

const handleDrawerClose = () => {
  loadRoutes()
  currRoute.value = null
}

const updateStatus = (route: any, status: string) => {
  R.postJson('/api/route/update_status', {
    id: route.id,
    status: status
  }).then(() => {
    loadRoutes()
  })
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-select placeholder="域名" style="width: 200px" class="mr10" clearable></el-select>
      <service-select v-model="form.service" @change="loadRoutes" placeholder="关联服务" clearable style="width: 200px"
                      class="mr10"></service-select>
      <el-input v-model="form.filter_text" @input="loadRoutes" prefix-icon="search"
                placeholder="搜索路由名称/匹配规则/关联服务"></el-input>
      <el-button class="ml10" icon="search" @click="loadRoutes">查询</el-button>
      <el-button class="ml10" icon="plus" type="primary" @click="addRouteRef.show()">添加路由</el-button>
    </div>
    <div class="mt20">
      <el-table :data="routes">
        <el-table-column label="路由名称" min-width="150" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="关联服务" width="150" prop="service"></el-table-column>
        <el-table-column label="域名匹配" width="150" prop="host" show-overflow-tooltip>
          <template #default="{row}">
            <template v-if="row.host">
              {{ row.host }}
            </template>
            <el-text v-else type="info">未配置</el-text>
          </template>
        </el-table-column>
        <el-table-column label="路径匹配" prop="path" min-width="200" show-overflow-tooltip></el-table-column>
        <!--        <el-table-column label="Header匹配" width="120">
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
                </el-table-column>-->
        <el-table-column label="状态" width="80" prop="status">
          <template #default="{row}">
            <el-text v-if="row.status==='Ok'" type="success">已启用</el-text>
            <el-text v-if="row.status==='Disable'" type="danger">已停用</el-text>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="160" prop="update_time">
          <template #default="{row}">
            {{ row.update_time || row.create_time }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button v-if="row.status === 'Disable'" type="primary" link @click="updateStatus(row,'Ok')">启用
            </el-button>
            <el-button v-if="row.status === 'Ok'" type="primary" link @click="updateStatus(row,'Disable')">停用
            </el-button>
            <el-button type="primary" link @click="toEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteRoute(row)">
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
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadRoutes()}"
          class="mt10 fr">
      </el-pagination>
    </div>
  </div>
  <add-route ref="addRouteRef" v-model:value="currRoute" @close="handleDrawerClose"></add-route>
</template>

<style scoped lang="scss">

</style>