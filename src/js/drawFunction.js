import * as Three from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

const leftNum = 40; // 页面左侧菜单栏宽度
const topNum = 29; // 页面顶部菜单栏高度
let boundingBox = {}; // 包络盒信息
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

let testAnimationData = []; // 动画轨迹测试数据
let currentBuffGeometryPoint = []; // 当前模型点云数据
let currentGeometryPoint = []; // 当前模型三角面片数据

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
  group.add(helper, ballMesh);
  group.name = '包络盒';
  group.visible = false;
  scene.add(group);
  drawText('这是包络盒', {
    fontsize: 30,
    borderColor: {r: 0, g: 0, b: 0, a: 1},
    backgroundColor: {r: 0, g: 0, b: 0, a: 1},
    position: {x: 10, y: -5, z: 0}
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

/** 绘制加载的STL文件
 * geometry: 几何体对象
 * name: 几何体名字
 * **/
export const drawSTL = (geometry, name) => {
  // 加载完成后会返回一个几何体对象BufferGeometry，你可以通过Mesh、Points等方式渲染该几何体
  geometry.computeBoundingBox();
  currentGeometryPoint = new Three.Geometry().fromBufferGeometry(geometry).clone();
  currentBuffGeometryPoint = geometry.attributes.position.array;
  boundingBox = geometry.boundingBox;
  createSurroundBox(boundingBox);
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
  scene.add(group); //网格模型添加到场景中
  drawGrid(initialSight);
  drawAxis(initialSight);
  resetModel();
  iniModelTopological();
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
  let curve = new Three.CatmullRomCurve3(testAnimationData, false/*是否闭合*/);

  let tubeGeometry = new Three.TubeGeometry(curve, 100, 1, 100, false);
  let tubeMaterial = new Three.MeshBasicMaterial({color: 0xbbff00, wireframe: false})
  let tube = new Three.Mesh(tubeGeometry, tubeMaterial);
  scene.add(tube);

  let box = new Three.SphereGeometry(1, 20, 20);
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
  AnimationAction.timeScale = 3; // 调节播放速度
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
      opacity: 0.2,
      transparent: true,
    })
    const mesh = new Three.Mesh(plane, material)
    mesh.position.x = (boundingBox.max.x + boundingBox.min.x) / 2;
    mesh.position.y = (boundingBox.max.y + boundingBox.min.y) / 2;
    mesh.position.z = startHeight + i * thick;
    let group = new Three.Group();
    group.add(mesh)
    group.name = name + i;
    groupArray.add(group);
    layersData.push(startHeight + i * thick);
  }
  scene.add(groupArray);
  const createSliceLayer = (data) => {
    data.forEach((item, index) => {
      const groupName = name + index.toString();
      const slicePointData = calculateHorizontalSlice(item);
      slicePointData.length && drawPointByPoints(slicePointData, groupName, color);
      // slicePointData.length && drawLineByPoints(slicePointData, groupName, color);
    })
  }
  createSliceLayer(layersData);
}

/** 根据点数组绘制点图形 **/
const drawPointByPoints = (data, groupName, color) => {
  const geometry = new Three.Geometry();//声明一个空几何体对象
  data.forEach(item => {
    geometry.vertices.push(new Three.Vector3(item.x, item.y, item.z)); //顶点坐标添加到geometry对象
  })
  const material = new Three.PointsMaterial({
    color: color,
    size: 6
  });//材质对象
  const points = new Three.Points(geometry, material);//点模型对象
  findObjectByName(groupName).add(points);
  render();
}

