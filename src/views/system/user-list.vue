<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";
import AddUser from "./add-user.vue";
import ResetPassword from "./reset-password.vue";

const users = ref([])
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
  loadUsers()
})
const loadUsers = () => {
  R.postJson('/api/user/manage/list', {
    page: page.value,
    filter_text: form.value.filter_text,
    status: form.value.status
  }).then(res => {
    users.value = res.data.list
    page.value.total = res.data.total
  })
}

const deleteUser = (row: any) => {
  R.postJson('/api/user/manage/delete', {
    ids: [row.id]
  }).then(() => {
    loadUsers()
  })
}

const addUserRef = ref()
const resetPasswordRef = ref()

const currUser = ref()
const toResetPassword = (row: any) => {
  currUser.value = {...row}
  resetPasswordRef.value.show()
}
</script>

<template>
  <div class="pd20">
    <div class="flex-v">
      <el-input v-model="form.filter_text" prefix-icon="search" placeholder="搜索用户名/昵称"
                @input="loadUsers"></el-input>
      <el-button class="ml20" icon="plus" type="primary" @click="addUserRef.show()">添加用户</el-button>
    </div>
    <div class="mt20">
      <el-table :data="users">
        <el-table-column label="用户名" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户昵称" prop="nickname" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" width="200" prop="create_time">
          <template #default="{row}">
            {{ row.create_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="200" prop="create_time">
          <template #default="{row}">
            {{ row.update_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" width="200" prop="last_login_time">
          <template #default="{row}">
            {{ row.last_login_time || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" link @click="toEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="toResetPassword(row)">重置密码</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteUser(row)">
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
          @current-change="(pageNum: number) => {page.page_num = pageNum; loadUsers()}"
          class="mt10 fr">
      </el-pagination>
    </div>
  </div>

  <add-user ref="addUserRef" @close="loadUsers"></add-user>
  <reset-password ref="resetPasswordRef" v-model="currUser"></reset-password>
</template>

<style scoped lang="scss">

</style>