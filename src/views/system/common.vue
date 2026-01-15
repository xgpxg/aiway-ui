<script setup lang="ts">
import {ref} from "vue";

const lang = ref('zh')
</script>

<template>
  <el-form>
    <el-form-item label="语言">
      <el-select v-model="lang" style="width: 200px" disabled>
        <el-option label="中文" value="zh"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>