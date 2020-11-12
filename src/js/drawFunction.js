import * as Three from 'three';

// 移除场景中物体
export const removeObject = (scene, name) => {
  scene.remove(scene.getObjectByName(name));
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
export const makeCone = (scene, name, cylinderGeometryParameter) => {
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
    group.rotateX(Math.PI/2)
    group.position.x = 0;
    group.position.y = 0;
    group.position.z = startHeight + height / 2 + i * thick / 2;
    groupArray.add(group);
  }
  scene.add(groupArray);
}

/** 执行渲染 **/
export const render = (scene, camera, renderer) => {
  renderer.render(scene, camera);//执行渲染操作
}
