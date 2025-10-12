<script setup lang="ts">

import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import AddPlugin from "./add-plugin.vue";

const plugins = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
  total: 0
})
const form = ref({
  filter_text: null
})
onMounted(() => {
  loadPlugins()
})
const loadPlugins = () => {
  R.postJson('/api/plugin/list', {
    page: page.value,
    filter_text: form.value.filter_text
  }).then(res => {
    plugins.value = res.data.list
    page.value.total = res.data.total
  })
}

const deletePlugin = (plugin: any) => {
  R.postJson('/api/plugin/delete', {
    ids: [plugin.id]
  }).then(() => {
    loadPlugins()
  })
}

const addPluginRef = ref()
const currPlugin = ref()
const toEdit = (plugin: any) => {
  currPlugin.value = {...plugin}
  addPluginRef.value.show()
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input v-model="form.filter_text" prefix-icon="search" placeholder="搜索插件名称/功能描述"
                @input="loadPlugins"></el-input>
      <el-button class="ml20" icon="search" @click="loadPlugins">查询</el-button>
      <el-button class="ml20" icon="plus" type="primary" @click="addPluginRef.show()">添加插件</el-button>
    </div>
    <div class="mt20">
      <el-table :data="plugins">
        <el-table-column label="插件名称" prop="name" width="200"></el-table-column>
        <el-table-column label="功能描述" prop="description" min-width="200"></el-table-column>
        <el-table-column label="当前版本" prop="version" width="200"></el-table-column>
        <el-table-column label="插件文件" prop="file" width="300" show-overflow-tooltip>
          <template #default="{row}">
            {{ row['url'].substring(row['url'].lastIndexOf('/') + 21) }}
            <el-button @click="R.download(row['url'])" link icon="download">
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="160"></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button type="primary" link @click="toEdit(row)">修改</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deletePlugin(row)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <add-plugin ref="addPluginRef" v-model:value="currPlugin" @close="loadPlugins"></add-plugin>
</template>

<style scoped lang="scss">

</style>