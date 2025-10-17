<script setup lang="ts">

import AddApiKey from "./add-api-key.vue";

import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import CopyText from "../../components/Copy/copy-text.vue";

const apiKeys = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null,
  status: null
})
onMounted(() => {
  loadApiKeys()
})
const loadApiKeys = () => {
  R.postJson('/api/key/list', {
    page: page.value,
    filter_text: form.value.filter_text,
    status: form.value.status
  }).then(res => {
    apiKeys.value = res.data.list
    page.value.total = res.data.total
  })
}

const deleteApiKey = (apiKey: any) => {
  R.postJson('/api/key/delete', {
    ids: [apiKey.id]
  }).then(() => {
    loadApiKeys()
  })
}

const addApiKeyRef = ref()

const currApiKey = ref()
const toEdit = (apiKey: any) => {
  currApiKey.value = {...apiKey}
  addApiKeyRef.value.show()
}


</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input v-model="form.filter_text" prefix-icon="search" placeholder="搜索名称/所属主体"
                @input="loadApiKeys"></el-input>
      <el-button class="ml20" icon="search" @click="loadApiKeys">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary" @click="addApiKeyRef.show()">添加密钥</el-button>
    </div>
    <div class="mt20">
      <el-table :data="apiKeys">
        <el-table-column label="名称" prop="name" width="200"></el-table-column>
        <el-table-column label="所属主体" prop="principal" width="200">
          <template #default="{row}">
            <template v-if="row.principal">
              {{ row.principal }}
            </template>
            <el-text v-else type="info">未设置</el-text>
          </template>
        </el-table-column>
        <el-table-column label="API Key" prop="secret">
          <template #default="{row}">
            {{ row.secret.substring(0, 8) }} ****** {{ row.secret.substring(row.secret.length - 4) }}
            <copy-text :text="row.secret" class="ml5"></copy-text>
          </template>
        </el-table-column>
        <el-table-column label="到期时间" prop="exp_time" width="200">
          <template #default="{row}">
            <template v-if="row.row">
              {{ row.row }}
            </template>
            <el-text v-else type="info">未设置</el-text>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="200"></el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{row}">
            <!--            <el-button link type="primary" @click="toEdit(row)">编辑</el-button>-->
            <el-popconfirm title="确定删除吗？" @confirm="deleteApiKey(row)">
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
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadApiKeys()}"
          class="mt10 fr">
      </el-pagination>
    </div>
    <add-api-key ref="addApiKeyRef" v-model:value="currApiKey" @close="loadApiKeys"></add-api-key>
  </div>
</template>

<style scoped lang="scss">

</style>