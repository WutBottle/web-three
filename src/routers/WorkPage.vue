<style lang="scss">
.WorkPage {
  .top {
    border-bottom: 1px solid rgb(68, 68, 68);
    position: absolute;
    width: 100%;
    height: 56px;
    background: rgb(51, 51, 51);

    .select {
      position: absolute;
      top: 12px;
      left: 20px;
    }

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
          color: #a8a8a8;
        }
      }
    }
  }

  .left {
    overflow: auto;
    background: #333333;
    border-right: solid 1px #444444;
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
</style>

<template>
  <div class="WorkPage">
    <div class="top">
      <a-select class="select" v-model="currentModelName" placeholder="请选择模型" style="width: 120px"
                @change="handleChange">
        <a-select-option value="轮轴">
          轮轴
        </a-select-option>
        <a-select-option value="扇形">
          扇形
        </a-select-option>
        <a-select-option value="小火龙">
          小火龙
        </a-select-option>
      </a-select>
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
    <a-modal v-model="sliceFormVisible" title="切片" @ok="handleConeOk" cancelText="取消" okText="确认" :maskClosable="false">
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
            <a-form-item label="起始切片高度">
              <a-input
                  placeholder="输入起始切片高度"
                  v-decorator="['startHeight', { rules: [{ required: true, message: '输入起始切片高度!' }] }]"
              />
            </a-form-item>
            <a-form-item label="起始切片半径">
              <a-input
                  placeholder="输入起始切片半径"
                  v-decorator="['startRadius', { rules: [{ required: true, message: '输入起始切片半径!' }] }]"
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
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader';

const modelUrl = 'http://10.224.120.179:8010/';
export default {
  name: "WorkPage",
  data() {
    return {
      currentModelName: '请选择模型',
      scene: new Three.Scene(), // 场景对象
      camera: null, // 相机对象
      point: null, // 光源设置 点光源
      ambient: null, // 环境光
      mesh: null, // 材质对象
      width: window.innerWidth - 200, //窗口宽度
      height: window.innerHeight - 60, //窗口高度
      k: null, // 窗口宽高比
      s: null, // 三维场景显示范围控制系数，系数越大，显示的范围越大
      renderer: new Three.WebGLRenderer(), // 创建渲染器对象
      controls: {}, //创建控件对象
      selectedObject: null, // 选择物体
      gridGroup: null, // 网格组
      axisGroup: null, // 中心坐标组
      initialSight: null, // 初始化模型视野
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
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      sliceTabsKey: 'flat', // 切片信息面板
      color: '#ff0000', // 选择
    }
  },
  mounted() {
    this.initialScene();
    window.onresize = () => {
      this.handleReset(); // 处理页面放缩
    };
  },
  methods: {
    // 文件读取入口
    readTXT() {
      const inputFile = this.$refs.filElem.files[0];
      const reader = new FileReader();
      reader.readAsText(inputFile, 'utf8'); // input.files[0]为第一个文件
      reader.onload = () => {
        const snsArr = reader.result.split(/[(\r\n)\r\n]+/); // 根据换行分割
        this.drawCurve(this.stringConvertArray(snsArr));
      }
    },
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
      this.traverseScene(this.scene.children, this.treeData, ''); // 遍历scene进行控制
    },
    drawCurve(inputPoints) {
      this.removeGroup();
      this.drawGrid();
      this.drawAxis();
      let SliceGroup = new Three.Group();
      SliceGroup.name = 'slice';
      inputPoints.forEach((LItem, LIndex) => {
        let LayerGroup = new Three.Group();
        LayerGroup.name = SliceGroup.name + '-' + 'layer' + LIndex;
        SliceGroup.add(LayerGroup);
        LItem.forEach((BItem, BIndex) => {
          let BlockGroup = new Three.Group();
          BlockGroup.name = LayerGroup.name + '-' + 'block' + BIndex;
          LayerGroup.add(BlockGroup);
          BItem.forEach((CItem, CIndex) => {
            if (CItem.length) { // 判断Chain内部是否有点集
              let ChainGroup = new Three.Group();
              ChainGroup.name = BlockGroup.name + '-' + 'chain' + CIndex;
              BlockGroup.add(ChainGroup);
              let pointArray = [];
              CItem.forEach(item => {
                pointArray.push(new Three.Vector3(item[0], item[1], item[2]));
              });
              //Create a closed wavey loop
              let curve = new Three.CatmullRomCurve3(pointArray, false);
              let points = curve.getPoints(10);
              let geometry = new Three.BufferGeometry().setFromPoints(points);
              let material = new Three.LineBasicMaterial({color: 0xff0000});
              // Create the final object to add to the scene
              let curveObject = new Three.Line(geometry, material);
              ChainGroup.add(curveObject);
            }
          })
        })
      });
      this.scene.add(SliceGroup);
      this.createTree();
      this.render();
    },
    handleChange(value) {
      this.loaderSTL(value);
    },
    initialScene() {
      this.initialLight();
      this.initialCamera();
      this.initialBG();
      const fatherElement = document.getElementById('webgl');
      fatherElement.appendChild(this.renderer.domElement); //webgl元素中插入canvas对象
      this.drawAxis();
      this.drawGrid();
      this.orbitControls(); // 添加鼠标控制
      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);//执行渲染操作
    },
    // 添加鼠标控制
    orbitControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);//创建控件对象
      this.controls.enablePan = false; // 禁止右键拖拽
      this.controls.minZoom = 0.5;
      this.controls.maxZoom = 2; // 最大放大距离
      this.renderer.domElement.removeAttribute("tabindex");
      this.controls.addEventListener('change', this.render);
    },
    drawGrid(len = 800) {
      this.gridGroup = new Three.Group();
      let geometry = new Three.Geometry();
      geometry.vertices.push(new Three.Vector3(-len, -len / 2, 0));
      geometry.vertices.push(new Three.Vector3(len, -len / 2, 0));
      let unitLen = 2 * len / 50;
      for (let i = 0; i <= 50; i++) {
        //画横线
        let line1 = new Three.Line(geometry, new Three.LineBasicMaterial({color: 0xffffdd, opacity: 0.1}));
        line1.position.z = (i * unitLen) - len;

        let line2 = new Three.Line(geometry, new Three.LineBasicMaterial({color: 0xffffdd, opacity: 0.1}));
        line2.position.x = (i * unitLen) - len;
        line2.rotation.y = 90 * Math.PI / 180;   //转90度
        this.gridGroup.name = 'bottomGrid';
        this.gridGroup.add(line1, line2);
      }
      this.scene.add(this.gridGroup);
    },
    // 绘制坐标轴
    drawAxis(size = 800) {
      this.axisGroup = new Three.Group();
      this.axisGroup.name = 'centerAxis';
      //来自原点的方向。必须是单位向量
      let dirX = new Three.Vector3(size, 0, 0);
      let dirY = new Three.Vector3(0, size, 0);
      let dirZ = new Three.Vector3(0, 0, size);
      // 规格化方向向量(转换为长度为1的向量)
      dirX.normalize();
      dirY.normalize();
      dirZ.normalize();
      // 箭头开始的点
      let origin = new Three.Vector3(0, 0, 0);
      // 箭头的长度。默认值为1
      let length = size;
      // 颜色
      let hexX = 0xff0000;
      let hexY = 0x00ff00;
      let hexZ = 0x0000ff;
      // 箭头的长度。默认值为0.2 *length
      let headLength = 0;
      // 箭头宽度的长度。默认值为0.2 * headLength。
      let headWidth = 0;
      let arrowHelperX = new Three.ArrowHelper(dirX, origin, length, hexX, headLength, headWidth);
      let arrowHelperY = new Three.ArrowHelper(dirY, origin, length, hexY, headLength, headWidth);
      let arrowHelperZ = new Three.ArrowHelper(dirZ, origin, length, hexZ, headLength, headWidth);
      this.axisGroup.add(arrowHelperX, arrowHelperY, arrowHelperZ);
      this.axisGroup.name = 'centerAxis';
      this.scene.add(this.axisGroup);
    },
    initialBG() {
      this.renderer.setSize(this.width, this.height);//设置渲染区域尺寸
      this.renderer.setClearColor(0x333333, 1); //设置背景颜色
    },
    initialCamera() {
      // 相机设置
      this.s = 1000;
      this.k = this.width / this.height; //窗口宽高比
      this.camera = new Three.OrthographicCamera(-this.s * this.k, this.s * this.k, this.s, -this.s, -5000, 5000);
      this.camera.position.set(0, 0, 400); //设置相机位置
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    },
    initialLight() {
      this.point = new Three.PointLight(0xffffff);
      this.ambient = new Three.AmbientLight(0x444444);
      this.point.position.set(200, 100, 300); //点光源位置
      this.scene.add(this.point); // 点光源添加到场景中
      this.scene.add(this.ambient); // 环境光添加到场景中
    },
    handleEnlarge() {
      this.s *= 0.9;
      this.camera.left = -this.s * this.k;
      this.camera.right = this.s * this.k;
      this.camera.top = this.s;
      this.camera.bottom = -this.s;
      this.camera.updateProjectionMatrix();
      this.render();
    },
    handleNarrow() {
      this.s *= 1.1;
      this.camera.left = -this.s * this.k;
      this.camera.right = this.s * this.k;
      this.camera.top = this.s;
      this.camera.bottom = -this.s;
      this.camera.updateProjectionMatrix();
      this.render();
    },
    showHide(name) {
      if (this.scene.getObjectByName(name)) {
        this.scene.getObjectByName(name).visible = !this.scene.getObjectByName(name).visible;
        this.render();
      }
    },
    handleReset() {
      this.width = window.innerWidth - 200;
      this.height = window.innerHeight - 60;
      this.renderer.setSize(this.width, this.height);
      // 重置相机投影的相关参数
      this.k = this.width / this.height;//窗口宽高比
      this.camera.left = -this.s * this.k;
      this.camera.right = this.s * this.k;
      this.camera.top = this.s;
      this.camera.bottom = -this.s;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      this.camera.updateProjectionMatrix();
      this.render();
    },
    removeGroup() {
      let allChildren = this.scene.children;
      for (let i = allChildren.length - 1; i >= 0; i--) {
        if (allChildren[i] instanceof Three.Group) {
          this.scene.remove(allChildren[i]);
        }
      }
    },
    // 计算合适视野
    computeSight(data) {
      let temp = new Array(3);
      temp[0] = data.max.x - data.min.x;
      temp[1] = data.max.y - data.min.y;
      temp[2] = data.max.z - data.min.z;
      return Math.floor(Math.max(...temp) * 1.1);
    },
    loaderSTL(name) {
      this.removeGroup();
      this.loading = true;
      let loader = new STLLoader();
      loader.load(modelUrl + name + '.stl', (geometry) => {
        // 加载完成后会返回一个几何体对象BufferGeometry，你可以通过Mesh、Points等方式渲染该几何体
        geometry.computeBoundingBox();
        this.createSurroundBox(geometry.boundingBox);
        this.initialSight = this.computeSight(geometry.boundingBox);
        let material = new Three.MeshLambertMaterial({
          color: 0x29d6d6,
          side: Three.DoubleSide,
          wireframe: true,
        }); //材质对象Material
        let mesh = new Three.Mesh(geometry, material); //网格模型对象Mesh
        let group = new Three.Group();
        group.name = name;
        group.add(mesh);
        this.scene.add(group); //网格模型添加到场景中
        this.drawGrid(this.initialSight);
        this.drawAxis(this.initialSight);
        this.resetModel();
        this.loading = false;
        this.loadingPercent = 0;
      }, (xhr) => {
        this.loadingPercent = Number((xhr.loaded / xhr.total * 100).toFixed(2));
      })
    },
    createSurroundBox(data) {
      let ballGeometry = new Three.SphereGeometry(Math.abs(data.max.x - data.min.x) * 0.05, 40, 40);
      let ballMaterial = new Three.MeshLambertMaterial({
        color: 0xffff00
      });
      let ballMesh = new Three.Mesh(ballGeometry, ballMaterial); //网格模型对象Mesh
      ballMesh.position.x = (data.min.x + data.max.x) / 2;
      ballMesh.position.y = (data.min.y + data.max.y) / 2;
      ballMesh.position.z = (data.min.z + data.max.z) / 2;
      let helper = new Three.Box3Helper(data, 0xffff00);
      let group = new Three.Group();
      group.name = 'surroundBox';
      group.visible = false;
      group.add(helper, ballMesh);
      this.scene.add(group);
    },
    resetModel() {
      this.k = this.width / this.height; //窗口宽高比
      this.s = this.initialSight || 1000;
      this.camera.left = -this.s * this.k;
      this.camera.right = this.s * this.k;
      this.camera.top = this.s;
      this.camera.bottom = -this.s;
      this.camera.position.set(0, 0, 400); //设置相机位置
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
      this.camera.updateProjectionMatrix();
      this.render();
    },
    makeCone() {
      this.scene.remove(this.scene.getObjectByName('cone'));
      const {radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, color} = this.cylinderGeometryParameter;
      let geometry = new Three.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
      let cylinder = new Three.Mesh(geometry, new Three.MeshLambertMaterial({
        color: color,
        wireframe: true,
      }));
      let group = new Three.Group();
      group.name = 'cone';
      group.add(cylinder);
      this.scene.add(group);
      this.render();
    },
    // 提交切片表单
    handleConeOk() {
      // 水平切片
      this.sliceTabsKey === 'flat' && this.flatForm.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
      // 椎体切片
      this.sliceTabsKey === 'cone' && this.coneForm.validateFields((err, values) => {
        if (!err) {
          Object.assign(this.cylinderGeometryParameter, {
            radiusTop: 0,
            radiusBottom: Number(values.startRadius),
            height: Number(values.endHeight - values.startHeight),
            thick: Number(values.sliceThick),
            color: this.color,
            radiusSegments: 20,
            heightSegments: 20,
            openEnded: true,
          });
          this.makeCone();
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
    // 动画绘制线
    animationDrawLine() {
      let curve = new Three.CatmullRomCurve3([
        new Three.Vector3(-600, 0, 300),
        new Three.Vector3(-300, 300, 0),
        new Three.Vector3(0, 0, 0),
        new Three.Vector3(300, 300, 0),
        new Three.Vector3(600, 0, -300)
      ], false/*是否闭合*/);

      let tubeGeometry = new Three.TubeGeometry(curve, 100, 1, 100, false);
      let tubeMaterial = new Three.MeshBasicMaterial({color: 0xbbff00, wireframe: false})
      let tube = new Three.Mesh(tubeGeometry, tubeMaterial);
      this.scene.add(tube);

      let box = new Three.SphereGeometry(50, 20, 20);
      let material = new Three.MeshBasicMaterial({
        color: 0x7777ff
      }); //材质对象
      let mesh = new Three.Mesh(box, material);
      this.scene.add(mesh);
      mesh.position.set(-600, 0, 300)
      this.scene.add(mesh);

      let points = curve.getPoints(100);
      // 声明一个数组用于存储时间序列
      let arr = [];
      for (let i = 0; i < 101; i++) {
        arr.push(i);
      }
      // 生成一个时间序列
      let times = new Float32Array(arr);

      let posArr = [];
      points.forEach(elem => {
        posArr.push(elem.x, elem.y, elem.z)
      });
      // 创建一个和时间序列相对应的位置坐标系列
      let values = new Float32Array(posArr);
      // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
      let posTrack = new Three.KeyframeTrack('.position', times, values);
      let duration = 101;
      let clip = new Three.AnimationClip("default", duration, [posTrack]);
      let mixer = new Three.AnimationMixer(mesh);
      let AnimationAction = mixer.clipAction(clip);
      AnimationAction.timeScale = 10; // 调节播放速度
      AnimationAction.play();

      let clock = new Three.Clock();
      const renderA = () => {
        this.render();
        requestAnimationFrame(renderA);
        // 更新帧动画的时间
        mixer.update(clock.getDelta());
      }
      renderA();
    }
  }
}
</script>