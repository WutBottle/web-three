<style lang="scss">
.WorkPage {
  .top {
    position: absolute;
    width: 100%;
    height: 56px;

    .operate-wrapper {
      position: absolute;
      top: 12px;
      left: 500px;
      width: 580px;
      display: inline-block;

      &:hover {
        cursor: default;
      }

      button {
        border: none;
        background-color: transparent;
        outline: none;

        i {
          font-size: 30px;
          color: #5d5d5d;
        }
      }
    }
  }

  .left {
    overflow: auto;
    background: #333333;
    position: absolute;
    top: 60px;
    width: 196px;
    bottom: 0;

    .ant-tree-title {
      color: #fff;
    }
  }

  #webgl {
    position: absolute;
    top: 60px;
    left: 200px;
  }

  #load-mask {
    position: fixed;
    width: calc(100% - 200px);
    height: calc(100% - 60px);
    top: 60px;
    left: 200px;
    background-color: rgba(200, 200, 200, 0.8);
    text-align: center;

    .progress {
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      height: 30%;
      width: 50%;
      margin: -10% 0 0 -25%;
    }
  }


}

.m-colorPicker .box {
  position: fixed !important;
}
</style>

<template>
  <div class="WorkPage">
    <div id="statsWrapper"></div>
    <div class="top">
      <a-page-header
        style="border: 1px solid rgb(235, 237, 240);"
        title="返回"
        @back="() => {this.$router.push('/file')}"
      />
      <div class="operate-wrapper">
        <a-tooltip placement="top">
          <template slot="title">
            <span>回中</span>
          </template>
          <button @click="resetModel">
            <i class="iconfont icon-reset"></i>
          </button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>放大</span>
          </template>
          <button @click="handleEnlarge">
            <i class="iconfont icon-enlarge"></i>
          </button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>缩小</span>
          </template>
          <button @click="handleNarrow">
            <i class="iconfont icon-narrow"></i>
          </button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>坐标轴</span>
          </template>
          <button @click="showHide('centerAxis')">
            <i class="iconfont icon-axis"></i>
          </button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>底部网格</span>
          </template>
          <button @click="showHide('bottomGrid')">
            <i class="iconfont icon-grid"></i>
          </button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>包络盒</span>
          </template>
          <button @click="showHide('surroundBox')">
            <i class="iconfont icon-box"></i>
          </button>
        </a-tooltip>
        <a-tooltip placement="top">
          <template slot="title">
            <span>切片</span>
          </template>
          <button @click="() => this.sliceFormVisible = true">
            <i class="iconfont icon-slice"></i>
          </button>
        </a-tooltip>
<!--        <input type="file" ref="filElem" @change="readTXT">-->
      </div>
    </div>
    <div class="left">
      <a-tree
          v-model="checkedKeys"
          :auto-expand-parent="true"
          :selected-keys="selectedKeys"
          :tree-data="treeData"
          @select="onTreeSelect"
      />
    </div>
    <div id="webgl"></div>
    <div v-if="loading" id="load-mask">
      <a-progress class="progress" type="circle" :percent="loadingPercent"/>
    </div>
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
  </div>
</template>

<script>
import * as Three from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {
  statsInit,
  removeObject,
  makeCone,
  render,
  getScene,
  drawTXTCurve,
  removeGroup,
  drawSTL,
  initialScene,
  handleReset,
  handleEnlarge,
  handleNarrow,
  resetModel,
  showHide,
  makeHorizontalSlice,
} from '@js/drawFunction';

export default {
  name: "WorkPage",
  data() {
    return {
      handleEnlarge,
      handleNarrow,
      resetModel,
      showHide,
      currentModelName: '请选择模型',
      loading: false, // 是否加载中
      loadingPercent: 0, // 加载倒计时
      sliceFormVisible: false, // 圆柱参数表单
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
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      sliceTabsKey: 'flat', // 切片信息面板
      color: '#ff0000', // 选择
      modelFile: '',
    }
  },
  mounted() {
    initialScene();
    statsInit();
    window.onresize = () => {
      handleReset(); // 处理页面放缩
    };
    this.modelFile = this.$route.params.modelFileUrl;
    this.loaderSTL(this.modelFile);
  },
  methods: {
    // 文件读取入口
    readTXT() {
      const inputFile = this.$refs.filElem.files[0];
      const reader = new FileReader();
      reader.readAsText(inputFile, 'utf8'); // input.files[0]为第一个文件
      reader.onload = () => {
        const snsArr = reader.result.split(/[(\r\n)\r\n]+/); // 根据换行分割
        drawTXTCurve(this.stringConvertArray(snsArr));
        this.createTree();
      }
    },
    // string坐标信息读取为Array数组
    stringConvertArray(originalData) {
      const SLength = Number(originalData.shift().split(' ')[1]);
      let LIndex = -1, BIndex = -1, CIndex = -1, PIndex = -1, ans = new Array(SLength).fill([]);
      originalData.forEach(item => {
        if (item.includes('L')) {
          LIndex++;
          const BLength = Number(item.split(' ')[1]);
          ans[LIndex] = new Array(BLength).fill([]);
          BIndex = -1;
          CIndex = -1;
          PIndex = -1;
        } else if (item.includes('B')) {
          BIndex++;
          const CLength = Number(item.split(' ')[1]);
          ans[LIndex][BIndex] = new Array(CLength).fill([]);
          CIndex = -1;
          PIndex = -1;
        } else if (item.includes('C')) {
          CIndex++;
          const PLength = Number(item.split(' ')[1]);
          ans[LIndex][BIndex][CIndex] = new Array(PLength);
        } else {
          PIndex++;
          const [x, y, z] = item.split(' ');
          if (!isNaN(Number(x)) && !isNaN(Number(y)) && !isNaN(Number(z))) {
            ans[LIndex][BIndex][CIndex][PIndex] = [Number(x), Number(y), Number(z)];
          }
        }
      });
      return ans;
    },
    // 遍历场景
    traverseScene(source, treeData, fatherKey) {
      for (let key in source) {
        if (source[key] instanceof Three.Group) {
          const currentName = source[key].name.split('-').pop();
          const currentKey = fatherKey ? fatherKey + '-' + currentName : currentName;
          if (source[key].children.length) {
            treeData.push({
              title: currentName,
              key: currentKey,
              children: [],
            });
            const currentIndex = treeData.findIndex(value => value.title === currentName);
            this.traverseScene(source[key].children, treeData[currentIndex].children, treeData[currentIndex].key);
          } else {
            treeData.push({
              title: currentName,
              key: currentKey,
            });
          }
        }
      }
    },
    // 生成菜单树
    createTree() {
      this.traverseScene(getScene().children, this.treeData, ''); // 遍历scene进行控制
    },
    loaderSTL(fileUrl) {
      removeGroup();
      this.loading = true;
      let loader = new STLLoader();
      loader.load(fileUrl, (geometry) => {
        drawSTL(geometry, fileUrl);
        this.loading = false;
        this.loadingPercent = 0;
      }, (xhr) => {
        this.loadingPercent = Number((xhr.loaded / xhr.total * 100).toFixed(2));
      })
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
    // 选择展示哪个层级
    onTreeSelect(selectedKeys, info) {
      this.checkedKeys = selectedKeys;
      this.showHide(info.selectedNodes[0].key);
    },
  }
}
</script>