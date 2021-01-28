const imgType = ['png', 'jpg', 'jpeg'];
const modelType = ['stl'];
const workerType = ['xls', 'xlsx'];

const imgFileVerify = (imgSuffix) => {
  return imgType.includes(imgSuffix.toLowerCase())
}

const modelFileVerify = (modelSuffix) => {
  return modelType.includes(modelSuffix.toLowerCase())
}

const workerFileVerify = (modelSuffix) => {
  return workerType.includes(modelSuffix.toLowerCase())
}

module.exports = {
  imgFileVerify,
  modelFileVerify,
  workerFileVerify,
}