<script setup>
import {inject} from "vue";
import ApiServerToolList from "./api-server-tool-list.vue";
import ProxyServerToolList from "./proxy-server-tool-list.vue";

const mcpServer = inject('mcpServer')
</script>

<template>
  <template v-if="mcpServer?.server_type==='Http'">
    <api-server-tool-list></api-server-tool-list>
  </template>

  <template v-if="mcpServer?.server_type==='Proxy'">
    <proxy-server-tool-list></proxy-server-tool-list>
  </template>
</template>

<style scoped lang="scss">

</style>