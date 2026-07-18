<template>
  <div class="navbar">
    <div class="navbar-top">
      <div class="navbar-left">
        <Hamburger class="hamburger-container"
                   @toggleClick="toggleSideBar" :is-active="collapse"></Hamburger>
        <div class="module-tabs">
          <div
              v-for="item in modules"
              :key="item.key"
              class="module-tab"
              :class="{ active: activeModule === item.key }"
              @click="switchModule(item.key)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <div class="right-menu flex-v">
        <el-popover width="500px" trigger="click" @show="" placement="bottom-end" v-if="U.isDev()">
          <template #reference>
            <el-icon class="cursor-pointer" style="margin-top: -2px;margin-right: 10px">
              <svg-icon icon-class="app"></svg-icon>
            </el-icon>
          </template>
        </el-popover>
        <el-popover width="520px" trigger="click" @show="this.$refs.messageRef?.loadMessages()" placement="bottom-end">
          <template #reference>
            <el-badge :value="unreadCount" class="ml20 cursor-pointer mr20" :show-zero="false">
              <el-icon>
                <Bell/>
              </el-icon>
            </el-badge>
          </template>
          <Message ref="messageRef"></Message>
        </el-popover>

        <el-button
            link
            class="nav-icon-button theme-toggle"
            @click="toggleTheme"
            :title="isDarkMode ? '切换到日间模式' : '切换到夜间模式'">
          <el-icon v-if="isDarkMode">
            <Sunny/>
          </el-icon>
          <el-icon v-else>
            <Moon/>
          </el-icon>
        </el-button>

        <el-link
            target="_blank"
            class="nav-icon-button"
            @click="toHome"
            :underline="false">
          <el-dropdown trigger="click" placement="bottom-end">
            <div class="avatar-wrapper">
              <el-icon class="user-avatar">
                <User></User>
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$refs['updatePassword'].show()">
                  修改密码
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">
                  登出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-link>
      </div>
    </div>
    <update-password ref="updatePassword"></update-password>
  </div>
</template>

<script>
import SvgIcon from "@components/SvgIcon/index.vue";
import Hamburger from "./Hamburger.vue";
import Breadcrumb from "./Breadcrumb.vue";
import UpdatePassword from "../../views/login/update-password.vue";
import AppBar from "./AppBar.vue";
import Message from "./Message.vue";
import {U} from "../../utils/util";
import {Sunny, Moon, Bell, User} from "@element-plus/icons-vue";

