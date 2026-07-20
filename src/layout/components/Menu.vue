<template>
  <div class="menu">
    <div class="logo">
      <div class="" v-if="!collapse">
        <el-image src="/images/logo.png" style="height: 24px;"></el-image>
      </div>
      <div v-else>
        <el-image
            src="/images/logo2.png"
            fit="cover" class=""
            style="height: 22px;"></el-image>
      </div>
    </div>
    <el-menu
        :default-active="'/' + $route.path.split('/')[1]"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
    >
      <!-- 仪表盘 -->
      <template v-if="activeModule === 'dashboard'">
        <el-menu-item index="/dashboard">
          <el-icon>
            <svg-icon icon-class="dashboard"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/notify">
          <el-icon>
            <svg-icon icon-class="notice"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">通知提醒</span>
        </el-menu-item>
      </template>

      <!-- 网关 -->
      <template v-if="activeModule === 'gateway'">
        <el-menu-item index="/service">
          <el-icon>
            <svg-icon icon-class="service"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">服务管理</span>
        </el-menu-item>
        <el-menu-item index="/route">
          <el-icon>
            <svg-icon icon-class="route"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">路由配置</span>
        </el-menu-item>
        <el-menu-item index="/domain">
          <el-icon>
            <svg-icon icon-class="domain"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">域名管理</span>
        </el-menu-item>
        <el-menu-item index="/plugin">
          <el-icon>
            <svg-icon icon-class="plugin"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">插件管理</span>
        </el-menu-item>
        <el-menu-item index="/log">
          <el-icon>
            <svg-icon icon-class="log"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">日志</span>
        </el-menu-item>
      </template>

      <!-- 安全 -->
      <template v-if="activeModule === 'security'">
        <el-menu-item index="/apikey">
          <el-icon>
            <svg-icon icon-class="key"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">密钥管理</span>
        </el-menu-item>
        <el-menu-item index="/firewall">
          <el-icon>
            <svg-icon icon-class="security"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">防火墙</span>
        </el-menu-item>
      </template>

      <!-- AI集成 -->
      <template v-if="activeModule === 'ai'">
        <el-menu-item index="/model">
          <el-icon>
            <svg-icon icon-class="model"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">模型管理</span>
        </el-menu-item>
        <el-menu-item index="/mcp">
          <el-icon>
            <svg-icon icon-class="mcp"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">MCP服务</span>
        </el-menu-item>
        <el-menu-item index="/usage">
          <el-icon>
            <svg-icon icon-class="dashboard"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">用量统计</span>
        </el-menu-item>
        <el-menu-item index="/model-call-logs">
          <el-icon>
            <svg-icon icon-class="log2"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">模型日志</span>
        </el-menu-item>
      </template>

      <!-- 系统 -->
      <template v-if="activeModule === 'system'">
        <el-menu-item index="/users">
          <el-icon>
            <svg-icon icon-class="user"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <el-icon>
            <svg-icon icon-class="setting"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">系统设置</span>
        </el-menu-item>
      </template>
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
    activeModule: {
      type: String,
      default: 'dashboard'
    },
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
  //background: var(--el-color-primary-light-12);
  // border-right: 1px solid #e6e8f0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
  overflow-y: auto;
  //transition: all 0.3s ease;

  :deep(.el-menu) {
    border-right: unset;
    background: transparent;
    --el-menu-bg-color: transparent;
  }

  :deep(.el-menu-item) {
    background-color: transparent !important;
    border: unset;
    margin: 4px 0;
    border-radius: 8px;
    height: 44px;

    &:hover {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-9) !important;
    }
  }

  :deep(.el-menu-item):hover {
    color: var(--el-color-primary) !important;
    background: var(--el-color-primary-light-10) !important;
  }

  :deep(.el-menu-item) {
    &.is-active {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-10) !important;
      font-weight: 600;
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
  padding: 20px 20px 0 20px;
  font-size: 16px;
  height: 38px;
}
</style>