/** 根据点数组绘制包围轨迹图形 **/
// eslint-disable-next-line no-unused-vars
const drawLineByPoints = (data, name, color) => {
  // 将坐标点逆时针排序
  data.sort((a, b) => {
    return Math.atan2(a.x, a.y) - Math.atan2(b.x, b.y);
  })
  const listPoints = data.map(item => {
    return new Three.Vector3(item.x, item.y, item.z)
  });
  listPoints.push(data[0]);
  const geometry = new Three.BufferGeometry().setFromPoints(listPoints);
  const material = new Three.MeshBasicMaterial({
    color: color,
    side: Three.DoubleSide,
  });
  // Create the final object to add to the scene
  const lineObject = new Three.Line(geometry, material);
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
  const borderThickness = Object.prototype.hasOwnProperty.call(params, "borderThickness") ? params["borderThickness"] : 4;
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
  /* 缩放比例 */
  const XScale = Math.abs(Math.floor((boundingBox.max.x - boundingBox.min.x)));
  const YScale = -Math.abs(Math.floor((boundingBox.max.y - boundingBox.min.y) * 0.5));
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

/** 计算水平切片轨迹 **/
const calculateHorizontalSlice = (zHeight) => {
  let resultData = [];
  // 每三个点为一个单元计算
  const unitCal = (p1, p2) => {
    const arrayToObject = (pointArray) => {
      return {
        x: Math.formatFloat(pointArray[0], 5),
        y: Math.formatFloat(pointArray[1], 5),
        z: Math.formatFloat(pointArray[2], 5),
      }
    }
    const p1z = Math.formatFloat(p1[2], 5);
    const p2z = Math.formatFloat(p2[2], 5);
    if ((p1z > zHeight && p2z > zHeight) || (p1z < zHeight && p2z < zHeight)) {
      return [];
    } else if (p1z === zHeight && p2z === zHeight) {
      return [arrayToObject(p1), arrayToObject(p2)];
    } else if (p1z === zHeight && p2z !== zHeight) {
      return [arrayToObject(p1)];
    } else if (p1z !== zHeight && p2z === zHeight) {
      return [arrayToObject(p2)];
    } else {
      const k = (zHeight - p1[2]) / (zHeight - p2[2]);
      let res = new Array(3);
      res[0] = (p1[0] - k * p2[0]) / (1 - k);
      res[1] = (p1[1] - k * p2[1]) / (1 - k);
      res[2] = zHeight;
      return [arrayToObject(res)];
    }
  }

  for (let i = 0; i < currentBuffGeometryPoint.length; i += 9) {
    resultData = resultData.concat(unitCal(currentBuffGeometryPoint.slice(i, i + 3), currentBuffGeometryPoint.slice(i + 3, i + 6)));
    resultData = resultData.concat(unitCal(currentBuffGeometryPoint.slice(i + 3, i + 6), currentBuffGeometryPoint.slice(i + 6, i + 9)));
    resultData = resultData.concat(unitCal(currentBuffGeometryPoint.slice(i, i + 3), currentBuffGeometryPoint.slice(i + 6, i + 9)));
  }
  // 数组去重
  const unique = (arr) => {
    let obj = {};
    return arr.reduce((item, next) => {
      obj[next.x.toString() + next.y.toString()] ? '' : obj[next.x.toString() + next.y.toString()] = item.push(next);
      return item;
    }, []);
  }
  return unique(resultData);
}

/** 判断Vertices数据是否相等 **/
function compareVertices(V1, V2) {
  return JSON.stringify(V1) === JSON.stringify(V2);
}

/** 初始化模型三角面片几何拓扑关系 **/
function iniModelTopological() {
  let Faces = currentGeometryPoint.faces;
  let Vertices = currentGeometryPoint.vertices;
  // 寻找临接三角面片
  const findNeighborIndex = (currentIndex, line) => {
    // 寻找临接Face,如果三角面片包含该线段则返回true，否则返回false
    const lineInFace = (face, line) => {
      let index = 0;
      line.map(item => {
        if (compareVertices(Vertices[face.a], item) || compareVertices(Vertices[face.b], item) || compareVertices(Vertices[face.c], item)) {
          index++;
        }
      })
      return index === 2;
    }
    // 遍历三角面片如果含有该线段的非当前三角面片则为临接面片，并且返回索引值
    for (let i = 0; i < Faces.length; i++) {
      if (i !== currentIndex && lineInFace(Faces[i], line)) {
        return i;
      }
    }
    return false;
  }
  // 求临接三角面片并存入Faces中
  Faces.map((item, index) => {
    let line0 = [Vertices[item.a], Vertices[item.b]];
    let line1 = [Vertices[item.b], Vertices[item.c]];
    let line2 = [Vertices[item.c], Vertices[item.a]];
    Object.assign(Faces[index], {
      neighborIndex: [findNeighborIndex(index, line0), findNeighborIndex(index, line1), findNeighborIndex(index, line2)]
    })
  })
  console.log(Faces);
}