export default {
  components: {
    Sunny,
    Moon,
    Bell,
    User,
    Message,
    AppBar,
    UpdatePassword,
    Hamburger,
    SvgIcon,
    Breadcrumb
  },
  props: {
    activeModule: {
      type: String,
      default: 'dashboard'
    }
  },
  inject: ['isEnterprise'],
  data() {
    return {
      collapse: false,
      unreadCount: 0,
      isDarkMode: false,
      modules: [
        {key: 'dashboard', label: '仪表盘'},
        {key: 'gateway', label: '网关'},
        {key: 'security', label: '安全'},
        {key: 'ai', label: 'AI集成'},
        {key: 'system', label: '系统'},
      ],
    }
  },
  computed: {
    U() {
      return U
    },
    user() {
      return this.$store.state.user
    },
  },
  created() {
    this.loadUserInfo()
    this.loadUnreadCount()
    setInterval(() => this.loadUnreadCount(), 10 * 1000)
    this.initTheme()
  },
  methods: {
    loadUserInfo() {
      /* this.R.get('user/center', {}, {repeatable: true}).then(res => {
         this.$store.commit('user/setAvatar', res.data.base_info.avatar)
         this.$store.commit('user/setNickname', res.data.base_info.nickname)
         this.$store.commit('user/setEmail', res.data.base_info.email)
         this.$store.commit('user/setOther', res.data.other)
       })*/
    },
    logout() {
      this.R.postJson('/api/user/logout', {}, {repeatable: true}).then(res => {
        if (res.code === 0) {
          this.$router.replace({name: 'Login'})
        }
      })
    },
    toggleSideBar() {
      this.collapse = !this.collapse
      this.$emit('collapse', this.collapse)
    },
    switchModule(module) {
      this.$emit('module-change', module)
    },
    toMessage() {
      this.$router.push({name: 'Alert'})
    },
    toHome() {
      this.$router.push({name: 'Index'})
    },
    loadUnreadCount() {
      this.R.postJson('/api/message/count/unread').then(res => {
        this.unreadCount = res.data.info + res.data.warn + res.data.error
      })
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme_mode')
      if (savedTheme === 'dark') {
        this.isDarkMode = true
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('default')
      } else {
        this.isDarkMode = false
        document.documentElement.classList.add('default')
        document.documentElement.classList.remove('dark')
      }
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('default')
        localStorage.setItem('theme_mode', 'dark')
      } else {
        document.documentElement.classList.add('default')
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme_mode', 'default')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  overflow: hidden;
  position: relative;
  z-index: 100;

  .navbar-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px solid var(--el-border-color-lighter, #f0f0f0);
  }

  .navbar-left {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
  }

  .module-tabs {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 8px;

    .module-tab {
      padding: 0 18px;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #595959;
      cursor: pointer;
      position: relative;
      transition: all 0.3s;
      white-space: nowrap;
      font-weight: 500;

      &:hover {
        color: var(--el-color-primary);
      }

      &.active {
        color: var(--el-color-primary);
        font-weight: 600;
      }
    }
  }

  .left-menu {
    height: 100%;
    align-items: center;

    .logo-container {
      display: flex;
      align-items: center;
      margin-right: 48px;

      .logo {
        height: 36px;
        width: 36px;
        margin-right: 12px;
      }

      .logo-text {
        font-size: 20px;
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 0.5px;
        background: var(--el-color-primary);
        padding: 5px 10px;
        border-radius: 5px;
      }
    }

    .nav-menu {
      display: flex;
      height: 100%;

      .nav-link {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 22px;
        font-size: 15px;
        color: #595959;
        font-weight: 500;
        transition: all 0.3s;
        position: relative;

        &:hover {
          color: #262626;
        }

        &.active {
          color: #1890ff;
          font-weight: 500;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background-color: #1890ff;
          }
        }
      }
    }
  }

  .right-menu {
    height: 100%;
    align-items: center;
    margin-right: 20px;

    .nav-icon-button {
      margin: 0 6px 0 20px;
      background: transparent;
      border: none;
      color: #595959;
      width: 40px;
      height: 40px;

      &:hover {
        color: #1890ff;
        background: #f0f7ff;
      }

      &.theme-toggle {
        width: auto;
        padding: 0 8px;
      }

      .el-icon {
        font-size: 18px;
      }
    }

    .avatar-container {
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 36px;
          height: 36px;
        }

        .default-avatar {
          background: transparent;
          width: 36px;
          height: 36px;
        }
      }
    }
  }
}

.dropdown-menu {
  padding: 16px 20px;
  border-radius: 6px;

  .user-info {
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .user-name {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
      margin-bottom: 4px;
    }

    .user-role {
      font-size: 13px;
      color: #8c8c8c;
    }
  }

  .dropdown-actions {
    padding-top: 16px;
    display: flex;
    flex-direction: column;

    .dropdown-button {
      margin-bottom: 10px;
      border-radius: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border-color: #1890ff;
        color: #1890ff;
      }
    }

    .logout-btn:hover {
      border-color: #ff4d4f;
      color: #ff4d4f;
      background-color: #fff;
    }
  }
}

:deep(.el-badge__content) {
  height: 14px;
  line-height: 14px;
  padding: 0 4px;
  font-size: 10px;
  min-width: 12px;
}

</style>