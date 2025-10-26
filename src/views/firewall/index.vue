<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import IpPolicy from "./ip-policy.vue";
import RefererPolicy from "./referer-policy.vue";
import {R} from "../../utils/R";

const activeIndex = ref('100');

const firewall = ref({})

onMounted(() => {
  loadFirewall()
})
const loadFirewall = () => {
  R.get('/api/firewall/detail').then(res => {
    firewall.value = res.data
  })
}
watch(activeIndex, () => {
  loadFirewall()
})
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
          <el-menu-item-group title="访问策略">
            <el-menu-item index="100">
              IP访问策略
            </el-menu-item>
            <el-menu-item index="101">
              Referer策略
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="流量控制">
            <el-menu-item index="200">
              网关流量
            </el-menu-item>
            <el-menu-item index="201">
              异常流量
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <ip-policy v-model="firewall" v-if="activeIndex === '100'"></ip-policy>
        <referer-policy v-model="firewall" v-if="activeIndex === '101'"></referer-policy>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>