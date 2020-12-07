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
          <a-menu-item key="official">
            官方模型库
          </a-menu-item>
          <a-menu-item key="all">
            所有模型库
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
import OfficialModel from "@components/FilePage/OfficialModel/OfficialModel";
import AllModel from "@components/FilePage/AllModel/AllModel";

export default {
  name: "FilePage",
  comments: {
    MyModel,
    OfficialModel,
    AllModel,
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
        case 'official':
          this.currentComponent = OfficialModel;
          break;
        case 'all':
          this.currentComponent = AllModel;
          break;
        default:
          break;
      }
    }
  }
}
</script>

