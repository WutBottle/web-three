import * as Three from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let scene = new Three.Scene(); // 场景对象
let camera = null; // 相机对象
let renderer = new Three.WebGLRenderer(); // 创建渲染器对象
let point = null; // 光源设置 点光源
let ambient = null; // 环境光
let width = window.innerWidth - 200; // 窗口宽度
let height = window.innerHeight - 60; // 窗口高度
let k = null; // 窗口宽高比
let s = null; // 三维场景显示范围控制系数，系数越大，显示的范围越大
let controls = {}; // 创建控件对象
let gridGroup = null; // 网格组
let axisGroup = null; // 中心坐标组
let initialSight = null; // 初始化模型视野

/** 获取场景对象scene **/
export const getScene = () => {
  return scene;
}

/** 移除场景中物体 **/
export const removeObject = (name) => {
  scene.remove(scene.getObjectByName(name));
}

/** 初始化Light **/
export const initialLight = () => {
  point = new Three.PointLight(0xffffff);
  ambient = new Three.AmbientLight(0x444444);
  point.position.set(200, 100, 300); //点光源位置
  scene.add(point); // 点光源添加到场景中
  scene.add(ambient); // 环境光添加到场景中
}

/** 初始化Camera **/
export const initialCamera = () => {
  s = 1000;
  k = width / height; //窗口宽高比
  camera = new Three.OrthographicCamera(-s * k, s * k, s, -s, -5000, 5000);
  camera.position.set(0, 0, 400); //设置相机位置
  camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
}

/** 初始化BG **/
export const initialBG = () => {
  renderer.setSize(width, height);//设置渲染区域尺寸
  renderer.setClearColor(0x333333, 1); //设置背景颜色
}

/** 添加鼠标控制 **/
export const orbitControls = () => {
  controls = new OrbitControls(camera, renderer.domElement);//创建控件对象
  controls.enablePan = false; // 禁止右键拖拽
  controls.minZoom = 0.5;
  controls.maxZoom = 2; // 最大放大距离
  renderer.domElement.removeAttribute("tabindex");
  controls.addEventListener('change', render);
}

/** 初始化scene **/
export const initialScene = () => {
  initialLight();
  initialCamera();
  initialBG();
  const fatherElement = document.getElementById('webgl');
  fatherElement.appendChild(renderer.domElement); //webgl元素中插入canvas对象
  drawAxis();
  drawGrid();
  orbitControls(); // 添加鼠标控制
  render();
}

/** 绘制椎体所需参数
 * radiusTop: 上底半径
 * radiusBottom: 下底半径
 * height: 椎体高度
 * radiusSegments: 半径绘制密度
 * heightSegments: 高度绘制密度
 * openEnded: 底部是否开合
 * color: 绘制颜色
 * **/
export const makeCone = (name, cylinderGeometryParameter) => {
  const {startHeight, radiusTop, radiusBottom, height, radiusSegments, heightSegments, thick, openEnded, color} = cylinderGeometryParameter;
  let groupArray = new Three.Group();
  groupArray.name = name;
  for (let i = 0; i < Math.floor(height / thick); i++) {
    let geometry = new Three.CylinderGeometry(radiusTop, radiusBottom + i * thick, height + i * thick, radiusSegments, heightSegments, openEnded);
    let cylinder = new Three.Mesh(geometry, new Three.MeshLambertMaterial({
      color: color,
      wireframe: true,
    }));
    let group = new Three.Group();
    group.name = name + i;
    group.add(cylinder);
    group.rotateX(Math.PI / 2)
    group.position.x = 0;
    group.position.y = 0;
    group.position.z = startHeight + height / 2 + i * thick / 2;
    groupArray.add(group);
  }
  scene.add(groupArray);
}

/** 执行渲染 **/
export const render = () => {
  renderer.render(scene, camera);//执行渲染操作
}

/** 移除场景内所有Group **/
export const removeGroup = () => {
  let allChildren = scene.children;
  for (let i = allChildren.length - 1; i >= 0; i--) {
    if (allChildren[i] instanceof Three.Group) {
      scene.remove(allChildren[i]);
    }
  }
}

/** 绘制底部网格
 * len: 默认线段长度
 * **/
export const drawGrid = (len = 800) => {
  gridGroup = new Three.Group();
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
    gridGroup.name = 'bottomGrid';
    gridGroup.add(line1, line2);
  }
  scene.add(gridGroup);
}

/** 绘制坐标
 * size: 默认坐标线长度
 * **/
