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

.g-code-button {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
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
              <span>加载模型</span>
            </span>
            <a-menu-item key="sub-PCD" @click="selectPCDFile">
              PCD
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
<!--      <button>编辑</button>-->
<!--      <button>图像</button>-->
      <button @click="showComponentsDrawer">图层</button>
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
          <button>功能</button>
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="slice" @click="() => this.sliceFormVisible = true">
            分层切片
          </a-menu-item>
          <a-menu-item key="path" @click="() => this.pathVisible = true">
            轨迹生成
          </a-menu-item>
          <a-menu-item key="gCode" @click="() => this.GCodeVisible = true">
            G代码
          </a-menu-item>
          <a-menu-item key="animation" @click="playAnimation">
            动画
          </a-menu-item>
          <a-menu-item key="record" @click="showRecordDrawer">
            日志
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
    <a-modal
      title="导出文件名称"
      v-model="setNameVisible"
      okText="导出"
      cancelText="取消"
      @ok="handleSave"
    >
      <a-alert message="该操作将当前选中图层导出为.stl格式文件" style="margin-bottom: 20px" banner/>
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
<!--        <a-tab-pane key="cone">-->
<!--          <span slot="tab">-->
<!--            <i class="iconfont icon-cone"></i>-->
<!--            锥面切片-->
<!--          </span>-->
<!--          <a-form :form="coneForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">-->
<!--            <a-form-item label="起始切片半径">-->
<!--              <a-input-->
<!--                placeholder="输入起始切片半径"-->
<!--                v-decorator="['startRadius', { rules: [{ required: true, message: '输入起始切片半径!' }] }]"-->
<!--              />-->
<!--            </a-form-item>-->
<!--            <a-form-item label="起始切片高度">-->
<!--              <a-input-->
<!--                placeholder="输入起始切片高度"-->
<!--                v-decorator="['startHeight', { rules: [{ required: true, message: '输入起始切片高度!' }] }]"-->
<!--              />-->
<!--            </a-form-item>-->
<!--            <a-form-item label="终止切片高度">-->
<!--              <a-input-->
<!--                placeholder="输入终止切片高度"-->
<!--                v-decorator="['endHeight', { rules: [{ required: true, message: '输入终止切片高度!' }] }]"-->
<!--              />-->
<!--            </a-form-item>-->
<!--            <a-form-item label="层厚">-->
<!--              <a-input-->
<!--                placeholder="输入层厚"-->
<!--                v-decorator="['sliceThick', { rules: [{ required: true, message: '输入层厚!' }] }]"-->
<!--              />-->
<!--            </a-form-item>-->
<!--            <a-form-item label="绘制颜色">-->
<!--              <colorPicker-->
<!--                v-model="color"-->
<!--              />-->
<!--            </a-form-item>-->
<!--          </a-form>-->
<!--        </a-tab-pane>-->
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
    <a-drawer
      title="日志"
      placement="right"
      :visible="recordVisible"
      :mask="false"
      width="400"
      @close="() => this.recordVisible = false"
    >
      <a-timeline>
        <a-timeline-item v-for="(item, index) in logData" :key="index">
          {{ item.action }}------{{ moment(item.date).format('YYYY-MM-DD HH:mm:ss') }}
        </a-timeline-item>
      </a-timeline>
    </a-drawer>
    <a-modal
      title="轨迹生成"
      v-model="pathVisible"
      okText="确定"
      cancelText="取消"
      @ok="buildPath"
    >
      <a-form :form="pathForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="轨迹密度">
          <a-input
            placeholder="请输入轨迹密度"
            v-decorator="['pathDensity', { rules: [{ required: true, message: '请输入轨迹密度!' }] }]"
          />
        </a-form-item>
        <a-form-item label="绘制颜色">
          <colorPicker
            v-model="color"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-drawer
      title="GCode"
      placement="right"
      :visible="GCodeVisible"
      :mask="false"
      width="400"
      @close="() => this.GCodeVisible = false"
    >
      <a-spin tip="G代码生成中" :spinning="gSpinning">
        <a-textarea placeholder="G代码编辑区域" v-model="gCode" :rows="18"/>
      </a-spin>
      <div class="g-code-button">
        <a-button type="primary" @click="createG">
          生成G代码
        </a-button>
        <a-button type="primary" :disabled="!gCode" @click="downloadGCode">
          下载G代码
        </a-button>
      </div>
    </a-drawer>
    <input
      type="file"
      ref="fileInput"
      @change="getFile"
      style="display: none"
    >
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import moment from 'moment';
import {saveAsSTL} from '@js/fileSave';
import SceneTree from './components/SceneTree';
import {
  makeCone,
  makeHorizontalSlice,
  removeObject,
  removeAll,
  render,
  getScene,
  createdPath,
  animationDrawLine,
  splicingGCode,
  drawPCD,
} from '@js/drawFunction';
import {PCDLoader} from 'three/examples/jsm/loaders/PCDLoader';

export default {
  name: "TopBar",
  components: {
    SceneTree
  },
  computed: {
    ...mapState({
      indexData: state => state.commonData.indexData,
      logData: state => state.loggingData.logData,
    }),
  },
  data() {
    return {
      moment,
      setNameVisible: false, // 导出文件名字弹窗控制
      saveName: '',
      sliceFormVisible: false, // 切片信息输入弹窗控制
      sliceTabsKey: 'flat', // 切片信息面板
      coneForm: this.$form.createForm(this, {name: 'coneForm'}), // 锥面切片表单
      flatForm: this.$form.createForm(this, {name: 'flatForm'}), // 平面切片表单
      pathForm: this.$form.createForm(this, {name: 'pathForm'}), // 路径轨迹表单
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
      recordVisible: false, // 日志面板控制
      pathVisible: false, // 轨迹参数弹窗控制
      GCodeVisible: false, // G代码弹窗控制
      gCode: '', // g代码结果
      gSpinning: false, // g代码生成中控制
      imageUrl: "",  //img绑定的src地址
      postUrl: ""       //需要上传到的地址
    }
  },
  // 页面后退后清除数据
  destroyed() {
    removeAll();
  },
  methods: {
    ...mapMutations({
      deleteTreeDataItem: 'commonData/deleteTreeDataItem',
      addLogData: 'loggingData/addData',
      addData: 'loggingData/addData',
    }),
    // 处理导出stl文件
    handleSave() {
      if (this.saveName) {
        saveAsSTL(this.indexData, this.saveName);
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
          removeObject('水平切片'); // 移除切片
          removeObject('切片轨迹'); // 移除切片轨迹
          const start = window.performance.now();
          makeHorizontalSlice('水平切片', this.horizontalSliceParameter);
          const end = window.performance.now();
          const time = Math.round(end - start);
          this.addLogData({
            action: '完成水平切片，耗时' + time + 'ms',
            date: new Date(),
          })
          render();
          this.sliceFormVisible = false;
          this.flatForm.resetFields();
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
      // this.$message.info('该功能正在开发中...');
      animationDrawLine();
    },
    // 显示图层树形菜单
    showComponentsDrawer() {
      this.componentsVisible = !this.componentsVisible;
      this.componentsVisible && (this.treeData = getScene().children); // 如果为真更新数据
    },
    showRecordDrawer() {
      this.recordVisible = true;
    },
    buildPath() {
      this.pathForm.validateFields((err, values) => {
        if (!err) {
          removeObject('切片轨迹'); // 移除切片轨迹
          const start = window.performance.now();
          createdPath({
            pathDensity: values.pathDensity,
            color: this.color,
          });
          const end = window.performance.now();
          const time = Math.round(end - start);
          this.addData({
            action: '路径生成完毕，切片密度为:' + values.pathDensity + '，耗时：' + time + 'ms',
            date: new Date(),
          });
          this.pathVisible = false;
        }
      })
    },
    // 生成G代码
    createG() {
      this.gSpinning = true;
      splicingGCode().then(val => {
        this.gCode = val;
        this.gSpinning = false;
      }).catch(err => {
        this.$message.info(err);
        this.gSpinning = false;
      });
    },
    // 下载G代码
    downloadGCode() {
      //定义文件内容，类型必须为Blob 否则createObjectURL会报错
      let content = new Blob([this.gCode]);
      //生成url对象
      let urlObject = window.URL || window.webkitURL || window
      let url = urlObject.createObjectURL(content)
      //生成<a></a>DOM元素
      let el = document.createElement('a')
      //链接赋值
      el.href = url
      el.download = 'G代码.txt'
      //必须点击否则不会下载
      el.click()
      //移除链接释放资源
      urlObject.revokeObjectURL(url)
    },
    // 选择本地PCD文件
    selectPCDFile() {
      this.$refs.fileInput.click();
    },
    // 文件选择后
    getFile (event) {
      const files = event.target.files;
      const pcdPath = window.webkitURL.createObjectURL(files[0]);
      let loader = new PCDLoader();
      loader.load(pcdPath, (points) => {
        removeAll();
        drawPCD(points, 'PCD');
      })
    } ,
  }
}
</script>