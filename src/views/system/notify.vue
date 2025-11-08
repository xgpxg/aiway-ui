<script setup lang="ts">

import SvgIcon from "../../components/SvgIcon/index.vue";
import {ref} from "vue";
import {R} from "../../utils/R";
import {ElMessage} from "element-plus";

const form = ref({
  dingding: {
    enable: false,
    webhook: ''
  },
  feishu: {
    enable: false,
    webhook: ''
  },
  wecom: {
    enable: false,
    webhook: ''
  },
  custom: {
    enable: false,
    webhook: ''
  },
})
const save = () => {
  R.post('/api/system/notify/config/update', form.value).then(res => {
    ElMessage.success(res.msg)
  })
}
</script>

<template>
  <div class="">
    <div class="title-block">
      推送渠道
    </div>
  </div>
  <el-tabs type="border-card">
    <el-tab-pane label="钉钉机器人">
      <template #label>
        <svg-icon icon-class="dingding" size="16" class="mr5"></svg-icon>
        钉钉机器人
        <el-checkbox v-model="form.dingding.enable" class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过机器人在钉钉群内接收通知消息</el-text>
      <el-form class="mt10" label-width="70">
        <el-form-item label="Webhook">
          <el-input v-model="form.dingding.webhook" placeholder="钉钉机器人地址，注意不要泄露到公网"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="飞书机器人">
      <template #label>
        <svg-icon icon-class="feishu" size="18" class="mr5"></svg-icon>
        飞书机器人
        <el-checkbox v-model="form.feishu.enable" class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过飞书机器人发送通知</el-text>
      <el-form class="mt10" label-width="70">
        <el-form-item label="Webhook">
          <el-input v-model="form.feishu.webhook" placeholder="飞书机器人地址，注意不要泄露到公网"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="企业微信机器人">
      <template #label>
        <svg-icon icon-class="qiwei" size="18" class="mr5"></svg-icon>
        企业微信机器人
        <el-checkbox v-model="form.wecom.enable" class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过企业微信机器人发送通知</el-text>
      <el-form class="mt10" label-width="70">
        <el-form-item label="Webhook">
          <el-input v-model="form.wecom.webhook" placeholder="企业微信器人地址，注意不要泄露到公网"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="邮件通知">
      <template #label>
        <svg-icon icon-class="email" size="18" class="mr5"></svg-icon>
        邮件通知
        <el-checkbox class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过指定邮箱发送通知，支持多个收件人</el-text>
      <el-form class="mt10" label-width="100">
        <el-form-item label="SMTP服务器">
          <el-input placeholder="请输入SMTP服务器地址"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input-number :min="1" :max="65535"></el-input-number>
        </el-form-item>
        <!--        <el-form-item label="加密方式">
                  <el-select>
                    <el-option label="SSL" value="ssl"></el-option>
                    <el-option label="TLS" value="tls"></el-option>
                    <el-option label="无加密" value="none"></el-option>
                  </el-select>
                </el-form-item>-->
        <el-form-item label="账号">
          <el-input placeholder="请输入邮箱账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" placeholder="请输入邮箱密码或授权码"></el-input>
        </el-form-item>
        <el-form-item label="发件人邮箱">
          <el-input placeholder="请输入发件人邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="收件人邮箱">
          <el-input-tag placeholder="请输入收件人邮箱地址，多个用逗号分隔"></el-input-tag>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="自定义">
      <template #label>
        自定义
        <el-checkbox v-model="form.custom.enable" class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后，可自定义通知内容，支持变量替换</el-text>
      <el-form class="mt10" label-width="70">
        <el-form-item label="Webhook">
          <el-input v-model="form.custom.webhook" placeholder="自定义Webhook地址"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<style scoped lang="scss">
:deep(.el-tabs__header) {
  background-color: var(--el-color-primary-light-11);
}
</style>