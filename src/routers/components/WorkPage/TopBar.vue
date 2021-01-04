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
            <a-menu-item key="stl" @click="handleExportSTL">
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
      <button @click="showComponentsDrawer">图层</button>
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <button>功能</button>
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="slice" @click="() => this.sliceFormVisible = true">
            切片
          </a-menu-item>
          <a-menu-item key="animation" @click="playAnimation">
            动画
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
      <a-input v-model="saveName" placeholder="请输入文件名"/>
    </a-modal>
    <a-modal v-model="sliceFormVisible" title="切片" @ok="handleSliceOk" cancelText="取消" okText="确认"
             :maskClosable="false">
      <a-tabs v-model="sliceTabsKey">
        <a-tab-pane key="flat">
          <span slot="tab">
            <i class="iconfont icon-flat-slice"></i>
            平面切片
          </span>
          <a-form :form="flatForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="起始切片高度">
              <a-input
                placeholder="输入起始切片高度"
                v-decorator="['startHeight', { rules: [{ required: true, message: '输入起始切片高度!' }] }]"
              />
            </a-form-item>
            <a-form-item label="终止切片高度">
              <a-input
                placeholder="输入终止切片高度"
                v-decorator="['endHeight', { rules: [{ required: true, message: '输入终止切片高度!' }] }]"
              />
            </a-form-item>
            <a-form-item label="层厚">
              <a-input
                placeholder="输入层厚"
                v-decorator="['sliceThick', { rules: [{ required: true, message: '输入层厚!' }] }]"
              />
            </a-form-item>
            <a-form-item label="绘制颜色">
              <colorPicker
                v-model="color"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="cone">
          <span slot="tab">
            <i class="iconfont icon-cone"></i>
            锥面切片
          </span>
          <a-form :form="coneForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="起始切片半径">
              <a-input
                placeholder="输入起始切片半径"
                v-decorator="['startRadius', { rules: [{ required: true, message: '输入起始切片半径!' }] }]"
              />
            </a-form-item>
            <a-form-item label="起始切片高度">
              <a-input
                placeholder="输入起始切片高度"
                v-decorator="['startHeight', { rules: [{ required: true, message: '输入起始切片高度!' }] }]"
              />
            </a-form-item>
            <a-form-item label="终止切片高度">
              <a-input
                placeholder="输入终止切片高度"
                v-decorator="['endHeight', { rules: [{ required: true, message: '输入终止切片高度!' }] }]"
              />
            </a-form-item>
            <a-form-item label="层厚">
              <a-input
                placeholder="输入层厚"
                v-decorator="['sliceThick', { rules: [{ required: true, message: '输入层厚!' }] }]"
              />
            </a-form-item>
            <a-form-item label="绘制颜色">
              <colorPicker
                v-model="color"
              />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
    <a-drawer
      title="图层"
      placement="right"
      :visible="componentsVisible"
      :mask="false"
      @close="() => this.componentsVisible = false"
    >
      <SceneTree :data="treeData"/>
    </a-drawer>
  </div>
</template>

<script>
import {saveAsSTL} from '@js/fileSave';
import SceneTree from './components/SceneTree'
import {
  findObjectByName,
  makeCone,
  makeHorizontalSlice,
  removeObject,
  removeAll,
  render,
  getScene
  // animationDrawLine
} from '@js/drawFunction';

export default {
  name: "TopBar",
  components: {
    SceneTree
  },
  data() {
    return {
      setNameVisible: false, // 导出文件名字弹窗控制
      saveName: '',
      sliceFormVisible: false, // 切片信息输入弹窗控制
      sliceTabsKey: 'flat', // 切片信息面板
      coneForm: this.$form.createForm(this, {name: 'coneForm'}), // 锥面切片表单
      flatForm: this.$form.createForm(this, {name: 'flatForm'}), // 平面切片表单
      cylinderGeometryParameter: { //
        radiusTop: 20, // 顶部半径
        radiusBottom: 20, // 底部半径
        height: 100, // 高度
        radiusSegments: 8, // 圆截面分段数
        heightSegments: 1, // 竖直方向分段数
        openEnded: false, // 圆柱体顶部或底部是否打开
      },
      horizontalSliceParameter: {
        startHeight: 0, // 起始高度
        endHeight: 100, // 终止高度
        thick: 20, // 厚度
      }, // 水平切片
      color: '#ff0000', // 选择颜色
      componentsVisible: false, // 图层抽屉显示
      treeData: [], // 图层数据
    }
  },
  // 页面后退后清除数据
  destroyed() {
    removeAll();
  },
  methods: {
    // 处理导出stl文件
    handleSaveSTL() {
      if (this.saveName) {
        saveAsSTL(findObjectByName(window.sessionStorage.getItem('currentModelUrl')), this.saveName);
        this.setNameVisible = false;
        this.saveName = '';
        this.$message.success('导出成功');
      } else {
        this.$message.info('请输入文件名');
      }
    },
    // 处理退出编辑页面
    handleQuit() {
      removeAll();
      window.sessionStorage.clear();
      this.$router.push('file');
    },
    // 生成切片信息
    handleSliceOk() {
      // 水平切片
      this.sliceTabsKey === 'flat' && this.flatForm.validateFields((err, values) => {
        if (!err) {
          Object.assign(this.horizontalSliceParameter, {
            startHeight: Number(values.startHeight),
            endHeight: Number(values.endHeight),
            thick: Number(values.sliceThick),
            color: this.color,
          })
          removeObject('horizontalSlice'); // 移除切片
          makeHorizontalSlice('horizontalSlice', this.horizontalSliceParameter);
          render();
          this.sliceFormVisible = false;
          this.treeData = getScene().children;
        }
      })
      // 椎体切片
      this.sliceTabsKey === 'cone' && this.coneForm.validateFields((err, values) => {
        if (!err) {
          Object.assign(this.cylinderGeometryParameter, {
            startHeight: Number(values.startHeight),
            radiusTop: 0,
            radiusBottom: Number(values.startRadius),
            height: Number(values.endHeight - values.startHeight),
            thick: Number(values.sliceThick),
            color: this.color,
            radiusSegments: 20,
            heightSegments: 20,
            openEnded: true,
          });
          removeObject('cone')
          makeCone('cone', this.cylinderGeometryParameter);
          render();
          this.sliceFormVisible = false;
          // this.coneForm.resetFields();
        }
      });
    },
    // 播放动画
    playAnimation() {
      this.$message.info('该功能正在开发中...')
      // animationDrawLine();
    },
    // 点击导出stl文件相关处理
    handleExportSTL() {

    },
    // 显示图层树形菜单
    showComponentsDrawer() {
      this.componentsVisible = !this.componentsVisible;
      this.componentsVisible && (this.treeData = getScene().children); // 如果为真更新数据
    }
  }
}
</script>