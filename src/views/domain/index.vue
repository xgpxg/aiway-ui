<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import AddDomain from "./add-domain.vue";

const domains = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null,
  status: null,
  protocol: null
})
onMounted(() => {
  loadDomains()
})
const loadDomains = () => {
  R.postJson('/api/domain/list', {
    page: page.value,
    filter_text: form.value.filter_text,
    status: form.value.status,
    protocol: form.value.protocol
  }).then(res => {
    domains.value = res.data.list
    page.value.total = res.data.total
  })
}

const deleteDomain = (domain: any) => {
  R.postJson('/api/domain/delete', {
    ids: [domain.id]
  }).then(() => {
    loadDomains()
  })
}

const addDomainRef = ref()

const currDomain = ref()
const toEdit = (domain: any) => {
  currDomain.value = {...domain}
  addDomainRef.value.show()
}

const updateStatus = (domain: any, status: string) => {
  R.postJson('/api/domain/update_status', {
    id: domain.id,
    status: status
  }).then(() => {
    loadDomains()
  })
}
</script>

<template>
  <div>
    <div class="flex-v">
      <el-select v-model="form.status" @change="loadDomains" placeholder="状态" style="width: 200px" class="mr10"
                 clearable>
        <el-option label="启用" value="Ok"></el-option>
        <el-option label="停用" value="Disable"></el-option>
      </el-select>
      <el-select v-model="form.protocol" @change="loadDomains" placeholder="协议" style="width: 200px" class="mr10"
                 clearable>
        <el-option label="HTTP" value="HTTP"></el-option>
        <el-option label="HTTPS" value="HTTPS"></el-option>
      </el-select>
      <el-input v-model="form.filter_text" prefix-icon="search" placeholder="搜索域名"
                @input="loadDomains"></el-input>
      <el-button class="ml20" icon="search" @click="loadDomains">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary" @click="addDomainRef.show()">添加域名</el-button>
    </div>
    <div class="mt20">
      <el-table :data="domains">
        <el-table-column label="域名" prop="domain" show-overflow-tooltip></el-table-column>
        <el-table-column label="协议" width="100" prop="protocol"></el-table-column>
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
            <el-popconfirm title="确定删除吗？" @confirm="deleteDomain(row)">
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
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadDomains()}"
          class="mt10 fr">
      </el-pagination>
    </div>
  </div>
  <add-domain ref="addDomainRef" v-model:value="currDomain" @close="loadDomains"></add-domain>
</template>

<style scoped lang="scss">

</style>
