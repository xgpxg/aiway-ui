<script setup>
import {ref} from "vue";

const isShow = ref(false)

const show = () => {
  isShow.value = true
}

const form = ref({
  name: null,
  description: null,
})

defineExpose({
  show
})
</script>

<template>
  <el-drawer v-model="isShow" title="添加路由" size="500">
    <el-form label-position="top">
      <div class="title-block">基本信息</div>
      <el-form-item label="路由名称" prop="name">
        <el-input v-model="form.name" placeholder="路由名称" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="路由描述" prop="description">
        <el-input v-model="form.name" placeholder="路由描述" maxlength="500" show-word-limit></el-input>
      </el-form-item>
      <div class="title-block">目标服务</div>
      <el-form-item label="关联服务">
        <el-select></el-select>
      </el-form-item>
      <div class="title-block">匹配规则</div>
      <el-form-item label="域名匹配">
        <el-input placeholder="域名匹配" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="路径匹配">
        <el-input placeholder="路径匹配" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Header匹配">
        <el-input placeholder="Header匹配"></el-input>
      </el-form-item>
      <el-form-item label="URL参数匹配">
        <el-input placeholder="URL参数匹配"></el-input>
      </el-form-item>
      <div class="title-block">插件</div>
      <el-form-item label="前置过滤器">
        <el-select></el-select>
        <div class="fill-width bg-card mt10 br5">
          <div class="flex-center">
            <el-text type="info">暂未配置</el-text>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="后置过滤器">
        <el-select></el-select>
        <div class="fill-width bg-card mt10 br5">
          <div class="flex-center">
            <el-text type="info">暂未配置</el-text>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShow = false">取消</el-button>
      <el-button type="primary" @click="isShow = false">保存</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>