<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {R} from "../../utils/R";
import {ElMessage} from "element-plus";

const form = ref({
  email: '',
  dns_provider: 'cloudflare',
  dns_credentials: {
    type: 'cloudflare',
    api_token: ''
  },
  staging: false
})

const dnsProviders = [
  {label: 'Cloudflare', value: 'Cloudflare'},
  {label: 'Tencent', value: 'Tencent'},
  {label: 'Ali', value: 'Ali'},
  {label: 'Huawei', value: 'Huawei'},
  {label: 'Volcengine', value: 'Volcengine'},
  {label: 'Baidu', value: 'Baidu'}
]

onMounted(() => {
  loadConfig()
})

const loadConfig = () => {
  R.get('/api/system/acme/config').then(res => {
    if (res.code === 0 && res.data) {
      form.value = res.data
    }
  })
}

watch(() => form.value.dns_provider, (newProvider) => {
  form.value.dns_credentials.type = newProvider
})

const save = () => {
  R.postJson('/api/system/acme/config/update', form.value).then(res => {
    if (res.code === 0) {
      ElMessage.success('已更新')
    }
  })
}

</script>

<template>
  <div>
    <div class="title-block">
      ACME 配置
    </div>
    <div>
      <el-text type="info" size="small">
        配置 ACME 协议用于自动申请和续签 SSL 证书，支持 Cloudflare、腾讯云、阿里云、华为云、火山引擎、百度云 DNS 解析。
      </el-text>
    </div>
  </div>
  <el-form class="mt20" label-width="100">
    <el-form-item label="账户邮箱">
      <el-input v-model="form.email" placeholder="请输入 ACME 账户邮箱" style="max-width: 400px"></el-input>
    </el-form-item>
    <el-form-item label="DNS 提供商">
      <el-select v-model="form.dns_provider" style="width: 200px">
        <el-option v-for="p in dnsProviders" :key="p.value" :label="p.label" :value="p.value"></el-option>
      </el-select>
    </el-form-item>

    <!-- Cloudflare -->
    <template v-if="form.dns_provider === 'Cloudflare'">
      <el-form-item label="API Token">
        <el-input v-model="form.dns_credentials.api_token" placeholder="Cloudflare API Token"
                  type="password" show-password style="max-width: 400px"></el-input>
      </el-form-item>
    </template>

    <!-- Tencent -->
    <template v-if="form.dns_provider === 'Tencent'">
      <el-form-item label="Secret ID">
        <el-input v-model="form.dns_credentials.secret_id" placeholder="Tencent Secret ID"
                  style="max-width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="Secret Key">
        <el-input v-model="form.dns_credentials.secret_key" placeholder="Tencent Secret Key"
                  type="password" show-password style="max-width: 400px"></el-input>
      </el-form-item>
    </template>

    <!-- 阿里云 -->
    <template v-if="form.dns_provider === 'Ali'">
      <el-form-item label="Access Key">
        <el-input v-model="form.dns_credentials.access_key" placeholder="阿里云 Access Key ID"
                  style="max-width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="Secret Key">
        <el-input v-model="form.dns_credentials.secret_key" placeholder="阿里云 Access Key Secret"
                  type="password" show-password style="max-width: 400px"></el-input>
      </el-form-item>
    </template>

    <!-- Huawei -->
    <template v-if="form.dns_provider === 'Huawei'">
      <el-form-item label="Access Key">
        <el-input v-model="form.dns_credentials.access_key" placeholder="Huawei Access Key"
                  style="max-width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="Secret Key">
        <el-input v-model="form.dns_credentials.secret_key" placeholder="Huawei Secret Key"
                  type="password" show-password style="max-width: 400px"></el-input>
      </el-form-item>
    </template>

    <!-- Volcengine -->
    <template v-if="form.dns_provider === 'Volcengine'">
      <el-form-item label="Access Key">
        <el-input v-model="form.dns_credentials.access_key" placeholder="Volcengine Access Key"
                  style="max-width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="Secret Key">
        <el-input v-model="form.dns_credentials.secret_key" placeholder="Volcengine Secret Key"
                  type="password" show-password style="max-width: 400px"></el-input>
      </el-form-item>
    </template>

    <!-- Baidu -->
    <template v-if="form.dns_provider === 'Baidu'">
      <el-form-item label="Access Key">
        <el-input v-model="form.dns_credentials.access_key" placeholder="Baidu Access Key"
                  style="max-width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="Secret Key">
        <el-input v-model="form.dns_credentials.secret_key" placeholder="Baidu Secret Key"
                  type="password" show-password style="max-width: 400px"></el-input>
      </el-form-item>
    </template>

    <el-form-item label="测试环境">
      <el-switch v-model="form.staging"></el-switch>
      <el-text type="info" size="small" class="ml10">启用后将使用 ACME Staging 环境，用于测试验证</el-text>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">

</style>
