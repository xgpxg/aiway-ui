<template>
  <div class="menu">
    <div class="logo">
      <div class="flex-center" v-if="!collapse">
        <el-image src="/public/images/logo.png" style="height: 22px" class="mr10"></el-image> {{ version }}
      </div>
      <div v-else>
        <el-image
            src="/images/logo_collapse.png"
            fit="cover" style="scale: 1.3" class="mt5"></el-image>
      </div>
    </div>
    <el-menu
        :default-active="'/'+$route.path.split('/')[1]"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
    >
      <el-menu-item index="/dashboard">
        <el-icon>
          <svg-icon icon-class="dashboard"></svg-icon>
        </el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item-group title="网关">
        <el-menu-item index="/service">
          <el-icon>
            <svg-icon icon-class="service"></svg-icon>
          </el-icon>
          <span>服务管理</span>
        </el-menu-item>
        <el-menu-item index="/route">
          <el-icon>
            <svg-icon icon-class="route"></svg-icon>
          </el-icon>
          <span>路由配置</span>
        </el-menu-item>
        <el-menu-item index="/plugin">
          <el-icon>
            <svg-icon icon-class="plugin"></svg-icon>
          </el-icon>
          <span>插件管理</span>
        </el-menu-item>
        <el-menu-item index="/log">
          <el-icon>
            <svg-icon icon-class="log"></svg-icon>
          </el-icon>
          <span>日志</span>
        </el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group title="安全">
        <el-menu-item index="/apikey">
          <el-icon>
            <svg-icon icon-class="key"></svg-icon>
          </el-icon>
          <span>密钥管理</span>
        </el-menu-item>
        <el-menu-item index="/firewall">
          <el-icon>
            <svg-icon icon-class="security"></svg-icon>
          </el-icon>
          <span>防火墙</span>
        </el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group title="系统">
        <el-menu-item index="/users">
          <el-icon>
            <svg-icon icon-class="user"></svg-icon>
          </el-icon>
          <span>用户管理</span>
        </el-menu-item>
<!--        <el-menu-item index="/operation">
          <el-icon>
            <svg-icon icon-class="log2"></svg-icon>
          </el-icon>
          <span>操作日志</span>
        </el-menu-item>-->
        <el-menu-item index="/setting">
          <el-icon>
            <svg-icon icon-class="setting"></svg-icon>
          </el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>

<script>
import SvgIcon from "../../components/SvgIcon/index.vue";

const VERSION = import.meta.env.VITE_VERSION

export default {
  components: {SvgIcon},
  props: {
    collapse: Boolean,
  },
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    version() {
      return VERSION
    }
  },
  watch: {
    collapse: {
      handler(newVal) {
        this.isCollapse = newVal
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.menu {
  height: calc(100vh);
  //background: #fafafa;
  border-right: #eeeeee 1px solid;

  :deep(.el-menu) {
    border-right: unset;
    //background: #fafafa;

  }

  :deep(.el-menu-item) {
    background-color: unset !important;
    border: unset;
  }

  :deep(.el-menu-item):hover {
    color: unset !important;
  }

  :deep(.el-menu-item) {
    &.is-active {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-12) !important;
    }
  }

  .el-menu-item {
    height: 50px;

    &:hover {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-12) !important;
    }

    .el-icon {
      > :hover {
        font-size: 1.5em;
        transition: all 0.3s;
      }
    }
  }

  :deep(.el-badge__content) {
    border: none;
    scale: 0.8;
  }
}

.collapse {
  position: fixed;
  bottom: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-weight: bold;
  padding: 20px 20px 0 20px;
  font-size: 18px;
  height: 38px;
  color: #409eff;
}

</style>