const {saveAs} = require('file-saver');
const Three = require('three');
const {findObjectByName} = require('./drawFunction');
const {STLExporter} = require('three/examples/jsm/exporters/STLExporter');

const saveAsSTL = (nameArray, fileName) => {
  const scene = new Three.Scene();
  nameArray.forEach(item => {
    scene.add(findObjectByName(item).clone());
  })
  const exporter = new STLExporter();
  const blob = new Blob([exporter.parse(scene)], {type: 'text/plain'});
  saveAs(blob, fileName + '.stl');
}

module.exports = {
  saveAsSTL,
}