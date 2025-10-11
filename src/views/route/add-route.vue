<script setup lang="ts">
import {ref, watch} from "vue";
import ServiceSelect from "../service/service-select.vue";
import {R} from "../../utils/R";
import HelpTip from "../../components/Tip/HelpTip.vue";
import PluginDropdown from "../plugin/plugin-dropdown.vue";
import draggable from 'vuedraggable'
import {CodeEditor} from 'monaco-editor-vue3';
import {ElMessage} from "element-plus";

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
  header: {},
  query: {},
  pre_filters: [],
  post_filters: [],
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

    // header数组转对象
    const header = {}
    headers.value.forEach(item => {
      header[item.name] = item.value
    })

    // query数组转对象
    const query = {}
    queries.value.forEach(item => {
      query[item.name] = item.value.value
    })

    // 前置处理器插件配置转换
    form.value.pre_filters?.forEach(item => {
      try {
        item.config = JSON.parse(item.config_text)
      } catch (e) {
        ElMessage.error('插件配置不正确，请检查')
        throw e
      }
    })
    // 后置处理器插件配置转换
    form.value.post_filters?.forEach(item => {
      try {
        item.config = JSON.parse(item.config_text)
      } catch (e) {
        ElMessage.error('插件配置不正确，请检查')
        throw e
      }
    })

    // 清理不必要字段
    form.value.pre_filters?.forEach(item => {
      delete item.config_text
    })
    form.value.post_filters?.forEach(item => {
      delete item.config_text
    })

    let api: string;
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

watch(value, (newVal: any) => {
  if (!newVal) {
    form.value = defaultForm
    return
  }
  form.value = {
    id: newVal.id,
    name: newVal.name,
    description: newVal.description,
    service: newVal.service,
    host: newVal.host,
    path: newVal.path,
    header: newVal.header,
    query: newVal.query,
    pre_filters: newVal.pre_filters?.map((item: any) => ({
      ...item,
      // 配置转字符串，以便在编辑器中显示和修改
      config_text: JSON.stringify(item.config, null, 2)
    })),
    post_filters: newVal.post_filters?.map((item: any) => ({
      ...item,
      // 配置转字符串，以便在编辑器中显示和修改
      config_text: JSON.stringify(item.config, null, 2)
    })),
  }
  headers.value = Object.entries(form.value.header).map(item => {
    return {
      name: item[0],
      value: item[1]
    }
  })
  queries.value = Object.entries(form.value.query).map(item => {
    return {
      name: item[0],
      value: item[1]
    }
  })
})

const appendPreFilter = (plugin: any) => {
  form.value.pre_filters.push({
    name: plugin.name,
    config: plugin.default_config,
    // 配置转字符串，以便在编辑器中显示和修改
    config_text: JSON.stringify(plugin.default_config, null, 2)
  })
}
const appendPostFilter = (plugin: any) => {
  form.value.post_filters.push({
    name: plugin.name,
    config: plugin.default_config,
    // 配置转字符串，以便在编辑器中显示和修改
    config_text: JSON.stringify(plugin.default_config, null, 2)
  })
}

const activePreFilter = ref(null)
const activePostFilter = ref(null)

// 解决报错：You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker
if (!window['MonacoEnvironment']) {
  window['MonacoEnvironment'] = {
    getWorkerUrl: function (moduleId: string, label: string) {
      if (label === 'json') {
        return './node_modules/monaco-editor/esm/vs/language/json/json.worker.js'
      }
      return './node_modules/monaco-editor/esm/vs/editor/editor.worker.js'
    }
  }
}
const editorOptions = {
  fontSize: 14,
  minimap: {enabled: true},
  automaticLayout: true,
  padding: {
    top: 10,
  },
  lineNumbersMinChars: 3,
};

const reset = () => {
  activePreFilter.value = null
  activePostFilter.value = null
}
</script>

<template>
  <el-drawer v-model="isShow" :title="value ? '修改路由' : '添加路由'" size="500" destroy-on-close @closed="reset">
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
        <template #label>
          <div class="flex-space-between">
            <div class="fill-width">
              前置过滤器
              <el-text type="info" class="ml10" size="small">拖动可调整顺序</el-text>
            </div>
            <plugin-dropdown @select="appendPreFilter"></plugin-dropdown>
          </div>
        </template>
        <div v-if="form.pre_filters.length" class="mt10 fill-width">
          <div style="overflow-x:auto;">
            <draggable v-model="form.pre_filters" v-bind="{animation: 200}" item-key="name" class="plugin-list">
              <template #item="{element, index}">
                <div class="plugin-item" @click="activePreFilter = element"
                     :class="{active:activePreFilter?.name === element.name}">
                  {{ element.name }}

                  <el-button @click.stop="form.pre_filters.splice(index, 1)"
                             class="remove-btn"
                             link
                             icon="close"
                             size="small">
                  </el-button>
                </div>
              </template>
            </draggable>
          </div>
          <div v-if="activePreFilter">
            <CodeEditor
                v-model:value="activePreFilter.config_text"
                language="json"
                :options="editorOptions"
            />
          </div>
        </div>
        <div v-else class="fill-width bg-card mt10 br5 flex-center">
          <el-text type="info">暂未配置</el-text>
        </div>

      </el-form-item>
      <el-form-item label="后置过滤器">
        <template #label>
          <div class="flex-space-between">
            <div class="fill-width">
              后置过滤器
              <el-text type="info" class="ml10" size="small">拖动可调整顺序</el-text>
            </div>
            <plugin-dropdown @select="appendPostFilter"></plugin-dropdown>
          </div>
        </template>
        <div v-if="form.post_filters.length" class="mt10 fill-width">
          <div style="overflow-x:auto;">
            <draggable v-model="form.post_filters" v-bind="{animation: 200}" item-key="name" class="plugin-list">
              <template #item="{element, index}">
                <div class="plugin-item" @click="activePostFilter = element"
                     :class="{active:activePostFilter?.name === element.name}">
                  {{ element.name }}

                  <el-button @click.stop="form.post_filters.splice(index, 1)"
                             class="remove-btn"
                             link
                             icon="close"
                             size="small">
                  </el-button>
                </div>
              </template>
            </draggable>
          </div>
          <div v-if="activePostFilter">
            <CodeEditor
                v-model:value="activePostFilter.config_text"
                language="json"
                :options="editorOptions"
            />
          </div>
        </div>
        <div v-else class="fill-width bg-card mt10 br5 flex-center">
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

.plugin-list {
  display: flex;
  width: fit-content;

  .plugin-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 34px;
    margin: 5px 10px 10px 0;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    cursor: pointer;
    position: relative;


    &.active {
      background: var(--el-color-primary);
      color: #ffffff;
    }

    &:hover {
      .remove-btn {
        display: flex;
      }
    }


    .remove-btn {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 12px;
      height: 12px;
      background: #aaa;
      border-radius: 50%;
      color: white;
      display: none;

      :deep(.el-icon) {
        font-size: 12px;
      }

      &:hover {
        scale: 1.2;
      }
    }
  }
}


:deep(.monaco-editor-container) {
  height: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 5px;

  .monaco-editor {
    border-radius: 5px;
  }

  .overflow-guard {
    border-radius: 5px;
  }
}

</style>