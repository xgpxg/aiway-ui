<script setup lang="ts">

import HelpTip from "../../components/Tip/HelpTip.vue";
import PluginDropdown from "../plugin/plugin-dropdown.vue";
import {onMounted, ref, watch} from "vue";
import draggable from 'vuedraggable'
import {CodeEditor} from 'monaco-editor-vue3'
import {R} from "../../utils/R";
import {ElMessage} from "element-plus";

const isShow = ref(false)
const show = () => {
  isShow.value = true
}
defineExpose({
  show
})

const formRef = ref()
const defaultForm = {
  pre_filters: [],
  post_filters: [],
}
const form = ref(structuredClone(defaultForm))
const rules = {}

onMounted(() => {
  load()
})

const load = () => {
  R.postJson('/api/route/global_filter').then(res => {
    form.value = res.data

    if (!form.value) {
      form.value = defaultForm
      return
    }
    form.value = {
      pre_filters: form.value.pre_filters?.map((item: any) => ({
        ...item,
        // 配置转字符串，以便在编辑器中显示和修改
        config_text: JSON.stringify(item.config, null, 2)
      })),
      post_filters: form.value.post_filters?.map((item: any) => ({
        ...item,
        // 配置转字符串，以便在编辑器中显示和修改
        config_text: JSON.stringify(item.config, null, 2)
      })),
    }
  })
}

const save = () => {
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
  R.postJson('/api/route/global_filter/update', {
    pre_filters: form.value.pre_filters,
    post_filters: form.value.post_filters
  }).then(res => {
    if (res.code === 0) {
      isShow.value = false
      ElMessage.success('已更新')
    }
  })
}

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
  minimap: {enabled: false},
  automaticLayout: true,
  padding: {
    top: 10,
  },
  lineNumbersMinChars: 3,
};

const reset = () => {
  activePreFilter.value = null
  activePostFilter.value = null
  // form.value = structuredClone(defaultForm)
}
</script>

<template>
  <el-dialog v-model="isShow" title="路由全局插件" size="500" destroy-on-close @closed="reset">
    <div class="bg-card mb20 br5">
      <div class="mt10">💡 路由全局插件对所有路由生效，按以下顺序执行。</div>
      <el-image src="/images/plugin-chain.png"></el-image>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" require-asterisk-position="right">
      <el-form-item label="前置过滤器">
        <template #label>
          <div class="flex-space-between">
            <div class="fill-width">
              全局前置过滤器
              <help-tip placement="top-start">
                <p>前置过滤器插件在调用目标服务之前执行，在此可以修改请求路径、请求头、参数等。</p>
              </help-tip>
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
              全局后置过滤器
              <help-tip placement="top-start">
                <p>后置过滤器插件在网关返回响应前执行，在此可以修改响应头、响应参数据等。</p>
              </help-tip>
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
  </el-dialog>
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
  height: 100px;
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