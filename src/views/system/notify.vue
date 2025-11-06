<script setup lang="ts">

</script>

<template>
  <div>
    <div class="title-block">
      提醒事项
    </div>
    <div>
      <el-checkbox>系统异常提醒</el-checkbox>
      <el-checkbox>资源预警</el-checkbox>
      <el-checkbox>网络安全事件</el-checkbox>
    </div>
  </div>

  <div class="mt20">
    <div class="title-block">
      推送渠道
    </div>
  </div>
  <el-tabs type="border-card">
    <el-tab-pane label="钉钉机器人">
      <template #label>
        钉钉机器人
        <el-checkbox class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过钉钉机器人发送通知</el-text>
      <el-form class="mt10">
        <el-form-item label="Webhook">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="飞书机器人">
      <template #label>
        飞书机器人
        <el-checkbox class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过飞书机器人发送通知</el-text>
      <el-form class="mt10">
        <el-form-item label="Webhook">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="企业微信机器人">
      <template #label>
        企业微信机器人
        <el-checkbox class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">开启后可通过企业微信机器人发送通知</el-text>
      <el-form class="mt10">
        <el-form-item label="Webhook">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="邮件通知">
      <template #label>
        邮件通知
        <el-checkbox class="ml5"></el-checkbox>
      </template>
      <el-text type="info" size="small">邮件通知</el-text>
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
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="自定义">
      <template #label>
        自定义
        <el-checkbox class="ml5"></el-checkbox>
      </template>
    </el-tab-pane>
  </el-tabs>

</template>

<style scoped lang="scss">

</style>