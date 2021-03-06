import * as Three from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';
import store from '@/store';
import Vue from "_vue@2.6.12@vue";

const leftNum = 40; // 页面左侧菜单栏宽度
const topNum = 29; // 页面顶部菜单栏高度
let scene = new Three.Scene(); // 场景对象
let camera = null; // 相机对象
let renderer = new Three.WebGLRenderer(); // 创建渲染器对象
let width = window.innerWidth - leftNum; // 窗口宽度
let height = window.innerHeight - topNum; // 窗口高度
let k = null; // 窗口宽高比
let s = null; // 三维场景显示范围控制系数，系数越大，显示的范围越大
let controls = {}; // 创建控件对象

let gridGroup = null; // 网格组
let axisGroup = null; // 中心坐标组
let initialSight = null; // 初始化模型视野
let modalOffSet = {}; // 模型矫正中心位置偏移指数
let boundingBox = {}; // 包络盒信息
let currentGeometryPoint = []; // 当前模型三角面片数据
let topologicalData = {}; // 拓扑重构后数据
let contourPoint = []; // 模型切片轮廓数据
let pathPoints = []; // 轨迹规划路径数据

/** 添加帧数监听 **/
export const statsInit = () => {
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  const wrapperDom = document.getElementById('statsWrapper');
  wrapperDom.appendChild(stats.dom);
  stats.dom.style.left = 'auto';
  stats.dom.style.right = '0';
  stats.dom.style.top = '30px';
  stats.dom.style.zIndex = 100;

  function animate() {
    stats.begin();
    // monitored code goes here
    stats.end();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


/** 获取场景对象scene **/
export const getScene = () => {
  return scene.clone(); // 使用内置clone拷贝对象暴露出去
}

/** 移除场景中物体 **/
export const removeObject = (name) => {
  scene.remove(scene.getObjectByName(name));
}

/** 初始化Light **/
export const initialLight = () => {
  let directionalLightLeft = new Three.DirectionalLight(0xffffff); // 光源设置 点光源
  directionalLightLeft.position.set(0, 0, 1000);
  scene.add(directionalLightLeft); // 点光源添加到场景中
  let directionalLightRight = new Three.DirectionalLight(0xffffff); // 光源设置 点光源
  directionalLightRight.position.set(0, 0, -1000);
  scene.add(directionalLightRight); // 点光源添加到场景中
  let ambient; // 环境光
  ambient = new Three.AmbientLight(0xffffff);
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

/** 初始化Background **/
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

/** 清除场景内所有对象 **/
export const removeAll = () => {
  let allChildren = scene.children;
  for (let i = allChildren.length - 1; i >= 0; i--) {
    scene.remove(allChildren[i]);
  }
  gridGroup = null; // 网格组
  axisGroup = null; // 中心坐标组
  initialSight = null; // 初始化模型视野
  modalOffSet = {}; // 模型矫正中心位置偏移指数
  boundingBox = {}; // 包络盒信息
  currentGeometryPoint = []; // 当前模型三角面片数据
  topologicalData = {}; // 拓扑重构后数据
  contourPoint = []; // 模型切片轮廓数据
  pathPoints = []; // 轨迹规划路径数据
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
    gridGroup.name = '底部网格';
    gridGroup.add(line1, line2);
  }
  scene.add(gridGroup);
}

/** 绘制坐标
 * size: 默认坐标线长度
 * **/
export const drawAxis = (size = 800) => {
  axisGroup = new Three.Group();
  axisGroup.name = '坐标轴';
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
  scene.add(axisGroup);
  drawText('X', {
    fontsize: 16,
    borderColor: {r: 255, g: 0, b: 0, a: 1},
    backgroundColor: {r: 255, g: 0, b: 0, a: 1},
    position: {x: size, y: -size / 2, z: 0},
    XScale: size,
    YScale: size * 0.5,
  }, '坐标轴');
  drawText('Y', {
    fontsize: 16,
    borderColor: {r: 0, g: 255, b: 0, a: 1},
    backgroundColor: {r: 0, g: 255, b: 0, a: 1},
    position: {x: 0, y: size / 2, z: 0},
    XScale: size,
    YScale: size * 0.5,
  }, '坐标轴');
  drawText('Z', {
    fontsize: 16,
    borderColor: {r: 0, g: 0, b: 255, a: 1},
    backgroundColor: {r: 0, g: 0, b: 255, a: 1},
    position: {x: 0, y: -size / 2, z: size},
    XScale: size,
    YScale: size * 0.5,
  }, '坐标轴')
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
  let ballGeometry = new Three.SphereGeometry(Math.abs(data.max.x - data.min.x) * 0.05, 20, 20);
  let ballMaterial = new Three.MeshLambertMaterial({
    color: 0xffff00
  });
  let ballMesh = new Three.Mesh(ballGeometry, ballMaterial); //网格模型对象Mesh
  ballMesh.position.x = (data.min.x + data.max.x) / 2;
  ballMesh.position.y = (data.min.y + data.max.y) / 2;
  ballMesh.position.z = (data.min.z + data.max.z) / 2;
  let helper = new Three.Box3Helper(data, 0xffff00);
  let group = new Three.Group();
  group.add(helper, ballMesh);
  group.name = '包络盒';
  group.visible = false;
  correctOffSet(group, modalOffSet);
  scene.add(group);
  drawText('这是包络盒', {
    fontsize: 30,
    borderColor: {r: 0, g: 0, b: 0, a: 1},
    backgroundColor: {r: 0, g: 0, b: 0, a: 1},
    position: {x: 10, y: -5, z: 0},
    XScale: Math.abs(Math.floor((boundingBox.max.x - boundingBox.min.x))),
    YScale: -Math.abs(Math.floor((boundingBox.max.y - boundingBox.min.y) * 0.5)),
  }, '包络盒')
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

/**
 * 设置加载模型居中
 * {Group} Group 模型对象
 */
function setModelPosition(group) {
  let box3 = new Three.Box3();
  // 计算层级模型group的包围盒
  // 模型group是加载一个三维模型返回的对象，包含多个网格模型
  box3.expandByObject(group);
  // 计算一个层级模型对应包围盒的几何体中心在世界坐标中的位置
  let center = new Three.Vector3();
  box3.getCenter(center);
  // 重新设置模型的位置，使之居中。
  group.position.x = group.position.x - center.x;
  group.position.y = group.position.y - center.y;
  group.position.z = group.position.z - center.z;
  return group.position;
}

/**
 * 其他相对模型对象校准
 * {Group, offSet} Group 模型对象, offSet偏移量
 */
function correctOffSet(object, offSet) {
  object.position.x = object.position.x + offSet.x;
  object.position.y = object.position.y + offSet.y;
  object.position.z = object.position.z + offSet.z;
}

/** 绘制加载的STL文件
 * geometry: 几何体对象
 * name: 几何体名字
 * **/
export const drawSTL = (geometry, name) => {
  // 加载完成后会返回一个几何体对象BufferGeometry，你可以通过Mesh、Points等方式渲染该几何体
  geometry.computeBoundingBox();
  currentGeometryPoint = new Three.Geometry().fromBufferGeometry(geometry).clone();
  boundingBox = geometry.boundingBox;
  initialSight = computeSight(boundingBox);
  let material = new Three.MeshLambertMaterial({
    color: 0x36d5d5,
    side: Three.DoubleSide,
    wireframe: true,
  }); //材质对象Material
  let mesh = new Three.Mesh(geometry, material); //网格模型对象Mesh
  mesh.name = name;
  let group = new Three.Group();
  group.name = '目标模型';
  group.add(mesh);
  modalOffSet = setModelPosition(group); // 导入的模型可能坐标原点不在中心，所以需要居中显示且将偏移调整参数返回出来赋值给modalOffSet
  createSurroundBox(boundingBox); // 生成包络盒
  scene.add(group); //网格模型添加到场景中
  drawGrid(initialSight);
  drawAxis(initialSight);
  resetModel();
  const start = window.performance.now();
  iniModelTopological();
  const end = window.performance.now();
  const time = Math.round(end - start);
  const facesNum = currentGeometryPoint.faces.length; // 面片数量
  store.commit('loggingData/addData', {
    action: '模型构建拓扑结构完成，共计面片数量：' + facesNum + '，耗时：' + time + 'ms',
    date: new Date()
  })
}

/** 处理页面缩放 **/
export const handleReset = () => {
  width = window.innerWidth - leftNum;
  height = window.innerHeight - topNum;
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

/** 通过name得到相关对象
 * name: Group的name
 * **/
export const findObjectByName = (name) => {
  return scene.getObjectByName(name);
}

/** 控制group显示或隐藏
 * name: Group的name
 * **/
export const showHide = (name, val) => {
  const status = findObjectByName(name);
  if (status) {
    status.visible = val === undefined ? !status.visible : val;
    render();
  }
}

/** 动画效果绘制线 **/
export const animationDrawLine = () => {
  if (pathPoints.length) {
    let sphereGeometry = new Three.SphereGeometry(2);
    let sphereMaterial = new Three.MeshBasicMaterial({
      color: 0x7777ff
    }); //材质对象
    let sphere = new Three.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere); // 标记球体加入场景
    sphere.position.set(-10, -50, -50); // 设置标记球体初始位置
    let curvePoints = [];
    pathPoints.forEach(item => {
      item.forEach(i => {
        curvePoints.push(new Three.Vector3(i.x + modalOffSet.x, i.y + modalOffSet.y, i.z + modalOffSet.z))
      })
    })
    // 通过类CatmullRomCurve3创建一个3D样条曲线
    let curve = new Three.CatmullRomCurve3(curvePoints);
    // 样条曲线均匀分割curvePointsLen个顶点坐标
    let points = curve.getPoints(curvePoints.length * 3);
    let curvePointsLen = points.length;
    // 通过Threejs的帧动画相关API播放网格模型沿着曲线做动画运动
    // 声明一个数组用于存储时间序列
    let arr = []
    for (let i = 0; i < curvePointsLen; i++) {
      arr.push(i)
    }
    // 生成一个时间序列
    let times = new Float32Array(arr);
    let posArr = []
    points.forEach(elem => {
      posArr.push(elem.x, elem.y, elem.z)
    });
    // 创建一个和时间序列相对应的位置坐标系列
    let values = new Float32Array(posArr);
    // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
    let posTrack = new Three.KeyframeTrack('.position', times, values);
    let clip = new Three.AnimationClip("default", curvePointsLen, [posTrack]);
    let mixer = new Three.AnimationMixer(sphere); // 绑定球体与曲线轨迹
    let AnimationAction = mixer.clipAction(clip); // 实例化动画操作
    AnimationAction.timeScale = 8; // 动画播放速度
    AnimationAction.play(); // 执行动画

    let clock = new Three.Clock();//声明一个时钟对象
    const render = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
      // 更新帧动画的时间
      mixer.update(clock.getDelta());
    }
    render(); // 页面执行渲染
  } else {
    Vue.prototype.$message.info('暂无轨迹数据!');
  }
}

/** 绘制水平切片 **/
export const makeHorizontalSlice = (name, horizontalParams) => {
  const {startHeight, endHeight, thick, color} = horizontalParams;
  let groupArray = new Three.Group();
  groupArray.name = name;
  const layersNum = Math.floor((endHeight - startHeight) / thick);
  const planeWidth = Math.abs(boundingBox.max.x - boundingBox.min.x) * 1.5;
  const planeHeight = Math.abs(boundingBox.max.y - boundingBox.min.y) * 1.5;
  let layersData = [];
  for (let i = 0; i < layersNum; i++) {
    const plane = new Three.PlaneGeometry(planeWidth, planeHeight)
    const material = new Three.MeshBasicMaterial({
      color: color,
      side: Three.DoubleSide,
      opacity: 0.05,
      transparent: true,
    })
    const mesh = new Three.Mesh(plane, material)
    mesh.position.x = (boundingBox.max.x + boundingBox.min.x) / 2 + modalOffSet.x; // 添加偏移参数
    mesh.position.y = (boundingBox.max.y + boundingBox.min.y) / 2 + modalOffSet.y; // 添加偏移参数
    mesh.position.z = startHeight + i * thick;
    let group = new Three.Group();
    group.add(mesh);
    group.name = name + i;
    groupArray.add(group);
    layersData.push(startHeight + i * thick);
  }
  scene.add(groupArray);
  contourPoint = []; // 初始化轮廓点集合
  const createSliceLayer = (zArray) => {
    zArray.forEach((item, index) => {
      const groupName = name + index.toString();
      const slicePointData = getHorizontalSlicePoints(item - modalOffSet.z);
      contourPoint.push([]);
      slicePointData.map((item) => {
        item?.length && contourPoint[index].push(item);
        item?.length && drawPointByPoints(item, groupName, color);
        item?.length && drawLineByPoints(item, groupName, color);
      })
    })
  }
  createSliceLayer(layersData);
  pathPoints = []; // 切片计算完毕后需要清除上一步的轨迹数据
}

/** 根据点数组绘制点图形 **/
const drawPointByPoints = (data, groupName, color) => {
  const geometry = new Three.Geometry();//声明一个空几何体对象
  data.forEach(item => {
    geometry.vertices.push(new Three.Vector3(item.x, item.y, item.z)); //顶点坐标添加到geometry对象
  })
  const material = new Three.PointsMaterial({
    color: color,
    size: 3
  });//材质对象
  const points = new Three.Points(geometry, material);//点模型对象
  correctOffSet(points, modalOffSet); // 添加偏移修正
  findObjectByName(groupName).add(points); // 将点对象加入特定名称对象中
  render();
}

/** 根据点数组绘制包围轨迹图形 **/
const drawLineByPoints = (data, name, color) => {
  const listPoints = data.map(item => {
    return new Three.Vector3(item.x, item.y, item.z)
  });
  const geometry = new Three.BufferGeometry().setFromPoints(listPoints);
  const material = new Three.MeshBasicMaterial({ // 设置渲染颜色和渲染模式
    color: color,
    side: Three.DoubleSide,
  });
  // Create the final object to add to the scene
  const lineObject = new Three.Line(geometry, material); // 根据Points对象构建Line对象
  correctOffSet(lineObject, modalOffSet); // 添加偏移修正
  findObjectByName(name).add(lineObject);
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
  const {
    startHeight,
    radiusTop,
    radiusBottom,
    height,
    radiusSegments,
    heightSegments,
    thick,
    openEnded,
    color
  } = cylinderGeometryParameter;
  let groupArray = new Three.Group();
  groupArray.name = name;
  for (let i = 0; i < Math.floor(height / thick); i++) {
    let geometry = new Three.CylinderGeometry(radiusTop, radiusBottom + i * thick, height + i * thick, radiusSegments, heightSegments, openEnded);
    let cylinder = new Three.Mesh(geometry, new Three.MeshLambertMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: Three.DoubleSide,
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

/** 绘制圆角矩形 **/
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/** 动画效果绘制线 **/
export const drawText = (text, params, groupName) => {
  if (params === undefined) params = {};
  /* 字体 */
  const fontface = Object.prototype.hasOwnProperty.call(params, "fontface") ? params['fontface'] : 'Arial';
  /* 字体大小 */
  const fontsize = Object.prototype.hasOwnProperty.call(params, "fontsize") ? params['fontsize'] : '20';
  const borderThickness = Object.prototype.hasOwnProperty.call(params, "borderThickness") ? params["borderThickness"] : 1;
  /* 边框颜色 */
  const borderColor = Object.prototype.hasOwnProperty.call(params, "borderColor") ? params["borderColor"] : {
    r: 0,
    g: 0,
    b: 0,
    a: 1.0
  };
  /* 背景颜色 */
  const backgroundColor = Object.prototype.hasOwnProperty.call(params, "backgroundColor") ? params["backgroundColor"] : {
    r: 255,
    g: 255,
    b: 255,
    a: 1.0
  };
  /* 绘制位置 */
  const position = Object.prototype.hasOwnProperty.call(params, 'position') ? params['position'] : {x: 0, y: 0, z: 0};
  /* 缩放比例 */
  const XScale = Object.prototype.hasOwnProperty.call(params, 'XScale') ? params['XScale'] : 1;
  const YScale = Object.prototype.hasOwnProperty.call(params, 'YScale') ? params['YScale'] : 1;
  /* 创建画布 */
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  /* 字体加粗 */
  context.font = "Bold " + fontsize + "px " + fontface;
  /* 获取文字的大小数据，高度取决于文字的大小 */
  const metrics = context.measureText(text);
  const textWidth = metrics.width;
  /* 背景颜色 */
  context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
    + backgroundColor.b + "," + backgroundColor.a + ")";
  /* 边框的颜色 */
  context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
    + borderColor.b + "," + borderColor.a + ")";
  context.lineWidth = borderThickness;
  /* 绘制圆角矩形 */
  roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
  /* 字体颜色 */
  context.fillStyle = "rgba(255, 255, 255, 1)";
  context.fillText(text, borderThickness, fontsize + borderThickness);
  /* 画布内容用于纹理贴图 */
  const texture = new Three.Texture(canvas);
  texture.needsUpdate = true;
  const spriteMaterial = new Three.SpriteMaterial({map: texture});
  const sprite = new Three.Sprite(spriteMaterial);
  sprite.scale.set(XScale, YScale, 0);
  sprite.center = new Three.Vector2(0, 0);
  sprite.position.set(position.x, position.y, position.z);
  findObjectByName(groupName).add(sprite);
}

/** 解决float精度计算丢失 **/
Math.formatFloat = (f, digit) => {
  const m = Math.pow(10, digit);
  return Math.round(f * m) / m;
}

/** 计算两点线段间与平面交点 **/
function unitCal(p1, p2, zHeight) {
  const k = (zHeight - p1.z) / (zHeight - p2.z);
  return {x: (p1.x - k * p2.x) / (1 - k), y: (p1.y - k * p2.y) / (1 - k), z: zHeight};
}

/** 初始化模型三角面片几何拓扑关系 **/
function iniModelTopological() {
  let Faces = currentGeometryPoint.faces;
  let Vertices = currentGeometryPoint.vertices;
  const {resetData} = require('./algorithmFunction');
  topologicalData = resetData(Faces, Vertices);
}

/** 计算出水平切片点集 **/
function getHorizontalSlicePoints(zHeight) {
  const {resEdge, resFaces, resPoints} = topologicalData; // 获取拓扑重构后的点、边、面数据
  let resultPointData = []; // 初始化轮廓点信息数组
  let startFaceIndex; // 声明初始遍历面片索引
  do {
    // 搜寻满足高度要求并未被搜寻面片
    startFaceIndex = resFaces.findIndex(item => (item.zMin <= zHeight && zHeight < item.zMax) && (item.zMin < zHeight && zHeight <= item.zMax) && !item.hasSearch); // 任意获得一个符合条件的三角面片
    if (startFaceIndex >= 0) { // 存在满足要求的面片
      resultPointData.push([]); // 初始化首个联通区域数组
      let currentResIndex = resultPointData.length - 1; // 记录当前联通区域在结果数组中对应的索引值
      let childStartFaceIndex = startFaceIndex; // 子轮廓区域初始遍历面片
      let lastEdgeHash = null; // 初始化上一轮遍历最后边的哈希值
      do {
        let finalEdgeHash = null; // 初始化当前遍历最后边的哈希值
        resFaces[childStartFaceIndex].hasSearch = true; // 将当前面片被遍历状态置为true
        // 遍历当前面片三边，计算三边与当前高度zHeight的空间关系
        resFaces[childStartFaceIndex].includeEdge.map(edgeHash => {
          let pointA = resPoints.get(resEdge.get(edgeHash).includePoints[0]).vPoint;
          let pointB = resPoints.get(resEdge.get(edgeHash).includePoints[1]).vPoint;
          const p1z = Math.formatFloat(pointA.z, 5);
          const p2z = Math.formatFloat(pointB.z, 5);
          if (p1z === zHeight && p2z !== zHeight) { // zHeight切平面经过边的左端点
            if (lastEdgeHash === null || lastEdgeHash !== edgeHash) {
              finalEdgeHash = edgeHash; // 将当前处理边哈希值赋值给finalEdgeHash
              resultPointData[currentResIndex].push(pointA); // 将交点存入当前子轮廓点集数组中
            }
          } else if (p1z !== zHeight && p2z === zHeight) { // zHeight切平面经过边的右端点
            if (lastEdgeHash === null || lastEdgeHash !== edgeHash) {
              finalEdgeHash = edgeHash;
              resultPointData[currentResIndex].push(pointB);
            }
            // zHeight切平面经过边内部
          } else if ((p1z > zHeight && p2z < zHeight) || (p1z < zHeight && p2z > zHeight)) {
            if (lastEdgeHash === null || lastEdgeHash !== edgeHash) {
              finalEdgeHash = edgeHash;
              resultPointData[currentResIndex].push(unitCal(pointA, pointB, zHeight));
            }
          }
        })
        lastEdgeHash = finalEdgeHash; // 将当前最后处理的边赋值给lastEdgeHash，作为下一轮中的上一轮遍历的最后边哈希值
        // 寻找下一个邻接面索引
        childStartFaceIndex = resEdge.get(finalEdgeHash).includeFaces.filter(item => !resFaces[item].hasSearch)[0];
      } while (childStartFaceIndex !== undefined) // 未找到满足条件的面片则结束当前子轮廓计算
    }
  } while (startFaceIndex !== -1) // 未找到满足条件的面片则结束切片轮廓处理
  // 得到轮廓结果后，重置面片被搜索状态
  resFaces.forEach(item => {
    item.hasSearch = false;
  })
  return resultPointData;
}

/** 构建轮廓边相关信息 **/
function buildContourInfo(data) {
  let distinguishMatrix = new Array(data.length); // 初始化内外轮廓判别矩阵
  let contourInfo = []; // 轮廓信息
  let edgeInfo = []; // 轮廓边信息
  let removeIndex = []; // 合并轮廓后需要被移除的轮廓索引
  // 将每个轮廓区域范围计算出来以及轮廓边信息规范化
  data.forEach(item => {
    edgeInfo = []; // 轮廓边信息初始化
    let tempXMin = Infinity, tempXMax = -Infinity, tempYMin = Infinity, tempYMax = -Infinity; // 每个轮廓区域边界
    for (let i = 0; i < item.length - 1; i++) {
      let sortX = [item[i].x, item[i + 1].x].sort((a, b) => a - b);
      let sortY = [item[i].y, item[i + 1].y].sort((a, b) => a - b);
      tempXMin = sortX[0] <= tempXMin ? sortX[0] : tempXMin;
      tempXMax = sortX[1] >= tempXMax ? sortX[1] : tempXMax;
      tempYMin = sortY[0] <= tempYMin ? sortY[0] : tempYMin;
      tempYMax = sortY[1] >= tempYMax ? sortY[1] : tempYMax;
      edgeInfo.push({
        startPoint: item[i],
        endPoint: item[i + 1],
        xMin: Math.formatFloat(sortX[0], 5),
        xMax: Math.formatFloat(sortX[1], 5),
        yMin: Math.formatFloat(sortY[0], 5),
        yMax: Math.formatFloat(sortY[1], 5),
      })
    }
    contourInfo.push({
      xMin: tempXMin,
      xMax: tempXMax,
      yMin: tempYMin,
      yMax: tempYMax,
      edgeInfo: edgeInfo,
    })
  })
  // 计算判别矩阵
  for (let i = 0; i < contourInfo.length; i++) {
    distinguishMatrix[i] = []; // 初始化判别数组
    for (let j = 0; j < contourInfo.length; j++) {
      // 判断非自身轮廓且包含自身轮廓的数据，存入判别数组
      if (j !== i && contourInfo[i].xMin >= contourInfo[j].xMin && contourInfo[i].xMax <= contourInfo[j].xMax && contourInfo[i].yMin >= contourInfo[j].yMin && contourInfo[i].yMax <= contourInfo[j].yMax) {
        distinguishMatrix[i].push({
          index: j,
          xMin: contourInfo[j].xMin,
        })
      }
    }
  }
  // 对判别数组进行遍历，如果被包含轮廓数量为偶数则为外轮廓无需处理，如果为奇数则寻找最接近的父轮廓进行合并
  distinguishMatrix.forEach((item, index) => {
    // 为奇数则寻找最近的父轮廓
    if (!oddEven(item.length)) {
      item.sort((a, b) => b.xMin - a.xMin); // 将最接近的轮廓排序到最前面
      let fatherIndex = item[0].index;
      // 合并轮廓
      Object.assign(contourInfo[fatherIndex], {
        edgeInfo: contourInfo[index].edgeInfo.concat(contourInfo[fatherIndex].edgeInfo),
      })
      // 存储需要被移除的轮廓索引
      removeIndex.push(index)
    }
  })
  removeIndex.sort((a, b) => b - a); // 从大到小移除数据而不是从小到大，这样位置就会被改变
  removeIndex.forEach(item => {
    contourInfo.splice(item, 1);
  })
  return contourInfo;
}

/** 判断数据为奇偶true为偶数，false为奇数 **/
function oddEven(num) {
  return num % 2 === 0;
}

/** 计算xy坐标轴下交点 **/
function unitCalXY(p1, p2, yHeight) {
  if (p1.x === p2.x) {
    return {x: p1.x, y: yHeight, z: p1.z}
  } else {
    return {x: (yHeight - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x, y: yHeight, z: p1.z};
  }
}

/** 生成轨迹路径 **/
export const createdPath = ({pathDensity: density, color}) => {
  if (!contourPoint.length) {
    Vue.prototype.$message.info('暂无切片数据!');
  } else {
    pathPoints = []; // 重置轨迹数据
    contourPoint.forEach(item => {
      let currentContourInfo = buildContourInfo(item); // 获取轮廓线数据
      currentContourInfo.forEach(contourItem => {
        let startY = contourItem.yMax; // 扫描线初始高度
        let endY = contourItem.yMin; // 扫描线截止高度
        for (let yHeight = startY; yHeight >= endY; yHeight = yHeight - density) {
          let intersectData = contourItem.edgeInfo.filter(item => item.yMin <= yHeight && yHeight <= item.yMax); // 与当前扫描线相交线段数据
          let intersectPoints = []; // 交点个数
          for (let i = 0; i < intersectData.length;) {
            // 交点分为三种情况，在边最高点则存入1个，在两边顶上则存入0个，在边最低点则存入2个
            if (intersectData[i].yMin < yHeight && yHeight < intersectData[i].yMax) {
              intersectPoints.push(unitCalXY(intersectData[i].startPoint, intersectData[i].endPoint, yHeight));
              i++;
            } else if (i < intersectData.length - 1 && intersectData[i].yMin === intersectData[i + 1].yMin && yHeight === intersectData[i].yMin) {
              let intersectionPoint = intersectData[i].startPoint.y - intersectData[i].endPoint.y ? intersectData[i].endPoint : intersectData[i].startPoint;
              intersectPoints.push(intersectionPoint);
              intersectPoints.push(intersectionPoint);
              i += 2;
            } else {
              i += 2;
            }
          }
          intersectPoints.sort((a, b) => a.x - b.x); // 按照x坐标排序
          // 按照A-B、C-D、E-F格式连接
          for (let i = 0; i < intersectPoints.length; i += 2) {
            pathPoints.push([intersectPoints[i], intersectPoints[i + 1]])
          }
        }
      })
    })
    drawPathLineByPoints(pathPoints, '切片轨迹', color);
  }
}

/** 根据点数组绘制轨迹规划路径 **/
function drawPathLineByPoints(data, name, color) {
  let group = new Three.Group();
  group.name = name;
  for (let i = 0; i < data.length; i++) {
    const geometry = new Three.BufferGeometry().setFromPoints([
      new Three.Vector3(data[i][0].x, data[i][0].y, data[i][0].z),
      new Three.Vector3(data[i][1].x, data[i][1].y, data[i][1].z)
    ]);
    const material = new Three.MeshBasicMaterial({
      color: color,
      side: Three.DoubleSide,
    });
    const lineObject = new Three.Line(geometry, material);
    group.add(lineObject);
  }
  correctOffSet(group, modalOffSet); // 添加偏移修正
  scene.add(group);
  render();
}

/**
 * 生成G代码
 * **/
export const splicingGCode = () => {
  return new Promise((resolve, reject) => {
    let startPart = 'G21;\nG90;\nM104 S205;\nG28;\nG1 Z5 F5000 E1;\nM109 S205;\nG92 E0;\nM82;\n'; // 头部G代码
    let endPart = 'G92 E0;\nM104 S0;\nM140 S0;\nG28 X0 Y0 Z0;\nM84;'; // 尾部G代码
    if (!pathPoints.length) {
      reject('暂无轨迹数据');
    } else {
      let operationPart = ''; // 执行G代码
      let E = 1; // 送丝长度
      pathPoints.forEach((item, index) => {
        if(index) {
          operationPart += 'G0 X' + item[0].x.toFixed(4) + ' Y' + item[0].y.toFixed(4) + ' Z' + item[0].z.toFixed(4) + ';\n';
          operationPart += 'G1 X' + item[1].x.toFixed(4) + ' Y' + item[1].y.toFixed(4) + ' Z' + item[1].z.toFixed(4) + ' E' + E++ + ';\n';
        }else {
          operationPart += 'G0 X' + item[0].x.toFixed(4) + ' Y' + item[0].y.toFixed(4) + ' Z' + item[0].z.toFixed(4) + ' F7800.00;\n';
          operationPart += 'G1 X' + item[1].x.toFixed(4) + ' Y' + item[1].y.toFixed(4) + ' Z' + item[1].z.toFixed(4) + ' E' + E++ + ' F1080.00;\n';
        }
      })
      resolve(startPart + operationPart + endPart);
    }
  })
}

/** 绘制加载的PCD文件
 * points: pcd文件点
 * name: 几何体名字
 * **/
export const drawPCD = (points, name) => {
  // 加载完成后会返回一个几何体对象BufferGeometry，你可以通过Mesh、Points等方式渲染该几何体
  points.geometry.computeBoundingBox();
  boundingBox = points.geometry.boundingBox;
  initialSight = computeSight(boundingBox);
  points.material.size = 0.5;
  points.material.color = new Three.Color(0xffffff);
  let group = new Three.Group();
  group.add(points);
  group.name = name;
  modalOffSet = setModelPosition(group); // 导入的模型可能坐标原点不在中心，所以需要居中显示且将偏移调整参数返回出来赋值给modalOffSet
  createSurroundBox(boundingBox); // 生成包络盒
  scene.add(group); //网格模型添加到场景中
  drawGrid(initialSight);
  drawAxis(initialSight);
  resetModel();
}

