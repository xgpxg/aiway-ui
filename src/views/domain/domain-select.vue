<script setup>
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";

const props = defineProps({
  status: {
    type: String,
    required: false,
  }
})
const domains = ref([])
const page = ref({
  page_num: 1,
  page_size: 1000000,
  total: 0
})
const form = ref({
  filter_text: null
})
onMounted(() => {
  loadDomains()
})
const loadDomains = () => {
  R.postJson('/api/domain/list', {
    page: page.value,
    filter_text: form.value.filter_text,
    status: props.status
  }).then(res => {
    domains.value = res.data.list
    page.value.total = res.data.total
  })
}
</script>

<template>
  <el-select>
    <el-option v-for="domain in domains" :key="domain.domain" :value="domain.domain">
      {{ domain.domain }}
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">

</style>
