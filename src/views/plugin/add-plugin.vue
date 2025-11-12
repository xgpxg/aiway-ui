<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";
import {CodeEditor} from 'monaco-editor-vue3';

const value = defineModel('value')

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const defaultForm = {
  id: null,
  name: null,
  description: null,
  version: null,
  file: null,
  // JSON字符串形式
  default_config: null,
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  description: [
    {required: true, message: '请简要描述插件功能', trigger: 'blur'},
  ],
  version: [
    {required: true, message: '请输入版本号', trigger: 'blur'},
  ],
  file: [
    {required: true, message: '请选择插件文件', trigger: 'change'},
  ],
}

const save = () => {
  formRef.value.validate().then((ok: boolean) => {
    if (!ok) {
      return
    }
    let api: string;
    if (value.value) {
      api = '/api/plugin/update'
    } else {
      api = '/api/plugin/add'
    }
    R.post(api, {
      id: form.value.id,
      name: form.value.name,
      description: form.value.description,
      version: form.value.version,
      file: form.value.file,
      default_config: form.value.default_config
    }).then(res => {
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
    ...defaultForm, ...newVal,
    // default_config返回值为Object，转为JSON字符串，以便在编辑器中展示和修改
    default_config: newVal.default_config ? JSON.stringify(newVal.default_config, null, 2) : null
  }
})

const reset = () => {
  form.value = structuredClone(defaultForm)
  value.value = null
}

const pluginFileChange = (file: any) => {
  form.value.file = file.raw
}
const pluginFileExceed = (files: any) => {
  form.value.file = files[0]
}

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
  minimap: {enabled: false},
  automaticLayout: true,
  padding: {
    top: 10,
  },
  lineNumbersMinChars: 3,
};

</script>

<template>
  <el-drawer v-model="isShow" :title="value ? '修改插件' : '添加插件'" size="500" destroy-on-close @closed="reset">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="插件名称" prop="name">
        <el-input v-model="form.name" placeholder="填写插件名称，新增后不可修改" maxlength="100"
                  show-word-limit :disabled="!!value"></el-input>
      </el-form-item>
      <el-form-item label="插件功能" prop="description">
        <el-input v-model="form.description" placeholder="简要描述插件功能" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="插件文件" :prop="!value?'file':''">
        <div class="fill-width flex-space-between">
          <el-upload :auto-upload="false"
                     :show-file-list="false"
                     :on-change="pluginFileChange"
                     :on-exceed="pluginFileExceed"
                     :limit="1"
                     accept=".so"
          >
            <el-button>选择文件</el-button>
          </el-upload>
          <div>
            <template v-if="form.file">
              <el-tag size="large" disable-transitions style="font-size: 14px">
                {{ form.file?.name }}
              </el-tag>
            </template>
            <template v-else-if="form.url">
              <el-tag size="large" disable-transitions style="font-size: 14px">
                {{ form['url'].substring(form['url'].lastIndexOf('/') + 21) }}
              </el-tag>
            </template>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="插件版本" prop="version">
        <el-input v-model="form.version" placeholder="填写插件版本" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="默认配置" prop="default_config">
        <template #label>
          <div class="flex-space-between">
            <span>默认配置</span>
            <el-text type="info" size="small">仅支持JSON格式</el-text>
          </div>
        </template>
        <CodeEditor
            v-model:value="form.default_config"
            language="json"
            :options="editorOptions"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  width: 100%;
  padding-right: 0;
}

:deep(.el-form-item__error--inline) {
  margin-left: 0;
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