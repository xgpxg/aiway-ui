<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import IpPolicy from "./ip-policy.vue";
import RefererPolicy from "./referer-policy.vue";
import {R} from "../../utils/R";
import Traffic from "./traffic.vue";
import EncryptKey from "./encrypt-key.vue";

const route = useRoute();
const router = useRouter();

const activeIndex = ref('ip-policy');

const firewall = ref({})

onMounted(() => {
  loadFirewall()
})

const loadFirewall = () => {
  R.get('/api/firewall/detail').then(res => {
    firewall.value = res.data
    activeIndex.value = route.query.tab || 'ip-policy'
  })
}

watch(activeIndex, (newTab) => {
  // 更新路由参数，但不刷新页面
  router.push({query: {...route.query, tab: newTab}})
  loadFirewall()
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
          <el-menu-item-group title="访问策略">
            <el-menu-item index="ip-policy">
              IP访问策略
            </el-menu-item>
            <el-menu-item index="referer-policy">
              Referer策略
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="流量控制">
            <el-menu-item index="traffic">
              网关流量
            </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="密钥设置">
            <el-menu-item index="encrypt-key">
              加密密钥
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
      <el-col :span="21">
        <ip-policy v-model="firewall" v-if="activeIndex === 'ip-policy'"></ip-policy>
        <referer-policy v-model="firewall" v-if="activeIndex === 'referer-policy'"></referer-policy>
        <traffic v-model="firewall" v-if="activeIndex === 'traffic'"></traffic>
        <encrypt-key v-model="firewall" v-if="activeIndex === 'encrypt-key'"></encrypt-key>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>