<script setup>
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";

const services = ref([])
const page = ref({
  page_num: 1,
  page_size: 1000000,
  total: 0
})
const form = ref({
  filter_text: null
})
onMounted(() => {
  loadServices()
})
const loadServices = () => {
  R.postJson('/api/service/list', {
    page: page.value,
    filter_text: form.value.filter_text
  }).then(res => {
    services.value = res.data.list
    page.value.total = res.data.total
  })
}
</script>

<template>
  <el-select>
    <el-option v-for="service in services" :key="service.name" :value="service.name">
      {{ service.name }}
    </el-option>
  </el-select>
</template>

<style scoped lang="scss">

</style>