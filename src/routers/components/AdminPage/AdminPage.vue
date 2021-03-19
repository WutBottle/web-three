<style lang="scss">
.AdminPage {
  #layout-wrapper .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #layout-wrapper .trigger:hover {
    color: #1890ff;
  }

  #layout-wrapper .logo {
    text-align: center;
    color: #fff;
    height: 32px;
    line-height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
}
</style>

<template>
  <div class="AdminPage">
    <a-layout id="layout-wrapper">
      <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
        <div class="logo"/>
        <a-menu theme="dark" mode="inline" v-model="menuKey" @select="handleMenuClick">
          <a-menu-item key="user">
            <a-icon type="user"/>
            <span>用户管理</span>
          </a-menu-item>
          <a-menu-item key="modal">
            <a-icon type="code-sandbox"/>
            <span>模型管理</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (this.collapsed = !collapsed)"
          />
        </a-layout-header>
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px', height: 'calc(100vh - 64px)'}"
        >
          <component v-bind:is="currentComponent"></component>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import UserManager from './UserManager/UserManager';
import ModalManager from './ModalManager/ModalManager';

export default {
  name: "AdminPage",
  components: {
    UserManager,
    ModalManager,
  },
  data() {
    return {
      collapsed: false,
      currentComponent: UserManager,
      menuKey: ['user'],
    }
  },
  methods: {
    handleMenuClick(e) {
      switch (e.key) {
        case 'user' :
          this.currentComponent = UserManager;
          break;
        case 'modal':
          this.currentComponent = ModalManager;
          break;
        default:
          break;
      }
    }
  }
}
</script>

