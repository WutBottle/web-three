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
            <a-menu-item key="stl" @click="() => this.setNameVisible = true">
              .STL
            </a-menu-item>
          </a-sub-menu>
          <a-menu-divider/>
          <a-menu-item key="quit" @click="handleQuit">
            <a-icon type="left-square"/>
            退出编辑
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <button>编辑</button>
      <button>图像</button>
      <button>图层</button>
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <button>功能</button>
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="slice" @click="() => this.sliceFormVisible = true">
            切片
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
    <a-modal
      title="导出文件名称"
      :visible="setNameVisible"
      okText="导出"
      cancelText="取消"
      @ok="handleSaveSTL"
    >
      <a-input v-model="saveName" placeholder="请输入文件名" />
    </a-modal>
  </div>
</template>

<script>
import {saveAsSTL} from '@js/fileSave';
import {
  findObjectByName,
  removeAll
} from '@js/drawFunction';

export default {
  name: "TopBar",
  data() {
    return {
      setNameVisible: false, // 导出文件名字弹窗控制
      sliceFormVisible: false, // 切片信息输入弹窗控制
      saveName: '',
    }
  },
  // 页面后退后清除数据
  destroyed() {
    removeAll();
  },
  methods: {
    // 处理导出stl文件
    handleSaveSTL() {
      if(this.saveName) {
        saveAsSTL(findObjectByName(window.sessionStorage.getItem('currentModelUrl')), this.saveName);
        this.setNameVisible = false;
        this.saveName = '';
        this.$message.success('导出成功');
      }else {
        this.$message.info('请输入文件名');
      }
    },
    // 处理退出编辑页面
    handleQuit() {
      removeAll();
      window.sessionStorage.clear();
      this.$router.push('file');
    }
  }
}
</script>