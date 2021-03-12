<style lang="scss">
.FilePage {
  .layout-wrapper {
    .logo {
      width: 140px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px 24px 16px 0;
      float: left;
    }

    .exit-button {
      width: 140px;
      height: 30px;
      color: #fff !important;
      float: right;
    }
  }
}
</style>

<template>
  <div class="FilePage">
    <a-layout class="layout-wrapper">
      <a-layout-header>
        <div class="logo">
          模型管理中心
        </div>
        <div class="exit-button">
          <a-dropdown-button>
            您好！
            <a-menu slot="overlay" @click="handleMenuClick">
              <a-menu-item key="logout">
                <a-icon type="logout"/>
                退出登录
              </a-menu-item>
            </a-menu>
            <a-icon slot="icon" type="user"/>
          </a-dropdown-button>
        </div>
        <a-menu
          theme="dark"
          mode="horizontal"
          v-model="menuKey"
          @select="handleMenuSelect"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="my">
            我的模型库
          </a-menu-item>
          <a-menu-item key="all">
            所有模型库
          </a-menu-item>
          <a-menu-item key="userCenter">
            个人中心
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 40px 50px; height: calc(100vh - 64px)">
        <div style="background-color: #fff;height: 100%; overflow: auto">
          <keep-alive>
            <component v-bind:is="currentComponent"></component>
          </keep-alive>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import MyModel from "@components/FilePage/MyModel/MyModel";
import AllModel from "@components/FilePage/AllModel/AllModel";
import UserCenter from "@components/FilePage/UserCenter/UserCenter";
import api from '@api/apiSugar';

export default {
  name: "FilePage",
  comments: {
    MyModel,
    AllModel,
    UserCenter
  },
  data() {
    return {
      menuKey: ['my'],
      currentComponent: MyModel,
    }
  },
  methods: {
    handleMenuSelect(e) {
      switch (e.key) {
        case 'my' :
          this.currentComponent = MyModel;
          break;
        case 'all':
          this.currentComponent = AllModel;
          break;
        case 'userCenter':
          this.currentComponent = UserCenter;
          break;
        default:
          break;
      }
    },
    handleMenuClick({key}) {
      switch (key) {
        case 'logout':
          api.tokensController.logout().then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              this.$router.push('/login');
            } else {
              this.$message.error(res.data.message);
            }
          })
          break;
        default:
          break;
      }
    }
  }
}
</script>

