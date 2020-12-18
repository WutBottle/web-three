<style lang="scss">
.MyModel {
  padding: 20px;

  .line-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .owner-display {
    display: inline-block;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    font-weight: bold;
    background-color: #2bace7;
    color: #fff;
    border-radius: 50%;
  }
}
</style>

<template>
  <div class="MyModel">
    <a-card title="我的模型库">
      <a-button slot="extra" type="primary" icon="upload" @click="() => this.uploadVisible = true">
        上传模型
      </a-button>
      <a-empty v-if="!modelList.length" description="暂无数据"/>
      <a-row v-else :gutter="[16, 16]">
        <template v-for="(item, index) in modelList">
          <a-col :span="6" :key="index">
            <a-card hoverable>
              <div
                slot="cover"
                style="height: 200px;"
              >
                <img
                  style="width: 100%;height:100%;object-fit: contain"
                  :alt="item.modelImgName"
                  :src="item.modelImgName"
                />
              </div>
              <template slot="actions" class="ant-card-actions">
                <a-button type="primary" @click="chooseModel(item)">
                  选择
                </a-button>
                <a-button v-if="item.isOwned" @click="showUpdateModal(item)">
                  修改
                </a-button>
                <a-popconfirm
                  title="确定删除该模型？"
                  ok-text="确定"
                  cancel-text="取消"
                  v-if="item.isOwned"
                  @confirm="handleDeleteModel(item)"
                >
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a-button type="danger">
                    删除
                  </a-button>
                </a-popconfirm>
                <a-popconfirm
                  title="确定移除该模型？"
                  ok-text="确定"
                  cancel-text="取消"
                  v-else
                  @confirm="handleRemoveModel(item)"
                >
                  <a-icon slot="icon" type="question-circle-o" style="color: red"/>
                  <a-button type="danger">
                    移除
                  </a-button>
                </a-popconfirm>
              </template>
              <a-card-meta>
                <a-tooltip slot="avatar" placement="top">
                  <template slot="title">
                    <span>{{ item.ownerName }}</span>
                  </template>
                  <div class="owner-display">
                    {{ item.ownerNick.charAt(item.ownerNick.length-1) }}
                  </div>
                </a-tooltip>
                <a-tooltip slot="title" placement="top">
                  <template slot="title">
                    <span>{{ item.modelTitle }}</span>
                  </template>
                  <div class="line-ellipsis">
                    <a-tag v-if="item.isPublic" color="green">
                      公开
                    </a-tag>
                    <a-tag v-else color="red">
                      私有
                    </a-tag>
                    {{ item.modelTitle }}
                  </div>
                </a-tooltip>
                <a-tooltip slot="description" placement="top">
                  <template slot="title">
                    <span>{{ item.modelDesc }}</span>
                  </template>
                  <div class="line-ellipsis">{{ item.modelDesc }}</div>
                </a-tooltip>
              </a-card-meta>
            </a-card>
          </a-col>
        </template>
      </a-row>
    </a-card>
    <a-modal v-model="uploadVisible" title="上传模型" okText="确认" cancelText="取消" @ok="handleUpload('add')">
      <a-form :form="uploadForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="模型名称">
          <a-input
            placeholder="请输入模型名称"
            v-decorator="['modelTitle', { rules: [{ required: true, message: '请输入模型名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="模型描述">
          <a-textarea
            placeholder="请输入模型描述"
            :rows="3"
            v-decorator="['modelDesc', { rules: [{ required: true, message: '请输入模型名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="设置权限">
          <a-switch
            checked-children="公开"
            un-checked-children="私有"
            v-decorator="['isPublic', { initialValue: true, valuePropName: 'checked', rules: [{ required: true, message: '请选择模型权限!' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="上传图片"
          :required="true"
        >
          <a-upload
            name="file"
            :multiple="false"
            :action="baseUrl.serverBaseController + 'model/upload'"
            :headers="headers"
            v-decorator="['modelImg', {
            valuePropName: 'fileList',
            getValueFromEvent: normModelImgFile,
            rules: [{ required: true, message: '请上传模型图片!' }]
            }]"
          >
            <a-button>
              <a-icon type="upload"/>
              上传图片
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="上传模型"
          :required="true"
        >
          <a-upload
            name="file"
            :multiple="false"
            :action="baseUrl.serverBaseController + 'model/upload'"
            :headers="headers"
            v-decorator="['modelData', {
            valuePropName: 'fileList',
            getValueFromEvent: normModelFile,
            rules: [{ required: true, message: '请上传模型文件!' }]
            }]"
          >
            <a-button>
              <a-icon type="upload"/>
              上传模型
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model="updateVisible" title="上传模型" okText="确认" cancelText="取消" @ok="handleUpload('update')"
             :afterClose="() => this.clearModalData('updateForm')">
      <a-form :form="updateForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="模型名称">
          <a-input
            placeholder="请输入模型名称"
            v-decorator="['modelTitle', { initialValue: editModelData.modelTitle, rules: [{ required: true, message: '请输入模型名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="模型描述">
          <a-textarea
            placeholder="请输入模型描述"
            :rows="3"
            v-decorator="['modelDesc', { initialValue: editModelData.modelDesc, rules: [{ required: true, message: '请输入模型名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="设置权限">
          <a-switch
            checked-children="公开"
            un-checked-children="私有"
            v-decorator="['isPublic', { initialValue: editModelData.isPublic, valuePropName: 'checked', rules: [{ required: true, message: '请选择模型权限!' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="上传图片"
          :required="true"
        >
          <a-upload
            name="file"
            :multiple="false"
            :action="baseUrl.serverBaseController + 'model/upload'"
            :headers="headers"
            list-type="picture"
            v-decorator="['modelImg', {
            valuePropName: 'fileList',
            initialValue: [{uid: '-1',
            name: editModelData.modelImgName,
            status: 'done',
            url: editModelData.modelImgName,
            thumbUrl: editModelData.modelImgName,
            }],
            getValueFromEvent: normModelImgFile,
            rules: [{ required: true, message: '请上传模型图片!' }]
            }]"
          >
            <a-button>
              <a-icon type="upload"/>
              上传图片
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item
          label="上传模型"
          :required="true"
        >
          <a-upload
            name="file"
            :multiple="false"
            :action="baseUrl.serverBaseController + 'model/upload'"
            :headers="headers"
            v-decorator="['modelData', {
            initialValue: [{uid: '-1',
            name: editModelData.modelFileName,
            status: 'done',
            url: editModelData.modelFileName,
            }],
            valuePropName: 'fileList',
            getValueFromEvent: normModelFile,
            rules: [{ required: true, message: '请上传模型文件!' }]
            }]"
          >
            <a-button>
              <a-icon type="upload"/>
              上传模型
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import api from '@api/apiSugar';
import baseUrl from '@api/baseUrl'; // 导入接口域名列表
const ACCESS_TOKEN = 'Access-Token';

