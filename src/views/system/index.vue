<script setup lang="ts">
import {ref} from "vue";
import Notify from "./notify.vue";
import Common from "./common.vue";
import Storage from "./storage.vue";

const activeIndex = ref('100')
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-menu
            default-active="100"
            class="el-menu-vertical-demo"
            style="width: 130px"
            @select="(index:string) =>{activeIndex = index}"
        >
          <el-menu-item-group title="个性化">
<!--            <el-menu-item index="100">
              通用设置
            </el-menu-item>-->
            <el-menu-item index="101">
              通知和提醒
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item index="102">
            数据存储
          </el-menu-item>
          <el-menu-item-group title="系统">
            <el-menu-item index="200">
              备份和迁移
            </el-menu-item>
            <el-menu-item index="209">
              系统信息
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <common v-if="activeIndex==='100'"></common>
        <notify v-if="activeIndex==='101'"></notify>
        <storage v-if="activeIndex==='102'"></storage>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped lang="scss">

</style>