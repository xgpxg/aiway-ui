<script setup lang="ts">

import DevRemark from "../../components/DevUtil/dev-remark.vue";
</script>

<template>
  <dev-remark>
    整体监控指标：CPU、内存、磁盘、流量、网络、累计请求数、当前连接数、平均QPS、平均响应时间、平均错误率。

    <p>
      累计请求数：所有网关节点收到的有效请求数之和
    </p>
    <p>
      当前连接数：所有网关节点的当前连接数之和
    </p>
    <p>
      平均QPS：所有网关节点QPS求和后取均值
    </p>
    <p>
      平均响应时间：所有网关节点的响应时间的均值（区分网关本身和服务响应）
    </p>
    <p>
      平均错误率：所有网关节点的错误率均值
    </p>

  </dev-remark>
  <dev-remark>
    网关节点监控指标：CPU、内存、磁盘、流量、网络、累计请求数、当前连接数、当前QPS、平均响应时间、平均错误率
  </dev-remark>
</template>

<style scoped lang="scss">

</style>