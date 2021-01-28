/** 基于几何拓扑信息切片算法 **/

// 点索引hash函数
function pointHash(point, len) {
  return (Math.abs(point.x) * Math.pow(10, 4) / 23 + Math.abs(point.y) * Math.pow(10, 4) / 19 + Math.abs(point.z) * Math.pow(10, 4) / 17) % len;
}

// 边索引hash函数
function edgeHash(pointIndex1, pointIndex2, len) {
  return (pointIndex1 + pointIndex2) % len;
}

// 求两点之间距离
function distancePoint3(A, B) {
  return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2) + Math.pow(A.z - B.z, 2))
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

    if (distancePoint3(pointA, pointB) < Math.pow(10, -6)) {
      resPoints.set(pHashA, {
        vPoint: pointA, // 点坐标
        vPointIndex: pHashA, // 点索引
      });
      if (distancePoint3(pointA, pointC) >= Math.pow(10, -6)) {
        resPoints.set(pHashC, {
          vPoint: pointC,
          vPointIndex: pHashC,
        });
        resEdge.set(eHashCA, {
          includePoints: [pHashC, pHashA], // 包含的点索引
          includeEdge: eHashCA, // 边索引
        });
      }
    } else {
      resPoints.set(pHashA, {
        vPoint: pointA, // 点坐标
        vPointIndex: pHashA, // 点索引
      });
      resPoints.set(pHashB, {
        vPoint: pointB, // 点坐标
        vPointIndex: pHashB, // 点索引
      });
      let dataEAB = resEdge.get(eHashAB);
      !dataEAB && resEdge.set(eHashAB, {
        includePoints: [pHashA, pHashB], // 包含的点索引
        includeEdge: eHashAB, // 边索引
      });
      if (distancePoint3(pointB, pointC) >= Math.pow(10, -6) && distancePoint3(pointA, pointC) >= Math.pow(10, -6)) {
        resPoints.set(pHashC, {
          vPoint: pointC,
          vPointIndex: pHashC,
        });
        resFaces.push({
          includePoints: [pHashA, pHashB, pHashC],
          includeEdge: [eHashAB, eHashBC, eHashCA],
        })
        let currentFaceIndex = resFaces.length - 1;
        dataEAB?.includeFaces.push(currentFaceIndex);
        resEdge.set(eHashAB, dataEAB);
        resEdge.set(eHashBC, {
          includePoints: [pHashB, pHashC], // 包含的点索引
          includeEdge: eHashBC, // 边索引
          includeFaces: [currentFaceIndex], // 面索引
        });
        resEdge.set(eHashCA, {
          includePoints: [pHashC, pHashA], // 包含的点索引
          includeEdge: eHashCA, // 边索引
          includeFaces: [currentFaceIndex], // 面索引
        });

      }
    }
  })
}

module.exports = {
  resetData,
}