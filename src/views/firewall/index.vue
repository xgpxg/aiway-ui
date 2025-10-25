<script setup lang="ts">
import {ref} from "vue";
import IpPolicy from "./ip-policy.vue";
import RefererPolicy from "./referer-policy.vue";

const activeIndex = ref('1');
</script>

<template>
  <div class="pdr20 pdt20">
    <el-row :gutter="10">
      <el-col :span="3">
        <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            style="width: 130px"
            @select="(index) =>{activeIndex = index}"
        >
          <el-menu-item index="1">
            IP访问策略
          </el-menu-item>
          <el-menu-item index="2">
            Referer策略
          </el-menu-item>
          <el-menu-item index="3">
            插件策略
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <ip-policy v-if="activeIndex === '1'"></ip-policy>
        <referer-policy v-if="activeIndex === '2'"></referer-policy>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>