<style lang="scss">
.TopBar {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  background-color: #474747;
  color: #d5d5d5;
  border: 1px solid #3e3e3e;

  .button-wrapper {
    button {
      padding: 2px 5px 3px 5px;
      margin: 4px;
      text-align: center;
      white-space: nowrap;
      background-color: #474747;
      border-radius: 3px;
      color: #d5d5d5;
      border: 0 solid #474747;
      font-size: 13px;

      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>

<template>
  <div class="TopBar">
    <span class="button-wrapper">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <button>文件</button>
        </a>
        <a-menu slot="overlay">
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="cloud-upload"/>
              <span>在线发布</span>
            </span>
            <a-menu-item key="publishMyDepository">
              我的仓库
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="save"/>
              <span>另存为</span>
            </span>
            <a-menu-item key="saveAsSTL">
              .STL
            </a-menu-item>
          </a-sub-menu>
          <a-menu-divider/>
          <a-menu-item key="quit" @click="() => this.$router.push('file')">
            <a-icon type="left-square"/>
            退出编辑
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <button>编辑</button>
      <button>图像</button>
      <button>图层</button>
      <button>功能</button>
    </span>
  </div>
</template>

<script>
export default {
  name: "TopBar"
}
</script>