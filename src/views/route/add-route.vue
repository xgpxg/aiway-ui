<script setup lang="ts">
import {ref, watch} from "vue";
import ServiceSelect from "../service/service-select.vue";
import {R} from "../../utils/R";
import HelpTip from "../../components/Tip/HelpTip.vue";

const value = defineModel('value')

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const formRef = ref()
const defaultForm = {
  id: null,
  name: null,
  description: null,
  service: null,
  host: null,
  path: null,
  prefix: null,
  strip_prefix: 0,
  header: {},
  query: {},
}
const form = ref({
  ...defaultForm
})
const rules = {
  name: [
    {required: true, message: '请输入路由名称', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
  ],
  path: [
    {required: true, message: '请输入路径匹配规则', trigger: 'blur'},
    {min: 1, max: 50, message: '长度在 1 到 100 个字符', trigger: 'blur'}
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
      header[item.name] = item.value
    })

    debugger

    const query = {}
    queries.value.forEach(item => {
      query[item.name] = item.value.value
    })

    let api;
    if (value.value) {
      api = '/api/route/update'
    } else {
      api = '/api/route/add'
    }

    R.postJson(api, {...form.value, header, query}).then(res => {
      if (res.code === 0) {
        isShow.value = false
      }
    })
  })
}

watch(value, (newVal) => {
  if (!newVal) {
    form.value = defaultForm
    return
  }
  form.value = {
    id: newVal.id,
    name: newVal.name,
    service: newVal.service,
    host: newVal.host,
    path: newVal.path,
    prefix: newVal.prefix,
    strip_prefix: newVal.strip_prefix || 0,
    header: newVal.header,
    query: newVal.query,
  }
  headers.value = Object.entries(form.value.header).map(item => {
    return {
      name: item[0],
      value: item[1]
    }
  })
})
</script>

<template>
  <el-drawer v-model="isShow" :title="value ? '修改路由' : '添加路由'" size="500" destroy-on-close>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
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
      <el-form-item label="路径匹配" prop="path">
        <template #label>路径匹配
          <help-tip placement="top-start">
            <p>通过该路径匹配路由，如果配置了“路径前缀”，则完整的请求路径为：【路径前缀】 + 【路径匹配】</p>
            <p>支持的通配符：</p>
            <p>? : 匹配任意单个字符</p>
            <p>* : 匹配零个或多个字符</p>
            <p>** : 匹配多层路径</p>
            <p>{a,b} : 匹配 a 或 b，其中 a 和 b 是以上匹配模式的一种</p>
            <p>[ab] : 匹配 a 或 b，使用 [!ab] 匹配除 a 和 b 之外的任何字符</p>
          </help-tip>
        </template>
        <el-input v-model="form.path" placeholder="路径匹配" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="路径前缀" prop="strip_prefix">
        <template #label>
          路径前缀
          <help-tip placement="top-start">
            <p>当配置了路径前缀时，请求的完整路径为：【路径前缀】 + 【路径匹配】</p>
            <p>该前缀在转发到下游服务时，默认被移除，如果需要保留，请勾选“保留”选项</p>
          </help-tip>
        </template>
        <div class="fill-width flex-space-between">
          <el-input v-model="form.prefix" placeholder="路径前缀" maxlength="100" show-word-limit
                    class="fill-width"></el-input>
          <div class="ml10 half-width">
            <el-radio-group v-model="form.strip_prefix" class="fr">
              <el-radio :label="1">移除</el-radio>
              <el-radio :label="0">保留</el-radio>
            </el-radio-group>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="域名匹配" prop="host">
        <template #label>域名匹配
          <help-tip placement="top-start">
            <p>当配置了域名时，只有Host请求头等于该域名时，才会匹配该路由</p>
          </help-tip>
        </template>
        <el-input v-model="form.host" placeholder="域名匹配" maxlength="100" show-word-limit></el-input>
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
        <el-select clearable></el-select>
        <div class="fill-width bg-card mt10 br5">
          <div class="flex-center">
            <el-text type="info">暂未配置</el-text>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="后置过滤器">
        <el-select clearable></el-select>
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