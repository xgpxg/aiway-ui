<script setup lang="ts">
import {onMounted, ref} from "vue";
import {R} from "../../utils/R";

const plugins = ref([])
const page = ref({
  page_num: 1,
  page_size: 10,
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
    page.value.total = res.data.total
  })
}

const emits = defineEmits(['select'])
const handleSelect = (item: any) => {
  emits('select', item)
}
</script>


<template>
  <el-dropdown placement="bottom-end" :show-arrow="false" trigger="click">
    <el-button @click="" link icon="plus"></el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in plugins" @click="handleSelect(item)">
          {{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">

</style>