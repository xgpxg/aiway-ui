<script setup>
import {ref, computed, nextTick} from 'vue'
import {R} from '@/utils/R'
import {ElMessage} from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  mcpServerId: {type: Number, required: true}
})

const emit = defineEmits(['update:modelValue', 'success'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const jsonContent = ref('')
const parsedTools = ref([])
const selectedTools = ref([])
const importing = ref(false)
const parseError = ref('')
const urlPrefix = ref('')
const toolsTableRef = ref()

const displayTools = computed(() => {
  const prefix = urlPrefix.value
  return parsedTools.value.map(t => ({
    ...t,
    url: prefix ? prefix + t._path : t.url
  }))
})

/** 解析 OpenAPI 3.0 JSON */
const parseOpenApi = () => {
  parseError.value = ''
  parsedTools.value = []
  selectedTools.value = []

  let spec
  try {
    spec = JSON.parse(jsonContent.value)
  } catch (e) {
    parseError.value = 'JSON 格式错误：' + e.message
    return
  }

  if (!spec.openapi || !spec.openapi.startsWith('3.')) {
    parseError.value = '仅支持 OpenAPI 3.0 规范'
    return
  }
  if (!spec.paths || Object.keys(spec.paths).length === 0) {
    parseError.value = '未找到任何 API 路径（paths）'
    return
  }

  const baseUrl = (spec.servers && spec.servers[0]?.url) || ''
  const httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue

    for (const method of httpMethods) {
      const operation = pathItem[method]
      if (!operation) continue

      const toolName = operation.operationId
          || `${method}_${path.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')}`

      const requestParam = []
      const paramSchema = {type: 'object', properties: {}, required: []}

      // path / query / header 参数
      if (operation.parameters) {
        for (const p of operation.parameters) {
          const mapped = mapParameter(p)
          requestParam.push(mapped)

          const s = p.schema || {type: 'string'}
          paramSchema.properties[p.name] = {
            type: s.type || 'string',
            description: p.description,
            default: s.default,
            enum: s.enum
          }
          if (p.required) paramSchema.required.push(p.name)
        }
      }

      // requestBody - 展平为独立参数
      if (operation.requestBody) {
        const jsonContentType = operation.requestBody.content?.['application/json']
        if (jsonContentType?.schema) {
          const bodySchema = jsonContentType.schema
          const bodyProps = bodySchema.properties
          if (bodyProps && Object.keys(bodyProps).length > 0) {
            // 展平 body 属性到 input_schema
            Object.assign(paramSchema.properties, bodyProps)
            if (bodySchema.required) {
              paramSchema.required.push(...bodySchema.required)
            }
            // 展平为独立的 request_param
            for (const [propName, propSchema] of Object.entries(bodyProps)) {
              requestParam.push({
                id: genId(),
                name: propName,
                description: propSchema.description || '',
                position: 'body',
                dataType: mapDataType(propSchema.type || 'string'),
                required: bodySchema.required?.includes(propName) ? 1 : 0,
                defaultValue: propSchema.default ?? null,
                level: 0,
                enums: propSchema.enum ? propSchema.enum.map(v => ({name: String(v), value: v})) : [],
                children: []
              })
            }
          }
        }
      }

      // 清理空的 required
      if (paramSchema.required.length === 0) delete paramSchema.required
      // 清理空的 properties
      if (Object.keys(paramSchema.properties).length === 0) {
        delete paramSchema.properties
      }

      const outputSchema = extractResponseSchema(operation.responses)

      parsedTools.value.push({
        name: toolName,
        description: operation.summary || operation.description || '',
        input_schema: Object.keys(paramSchema.properties || {}).length > 0 ? paramSchema : null,
        output_schema: outputSchema,
        route_type: 'Url',
        url: baseUrl ? `${baseUrl}${path}` : path,
        method: method.toUpperCase(),
        request_param: requestParam.length > 0 ? requestParam : null,
        // 展示用
        _path: path,
        _method: method.toUpperCase()
      })
    }
  }

  if (parsedTools.value.length === 0) {
    parseError.value = '未解析出任何工具，请检查 OpenAPI 内容'
    return
  }

  // 全选
  nextTick(() => {
    toolsTableRef.value?.toggleAllSelection()
  })
}

/** 提取 200/201 响应中的 JSON Schema */
function extractResponseSchema(responses) {
  if (!responses) return null
  const resp = responses['200'] || responses['201']
  return resp?.content?.['application/json']?.schema || null
}

/** OpenAPI 参数 → request_param 格式 */
function mapParameter(param) {
  const schema = param.schema || {type: 'string'}
  return {
    id: genId(),
    name: param.name,
    description: param.description || '',
    position: param.in === 'header' ? 'header' : 'url',
    dataType: mapDataType(schema.type || 'string'),
    required: param.required ? 1 : 0,
    defaultValue: schema.default ?? null,
    level: 0,
    enums: schema.enum ? schema.enum.map(v => ({name: String(v), value: v})) : [],
    children: []
  }
}

function mapDataType(type) {
  const map = {string: 'string', number: 'number', integer: 'number', boolean: 'bool', object: 'object', array: 'array'}
  return map[type] || 'string'
}

function genId() {
  return Math.random().toString(36).substring(2, 7)
}

/** 全选回调 - 辅助用选中计数 */
const onSelectionChange = (rows) => {
  selectedTools.value = rows.map(t => t.name)
}

/** 重置状态 */
const reset = () => {
  visible.value = false
  jsonContent.value = ''
  urlPrefix.value = ''
  parsedTools.value = []
  selectedTools.value = []
  parseError.value = ''
}

/** 批量导入 */
const importTools = async () => {
  const tools = displayTools.value.filter(t => selectedTools.value.includes(t.name))
  if (tools.length === 0) {
    ElMessage.warning('请至少选择一个工具')
    return
  }

  importing.value = true
  let success = 0, fail = 0

  for (const tool of tools) {
    try {
      const res = await R.postJson('/api/mcp/tool/add', {
        mcp_server_id: props.mcpServerId,
        name: tool.name,
        description: tool.description,
        input_schema: tool.input_schema,
        output_schema: tool.output_schema,
        route_type: tool.route_type,
        url: tool.url,
        method: tool.method,
        request_param: tool.request_param
      })
      if (res.code === 0) success++
      else fail++
    } catch {
      fail++
    }
  }

  importing.value = false

  if (fail === 0) {
    ElMessage.success(`成功导入 ${success} 个工具`)
  } else {
    ElMessage.warning(`导入完成：成功 ${success} 个，失败 ${fail} 个`)
  }

  reset()
  emit('success')
}
</script>

<template>
  <el-dialog v-model="visible" title="从 OpenAPI 3.0 导入" width="60vw" :close-on-click-modal="false" @closed="reset"
             destroy-on-close>
    <!-- 输入阶段 -->
    <template v-if="parsedTools.length === 0">
      <el-input
          v-model="jsonContent"
          type="textarea"
          :rows="14"
          placeholder="请粘贴 OpenAPI 3.0 规范的 JSON 内容"
      />
      <div v-if="parseError" class="mt10">
        <el-alert :title="parseError" type="error" show-icon :closable="false"/>
      </div>
    </template>

    <!-- 预览阶段 -->
    <template v-else>
      <el-alert :title="`共解析出 ${parsedTools.length} 个工具，请勾选要导入的工具`" type="success" show-icon
                :closable="false" class="mb10"/>
      <el-input v-model="urlPrefix" placeholder="接口前缀（可选）" class="mb10" clearable/>
      <el-table ref="toolsTableRef" :data="displayTools" max-height="300" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="name" label="工具名称" min-width="160" show-overflow-tooltip/>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="_method" label="方法" width="80"/>
        <el-table-column prop="url" label="URL" min-width="200" show-overflow-tooltip/>
      </el-table>
    </template>

    <template #footer>


      <el-button @click="reset">取消</el-button>
      <el-button v-if="parsedTools.length === 0" type="primary" :disabled="!jsonContent.trim()" @click="parseOpenApi">
        解析
      </el-button>
      <template v-else>
        <el-button @click="parsedTools = []; parseError = ''">重新填写</el-button>
        <el-button type="primary" :loading="importing" @click="importTools" :disabled="selectedTools.length === 0">
          导入 ({{ selectedTools.length }})
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>
