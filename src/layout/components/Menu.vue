<template>
  <div class="menu">
    <div class="logo">
      <div class="flex-center" v-if="!collapse">
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
        :default-active="'/'+$route.path.split('/')[1]"
        router
        :collapse="isCollapse"
        :collapse-transition="false"
    >
      <el-menu-item index="/dashboard">
        <el-icon>
          <svg-icon icon-class="dashboard"></svg-icon>
        </el-icon>
        <span v-if="!isCollapse">仪表盘</span>
      </el-menu-item>
      <el-menu-item-group title="网关">
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
      </el-menu-item-group>

      <el-menu-item-group title="安全">
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
      </el-menu-item-group>

      <el-menu-item-group title="模型">
        <el-menu-item index="/model">
          <el-icon>
            <svg-icon icon-class="model"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">模型管理</span>
        </el-menu-item>
      </el-menu-item-group>

      <el-menu-item-group title="系统">
        <el-menu-item index="/users">
          <el-icon>
            <svg-icon icon-class="user"></svg-icon>
          </el-icon>
          <span v-if="!isCollapse">用户管理</span>
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
          <span v-if="!isCollapse">系统设置</span>
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
  background: var(--el-color-primary-light-12);
  border-right: 1px solid #e6e8f0;
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
    margin: 4px 8px;
    border-radius: 8px;
    //  transition: all 0.3s ease;
  }

  :deep(.el-menu-item):hover {
    color: var(--el-color-primary) !important;
    background: var(--el-color-primary-light-9) !important;
  }

  :deep(.el-menu-item) {
    &.is-active {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-8) !important;
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(0, 94, 235, 0.15);

      /*&::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background: var(--el-color-primary);
        border-radius: 2px 0 0 2px;
      }*/
    }
  }

  .el-menu-item {
    height: 44px;

    &:hover {
      color: var(--el-color-primary) !important;
      background: var(--el-color-primary-light-9) !important;
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
  padding: 20px 20px 0 20px;
  font-size: 16px;
  height: 38px;
}
</style>