export const drawAxis = (size = 800) => {
  axisGroup = new Three.Group();
  axisGroup.name = 'centerAxis';
  //来自原点的方向。必须是单位向量
  const dirX = new Three.Vector3(size, 0, 0);
  const dirY = new Three.Vector3(0, size, 0);
  const dirZ = new Three.Vector3(0, 0, size);
  // 规格化方向向量(转换为长度为1的向量)
  dirX.normalize();
  dirY.normalize();
  dirZ.normalize();
  // 箭头开始的点
  const origin = new Three.Vector3(0, 0, 0);
  // 箭头的长度。默认值为1
  const length = size;
  // 颜色
  const hexX = 0xff0000;
  const hexY = 0x00ff00;
  const hexZ = 0x0000ff;
  // 箭头的长度。默认值为0.2 *length
  let headLength = 0;
  // 箭头宽度的长度。默认值为0.2 * headLength。
  let headWidth = 0;
  let arrowHelperX = new Three.ArrowHelper(dirX, origin, length, hexX, headLength, headWidth);
  let arrowHelperY = new Three.ArrowHelper(dirY, origin, length, hexY, headLength, headWidth);
  let arrowHelperZ = new Three.ArrowHelper(dirZ, origin, length, hexZ, headLength, headWidth);
  axisGroup.add(arrowHelperX, arrowHelperY, arrowHelperZ);
  axisGroup.name = 'centerAxis';
  scene.add(axisGroup);
}

/** 绘制txt读取的曲线
 * inputPoints: 组成曲线的点
 * **/
export const drawTXTCurve = (inputPoints) => {
  removeGroup();
  drawGrid();
  drawAxis();
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
  scene.add(SliceGroup);
  render();
}

/** 重置页面视野 **/
export const resetModel = () => {
  k = width / height; //窗口宽高比
  s = initialSight || 1000;
  camera.left = -s * k;
  camera.right = s * k;
  camera.top = s;
  camera.bottom = -s;
  camera.position.set(0, 0, 400); //设置相机位置
  camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
  camera.updateProjectionMatrix();
  render();
}

/** 创建geometry包络盒
 * data: 包络盒数据
 * **/
export const createSurroundBox = (data) => {
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
  scene.add(group);
}

/** 计算geometry合适视野
 * data: 包络盒数据
 * **/
export const computeSight = (data) => {
  let temp = new Array(3);
  temp[0] = data.max.x - data.min.x;
  temp[1] = data.max.y - data.min.y;
  temp[2] = data.max.z - data.min.z;
  return Math.floor(Math.max(...temp) * 1.1);
}

/** 绘制加载的STL文件
 * geometry: 几何体对象
 * name: 几何体名字
 * **/
export const drawSTL = (geometry, name) => {
  // 加载完成后会返回一个几何体对象BufferGeometry，你可以通过Mesh、Points等方式渲染该几何体
  geometry.computeBoundingBox();
  createSurroundBox(geometry.boundingBox);
  initialSight = computeSight(geometry.boundingBox);
  let material = new Three.MeshLambertMaterial({
    color: 0x29d6d6,
    side: Three.DoubleSide,
    wireframe: false,
  }); //材质对象Material
  let mesh = new Three.Mesh(geometry, material); //网格模型对象Mesh
  let group = new Three.Group();
  group.name = name;
  group.add(mesh);
  scene.add(group); //网格模型添加到场景中
  drawGrid(initialSight);
  drawAxis(initialSight);
  resetModel();
}

/** 处理页面缩放 **/
export const handleReset = () => {
  width = window.innerWidth - 200;
  height = window.innerHeight - 60;
  renderer.setSize(width, height);
  // 重置相机投影的相关参数
  k = width / height;//窗口宽高比
  camera.left = -s * k;
  camera.right = s * k;
  camera.top = s;
  camera.bottom = -s;
  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();
  render();
}

/** 放大页面 **/
export const handleEnlarge = () => {
  s *= 0.9;
  camera.left = -s * k;
  camera.right = s * k;
  camera.top = s;
  camera.bottom = -s;
  camera.updateProjectionMatrix();
  render();
}

/** 缩小页面 **/
export const handleNarrow = () => {
  s *= 1.1;
  camera.left = -s * k;
  camera.right = s * k;
  camera.top = s;
  camera.bottom = -s;
  camera.updateProjectionMatrix();
  render();
}

/** 控制group显示或隐藏
 * name: Group的name
 * **/
export const showHide = (name) => {
  if (scene.getObjectByName(name)) {
    scene.getObjectByName(name).visible = !scene.getObjectByName(name).visible;
    render();
  }
}

/** 动画效果绘制线 **/
export const animationDrawLine = () => {
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
  scene.add(tube);

  let box = new Three.SphereGeometry(50, 20, 20);
  let material = new Three.MeshBasicMaterial({
    color: 0x7777ff
  }); //材质对象
  let mesh = new Three.Mesh(box, material);
  scene.add(mesh);
  mesh.position.set(-600, 0, 300)
  scene.add(mesh);

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
    render();
    requestAnimationFrame(renderA);
    // 更新帧动画的时间
    mixer.update(clock.getDelta());
  }
  renderA();
}