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
    top: 29px;
    left: 40px;
    right: 0;
    bottom: 0;
  }

  #load-mask {
    position: fixed;
    width: calc(100% - 40px);
    height: calc(100% - 29px);
    top: 30px;
    left: 40px;
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
    <TopBar/>
    <LeftBar/>
    <div id="webgl"></div>
    <div v-if="loading" id="load-mask">
      <a-progress class="progress" type="circle" :percent="loadingPercent"/>
    </div>
  </div>
</template>

<script>
import * as Three from 'three';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';
import {
  statsInit,
  getScene,
  drawTXTCurve,
  removeGroup,
  drawSTL,
  initialScene,
  handleReset,
  showHide,
} from '@js/drawFunction';
import TopBar from "@components/WorkPage/TopBar";
import LeftBar from "@components/WorkPage/LeftBar";
import {mapMutations} from 'vuex';

export default {
  name: "WorkPage",
  components: {
    TopBar,
    LeftBar,
  },
  data() {
    return {
      showHide,
      currentModelName: '请选择模型',
      loading: false, // 是否加载中
      loadingPercent: 0, // 加载倒计时
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      modelFile: '',
    }
  },
  mounted() {
    initialScene();
    statsInit();
    window.onresize = () => {
      handleReset(); // 处理页面放缩
    };
    this.modelFile = window.sessionStorage.getItem('currentModelUrl') || '';
    this.loaderSTL(this.modelFile);
  },
  methods: {
    ...mapMutations({
      addData: 'loggingData/addData',
      resetData: 'loggingData/resetData',
    }),
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
      this.resetData(); // 重置日志
      removeGroup();
      this.loading = true;
      let loader = new STLLoader();
      loader.load(fileUrl, (geometry) => {
        this.addData({
          action: '模型加载完毕',
          date: new Date(),
        })
        drawSTL(geometry, fileUrl);
        this.loading = false;
        this.loadingPercent = 0;
      }, (xhr) => {
        this.loadingPercent = Number((xhr.loaded / xhr.total * 100).toFixed(2));
      })
    },
    // 选择展示哪个层级
    onTreeSelect(selectedKeys, info) {
      this.checkedKeys = selectedKeys;
      this.showHide(info.selectedNodes[0].key);
    },
  }
}
</script>