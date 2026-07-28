<script setup lang="ts">
import {ref, watch} from "vue"
import {R} from "../../utils/R"

const props = defineProps<{
  modelValue?: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: number | null): void
  (e: 'select', data: { cert_pem: string | null, key_pem: string | null }): void
  (e: 'clear'): void
}>()

const selectedId = ref<number | null>(props.modelValue ?? null)
const certList = ref<any[]>([])
const loading = ref(false)
const fetching = ref(false)

const loadCerts = () => {
  loading.value = true
  R.postJson('/api/cert/list', {
    page: {page_num: 1, page_size: 1000},
    status: 'Active'
  }).then(res => {
    if (res.code === 0 && res.data) {
      certList.value = res.data.list || []
    }
  }).finally(() => {
    loading.value = false
  })
}

loadCerts()

const onSelect = (id: number) => {
  fetching.value = true
  R.postJson('/api/cert/key', {id}).then(res => {
    if (res.code === 0 && res.data) {
      emit('select', {
        cert_pem: res.data.cert_pem ?? null,
        key_pem: res.data.key_pem ?? null
      })
    }
  }).finally(() => {
    fetching.value = false
  })
}

const onClear = () => {
  selectedId.value = null
  emit('update:modelValue', null)
  emit('clear')
}

watch(() => props.modelValue, (val) => {
  selectedId.value = val ?? null
})
</script>

<template>
  <el-select
      v-model="selectedId"
      placeholder="选择证书"
      clearable
      filterable
      :loading="loading"
      :disabled="fetching"
      style="width: 100%"
      @change="onSelect"
      @clear="onClear"
  >
    <el-option
        v-for="cert in certList"
        :key="cert.id"
        :label="`${cert.domain}（到期：${cert.expires_at}）`"
        :value="cert.id"
    >
      <div class="cert-option">
        <span class="cert-domain">{{ cert.domain }}</span>
        <span class="cert-expire">到期：{{ cert.expires_at }}</span>
      </div>
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">
.cert-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cert-domain {
  font-weight: 500;
}

.cert-expire {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
