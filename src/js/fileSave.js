const exportSTL = require('threejs-export-stl');
const {saveAs} = require('file-saver');

const saveAsSTL = (geometry, fileName) => {
  const buffer = exportSTL.fromGeometry(geometry);
  const blob = new Blob([buffer], { type: exportSTL.mimeType });
  saveAs(blob, fileName + '.stl');
}

module.exports = {
  saveAsSTL,
}