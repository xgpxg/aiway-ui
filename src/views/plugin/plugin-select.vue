<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {CodeEditor} from 'monaco-editor-vue3';

const value = defineModel({
  default: () => ({
    name: null,
    config: {}
  })
})
const plugins = ref([])
const page = ref({
  page_num: 1,
  page_size: 10000,
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
  }, {repeatable: true}).then(res => {
    plugins.value = res.data.list
    plugins.value.forEach(item => {
      if (item.name === value.value?.name) {
        item.config_text = JSON.stringify(value.value.config || item.default_config, null, 2)
      } else {
        item.config_text = JSON.stringify(item.default_config, null, 2)
      }
    })
    page.value.total = res.data.total

    console.log(plugins.value)

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
  <el-select v-model="value" clearable value-key="name">
    <el-option v-for="item in plugins" :value="{name: item.name, config: JSON.parse(item.config_text)}"
               :label="item.name">
      {{ item.name }}
      <el-text type="info" class="fr ellipsis">{{ item.description }}</el-text>
    </el-option>
  </el-select>
  <template v-for="item in plugins">
    <div class="fill-width mt10" v-if="item.name === value?.name">
      <CodeEditor
          v-model:value="item.config_text"
          language="json"
          :options="editorOptions"
          @change="(v:any) => {
            value.config = JSON.parse(v)
          }"
      />
    </div>
  </template>
</template>

<style scoped lang="scss">
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