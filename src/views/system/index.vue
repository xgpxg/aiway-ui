<script setup lang="ts">
import {ref, onMounted, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import Notify from "./notify.vue";
import Common from "./common.vue";
import Storage from "./storage.vue";
import Info from "./info.vue";

const router = useRouter();
const route = useRoute();
const activeIndex = ref('common-setting')

onMounted(() => {
  activeIndex.value = route.query.tab || 'common-setting'
})

watch(activeIndex, (newTab) => {
  // 更新路由参数，但不刷新页面
  router.push({query: {...route.query, tab: newTab}})
})
</script>

<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="3">
        <el-menu
            :default-active="activeIndex"
            class="el-menu-vertical-demo"
            style="width: 130px"
            @select="(index) =>{activeIndex = index}"
        >
          <el-menu-item-group title="个性化">
            <el-menu-item index="common-setting">
              通用设置
            </el-menu-item>
            <el-menu-item index="notification">
              通知和提醒
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item index="data-storage">
            数据存储
          </el-menu-item>
          <el-menu-item-group title="系统">
            <el-menu-item index="backup-migration">
              备份和迁移
            </el-menu-item>
            <el-menu-item index="system-info">
              系统信息
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <common v-if="activeIndex==='common-setting'"></common>
        <notify v-if="activeIndex==='notification'"></notify>
        <storage v-if="activeIndex==='data-storage'"></storage>
        <info v-if="activeIndex==='system-info'"></info>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped lang="scss">

</style>