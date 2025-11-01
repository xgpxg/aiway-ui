<script setup lang="ts">
import {ref} from "vue";

const activeIndex = ref('100')
</script>

<template>
  <div class="pdr20 pdt20">
    <el-row :gutter="10">
      <el-col :span="3">
        <el-menu
            default-active="100"
            class="el-menu-vertical-demo"
            style="width: 130px"
            @select="(index) =>{activeIndex = index}"
        >
          <el-menu-item-group title="个性化">
            <el-menu-item index="101">
              通知和提醒
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="更新">
            <el-menu-item index="200">
              检查更新
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped lang="scss">

</style>