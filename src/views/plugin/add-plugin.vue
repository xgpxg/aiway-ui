<script setup lang="ts">
import {ref, watch} from "vue";
import {R} from "../../utils/R";
import {CodeEditor} from 'monaco-editor-vue3';
import {UploadFilled} from '@element-plus/icons-vue';
import {ElMessage} from 'element-plus';
import {copyText} from 'vue3-clipboard';
import MdPreview from '../../components/Editor/MdPreview.vue';
import SvgIcon from "../../components/SvgIcon/index.vue";

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
  checksum: null,
  file: null,
  // JSON字符串形式
  default_config: null,
  document: '',
  readme: null,
  url: null
}
const form = ref(structuredClone(defaultForm))
const formRef = ref()
const rules = {
  name: [
    {required: true, message: '请输入名称', trigger: 'blur'},
  ],
  version: [
    {required: true, message: '请输入版本号', trigger: 'blur'},
  ],
  file: [
    {required: true, message: '请选择插件文件', trigger: 'change'},
  ],
}

const info = () => {
  R.post('/api/plugin/info', {file: form.value.file}).then(res => {
    if (res.code === 0) {
      form.value = {
        ...form.value, ...res.data,
        // default_config返回值为Object，转为JSON字符串，以便在编辑器中展示和修改
        default_config: res.data.default_config ? JSON.stringify(res.data.default_config, null, 2) : null
      }
    }
  })
}

watch(() => form.value.file, (newFile) => {
  if (newFile) { // 只在 file 有值时调用
    info()
  }
})
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
      default_config: form.value.default_config,
      document: form.value.document,
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

const copyChecksum = () => {
  if (!form.value.checksum) {
    return
  }
  copyText(form.value.checksum, undefined, () => {
    ElMessage.success('已复制到剪贴板')
  })
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
  <el-drawer v-model="isShow" :title="value ? '修改插件' : '添加插件'" size="600" destroy-on-close @closed="reset"
             :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="插件文件" :prop="!value?'file':''">
        <div class="fill-width flex-space-between flex-v">
          <el-upload :auto-upload="false"
                     :show-file-list="false"
                     :on-change="pluginFileChange"
                     :on-exceed="pluginFileExceed"
                     :limit="1"
                     accept=".wasm"
          >
            <el-button icon="Plus">选择 WASM 插件</el-button>
          </el-upload>
          <div v-if="form.file || form.url">
            <el-tag size="large" disable-transitions style="font-size: 14px">
              {{ form.file ? form.file.name : form['url'].substring(form['url'].lastIndexOf('/') + 21) }}
            </el-tag>
          </div>
        </div>
      </el-form-item>
      <!-- 隐藏表单项保留 name/version 必填校验 -->
      <el-form-item label="插件信息">
        <div class="bg-card br5 fill-width" :class="{'is-empty': !form.name}">
          <template v-if="form.name">
            <div class="flex-space-between">
              <el-text size="large" style=" font-weight: 500;">{{ form.name }}</el-text>
              <div>
                <el-tag v-if="form.version" type="primary" effect="light" size="small" class="mr10">{{
                    form.version
                  }}
                </el-tag>
                <el-popover>
                  <template #reference>
                    <el-tag size="small">checksum</el-tag>
                  </template>
                  <code>{{ form.checksum }}</code>
                  <el-button link type="primary" size="small" class="checksum-copy" @click="copyChecksum">复制
                  </el-button>
                </el-popover>
              </div>
            </div>

            <div class="mt10">
              <el-text v-if="form.description" type="info">{{ form.description }}</el-text>
            </div>
          </template>
          <div v-else class="color-secondary">
            选择插件后自动解析
          </div>
        </div>
      </el-form-item>
      <!--      <el-form-item label="功能描述" prop="description">
              <el-input v-model="form.description" placeholder="简要描述插件功能" maxlength="500" show-word-limit></el-input>
            </el-form-item>-->
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
      <el-form-item label="插件手册" prop="document" v-if="form.readme">
        <MdPreview v-if="form.readme" :value="form.readme"/>
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


:deep(.el-upload) {
  width: 100%;
}
</style>