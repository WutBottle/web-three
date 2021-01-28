<style lang="scss">
  .WorkerPage {
    text-align: center;
    padding: 100px;
  }
</style>

<template>
  <div class="WorkerPage">
    <a-upload
      name="file"
      :multiple="false"
      :action="baseUrl.workerController + '/upload'"
      v-decorator="['modelData', {
            valuePropName: 'fileList',
            getValueFromEvent: normModelFile,
            rules: [{ required: true, message: '请上传模型文件!' }]
            }]"
    >
      <a-button>
        <a-icon type="upload"/>
        上传文件
      </a-button>
    </a-upload>
    <a-button type="primary" style="margin-top: 40px" @click="downloadFile">
      下载文件
    </a-button>
  </div>
</template>

<script>
import baseUrl from '@api/baseUrl'; // 导入接口域名列表
import {workerFileVerify} from '@js/fileTypeVerification'; // 引入图片文件校验

export default {
  name: "WorkerPage",
  data() {
    return {
      baseUrl,
      workerFileVerify,
      fileName: '',
    }
  },
  methods: {
    // 上传模型文件处理
    normModelFile(info) {
      let fileList = [...info.fileList];
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      const fileNameArray = info.file.name.split('.');
      if (this.workerFileVerify(fileNameArray[fileNameArray.length - 1])) {
        fileList = fileList.slice(-1); // 出队列
        Object.assign(info, {fileList});
      } else {
        this.$message.error('请上传xls或xlsx格式的文件');
        return [];
      }
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.fileName = info.file.response.name;
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
      return info && info.fileList;
    },
    downloadFile() {
      window.open(baseUrl.workerController + '/download', '_blank');
    }
  }
}
</script>

