const imgType = ['png', 'jpg', 'jpeg'];
const modelType = ['stl'];

const imgFileVerify = (imgSuffix) => {
  return imgType.includes(imgSuffix.toLowerCase())
}

const modelFileVerify = (modelSuffix) => {
  return modelType.includes(modelSuffix.toLowerCase())
}

module.exports = {
  imgFileVerify,
  modelFileVerify,
}