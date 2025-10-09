<script setup lang="ts">
import {ref} from "vue";
import ServiceSelect from "../service/service-select.vue";
import {R} from "../../utils/R";

const isShow = ref(false)

const show = () => {
  isShow.value = true
}

const form = ref({
  name: null,
  description: null,
  service: null,
  host: null,
  path: null,
  header: {},
  query: {},
})
const formRef = ref()
const rules = {
  name: [
    {required: true, message: '请输入路由名称', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  host: [
    {required: true, message: '请输入域名', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  path: [
    {required: true, message: '请输入路径匹配规则', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  service: [
    {required: true, message: '请选择关联服务', trigger: 'blur'}
  ]
}
const headers = ref([])
const queries = ref([])

const save = () => {
  formRef.value.validate().then(ok => {
    if (!ok) {
      return
    }
    const header = {}
    headers.value.forEach(item => {
      header[item.name] = item.value.value
    })

    const query = {}
    queries.value.forEach(item => {
      query[item.name] = item.value.value
    })
    R.postJson('/api/route/add', {...form.value, header, query}).then(res => {
      if (res.code === 0) {
        isShow.value = false
      }
    })
  })
}

defineExpose({
  show
})
</script>

<template>
  <el-drawer v-model="isShow" title="添加路由" size="500">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <div class="title-block">基本信息</div>
      <el-form-item label="路由名称" prop="name">
        <el-input v-model="form.name" placeholder="路由名称" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="路由描述" prop="description">
        <el-input v-model="form.description" placeholder="路由描述" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <div class="title-block">目标服务</div>
      <el-form-item label="关联服务" prop="service">
        <service-select v-model="form.service" placeholder="关联服务"></service-select>
      </el-form-item>
      <div class="title-block">匹配规则</div>
      <el-form-item label="域名匹配" prop="host">
        <el-input v-model="form.host" placeholder="域名匹配" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="路径匹配" prop="path">
        <el-input v-model="form.path" placeholder="路径匹配" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Header匹配" prop="header">
        <template #label>
          <div class="flex-space-between fill-width">
            <div>Header匹配</div>
            <div>
              <el-button @click="headers.push({name:'',value:''})" link icon="plus"></el-button>
            </div>
          </div>
        </template>
        <div v-if="headers.length===0" class="fill-width bg-card mt10 br5 flex-center">
          <el-text type="info">暂未配置，请点击右侧按钮添加</el-text>
        </div>
        <div v-for="header in headers" class="flex-space-between fill-width mb10">
          <el-input v-model="header.name" placeholder="名称"></el-input>
          <el-text class="ml5 mr5">-</el-text>
          <el-input v-model="header.value" placeholder="值"></el-input>
          <el-button @click="headers.splice(headers.indexOf(header),1)" link icon="minus" class="ml10"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="URL参数匹配" prop="query">
        <template #label>
          <div class="flex-space-between fill-width">
            <div>URL参数匹配</div>
            <div class="fr">
              <el-button @click="queries.push({name:'',value:''})" link icon="plus"></el-button>
            </div>
          </div>
        </template>
        <div v-if="queries.length===0" class="fill-width bg-card mt10 br5 flex-center">
          <el-text type="info">暂未配置，请点击右侧按钮添加</el-text>
        </div>
        <div v-for="query in queries" class="flex-space-between fill-width mb10">
          <el-input v-model="query.name" placeholder="名称"></el-input>
          <el-text class="ml5 mr5">-</el-text>
          <el-input v-model="query.value" placeholder="值"></el-input>
          <el-button @click="queries.splice(queries.indexOf(query),1)" link icon="minus" class="ml10"></el-button>
        </div>
      </el-form-item>
      <div class="title-block">插件</div>
      <el-form-item label="前置过滤器">
        <el-select></el-select>
        <div class="fill-width bg-card mt10 br5">
          <div class="flex-center">
            <el-text type="info">暂未配置</el-text>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="后置过滤器">
        <el-select></el-select>
        <div class="fill-width bg-card mt10 br5 flex-center">
          <el-text type="info">暂未配置</el-text>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button @click="save" type="primary">保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  width: 100%;
  padding-right: 0;
}
</style>