export default {
  name: "MyModel",
  data() {
    return {
      baseUrl,
      modelList: [], // 模型数据列表
      uploadVisible: false, // 控制上传模型弹窗
      uploadForm: this.$form.createForm(this, {name: 'uploadForm'}),
      headers: {
        Authorization: localStorage.getItem(ACCESS_TOKEN) || '',
      },
      modelImgName: '', // 后台返回的模型图片文件名
      modelFileName: '', // 后台返回的模型文件名
      updateVisible: false, // 控制修改模型弹窗
      updateForm: this.$form.createForm(this, {name: 'updateForm'}),
      editModelData: {},
    }
  },
  activated() {
    this.getModelList();
  },
  methods: {
    getModelList() {
      api.modelController.getModelList({
        type: 'my',
      }).then(res => {
        this.modelList = res.data.data.map(item => {
          return Object.assign(item, {
            modelFileName: this.baseUrl.serverBaseController + 'public/' + item.modelFileName,
            modelImgName: this.baseUrl.serverBaseController + 'public/' + item.modelImgName,
          })
        });
      })
    },
    chooseModel(data) {
      this.$confirm({
        title: '确定选择该模型进入工作台?',
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: () => {
          this.$router.push({name: 'WorkPage', params: {modelFileUrl: data.modelFileName}});
        },
      });
    },
    // 修改模型数据
    showUpdateModal(data) {
      this.updateVisible = true;
      this.editModelData = data;
    },
    // 删除模型数据
    handleDeleteModel(data) {
      api.modelController.deleteModel({
        id: data._id
      }).then(res => {
        const status = res.data.success;
        this.$message[status ? 'success' : 'error'](res.data.message);
        status && this.getModelList();
      })
    },
    // 上传模型信息
    handleUpload(type) {
      type === 'add' && this.uploadForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            modelTitle: values.modelTitle,
            modelDesc: values.modelDesc,
            isPublic: values.isPublic,
            modelImgName: this.modelImgName,
            modelFileName: this.modelFileName,
          }
          api.modelController.addModel(params).then(res => {
            const status = res.data.success;
            this.$message[status ? 'success' : 'error'](res.data.message);
            this.uploadVisible = !status;
            if (status) {
              this.getModelList();
              this.clearModalData('uploadForm');
              this.uploadVisible = false;
            }
          })
        }
      })
      type === 'update' && this.updateForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            modelTitle: values.modelTitle,
            modelDesc: values.modelDesc,
            isPublic: values.isPublic,
            modelImgName: this.modelImgName || this.editModelData.modelImgName.split('/')[this.editModelData.modelImgName.split('/').length - 1],
            modelFileName: this.modelFileName || this.editModelData.modelFileName.split('/')[this.editModelData.modelFileName.split('/').length - 1],
            id: this.editModelData._id,
          }
          api.modelController.updateModel(params).then(res => {
            const status = res.data.success;
            this.$message[status ? 'success' : 'error'](res.data.message);
            this.uploadVisible = !status;
            if (status) {
              this.getModelList();
              this.updateVisible = false;
            }
          })
        }
      })
    },
    // 上传图片文件处理
    normModelImgFile(info) {
      let fileList = [...info.fileList];
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1); // 出队列
      Object.assign(info, {fileList});

      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.modelImgName = info.file.response.name;
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
      return info && info.fileList;
    },
    // 上传模型文件处理
    normModelFile(info) {
      let fileList = [...info.fileList];
      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1); // 出队列
      Object.assign(info, {fileList});

      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.modelFileName = info.file.response.name;
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
      return info && info.fileList;
    },
    // 关闭modal后清除modal数据
    clearModalData(name) {
      this[name].resetFields();
    },
    handleRemoveModel(data) {
      api.modelController.removeUsableModel({id: data._id}).then(res => {
        const status = res.data.success;
        this.$message[status ? 'success' : 'error'](res.data.message);
        status && this.getModelList();
      })
    }
  }
}
</script>

