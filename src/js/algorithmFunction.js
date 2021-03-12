/** 基于几何拓扑信息切片算法 **/

// 点索引hash函数
function pointHash(point, len) {
  return (point.x * Math.pow(10, 4) / 21 + point.y * Math.pow(10, 4) / 19 + point.z * Math.pow(10, 4) / 17) % len;
}

// 边索引hash函数
function edgeHash(pointIndex1, pointIndex2, len) {
  return (pointIndex1 + pointIndex2) % len;
}

/** 重建拓扑结构 **/
function resetData(facesData, verticesData) {
  let len = verticesData.length; // mod求余参数
  let resPoints = new Map();
  let resEdge = new Map();
  let resFaces = [];
  facesData.map(item => {
    let pointA = verticesData[item.a];
    let pointB = verticesData[item.b];
    let pointC = verticesData[item.c];
    let pHashA = pointHash(pointA, len);
    let pHashB = pointHash(pointB, len);
    let pHashC = pointHash(pointC, len);
    let eHashAB = edgeHash(pHashA, pHashB, len); // 计算边的hash值
    let eHashBC = edgeHash(pHashB, pHashC, len); // 计算边的hash值
    let eHashCA = edgeHash(pHashA, pHashC, len); // 计算边的hash值

    resPoints.set(pHashA, {
      vPoint: pointA, // 点坐标
      vPointIndex: pHashA, // 点索引
    });
    resPoints.set(pHashB, {
      vPoint: pointB, // 点坐标
      vPointIndex: pHashB, // 点索引
    });
    resPoints.set(pHashC, {
      vPoint: pointC, // 点坐标
      vPointIndex: pHashC, // 点索引
    });

    let faceZHeightArray = [verticesData[item.a].z, verticesData[item.b].z, verticesData[item.c].z].sort((a, b) => a - b);
    if (Math.abs(faceZHeightArray[0] - faceZHeightArray[2]) > Math.pow(10, -5)) {
      resFaces.push({
        includePoints: [pHashA, pHashB, pHashC], // 点索引
        includeEdge: [eHashAB, eHashBC, eHashCA],// 边索引
        zMax: faceZHeightArray[2], // 面片Z轴最大高度
        zMin: faceZHeightArray[0], // 面片Z轴最小高度
        hasSearch: false, // 是否已经被搜索
      })
      let currentFaceIndex = resFaces.length - 1;
      let edgeABHash = resEdge.get(eHashAB);
      let edgeBCHash = resEdge.get(eHashBC);
      let edgeCAHash = resEdge.get(eHashCA);
      // 根据边哈希值返回每条边相邻的两个面片
      const returnNewFaces = (edgeABHash) => {
        let res = [currentFaceIndex];
        if (edgeABHash) {
          res = edgeABHash.includeFaces;
          res.push(currentFaceIndex);
        }
        return res;
      }
      resEdge.set(eHashAB, {
        includePoints: [pHashA, pHashB], // 包含的点索引
        includeEdge: eHashAB, // 边索引
        includeFaces: returnNewFaces(edgeABHash), // 每条边包含的相邻两个面片
      });
      resEdge.set(eHashBC, {
        includePoints: [pHashB, pHashC], // 包含的点索引
        includeEdge: eHashBC, // 边索引
        includeFaces: returnNewFaces(edgeBCHash),
      });
      resEdge.set(eHashCA, {
        includePoints: [pHashC, pHashA], // 包含的点索引
        includeEdge: eHashCA, // 边索引
        includeFaces: returnNewFaces(edgeCAHash),
      });
    }
  })
  return {
    resPoints,
    resEdge,
    resFaces,
  }
}

module.exports = {
  resetData,
}