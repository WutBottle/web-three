<style lang="scss">
.ModalManager {
  .modal-list {
    height: calc(100vh - 200px);
    margin: 20px 0;
    overflow: auto;
  }
}
</style>

<template>
  <div class="ModalManager">
    <a-row>
      <a-col :span="10">
        <a-input-search v-model="searchVal" placeholder="请输入模型关键词" enter-button @search="onSearch"/>
      </a-col>
      <a-col :span="14"></a-col>
    </a-row>
    <a-row>
      <div class="modal-list">
        <a-list item-layout="horizontal" :data-source="modelListData">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-button slot="actions" type="primary" @click="showModalInfo(item)">
              修改
            </a-button>
            <a-popconfirm slot="actions" title="确定删除该模型？" okText="确定" cancelText="取消" @confirm="handleDelete(item._id)">
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a-button type="danger">
                删除
              </a-button>
            </a-popconfirm>
            <a-list-item-meta
              :description="item.modelDesc + ' ' + moment(item.date).format('YYYY-MM-DD HH:mm:ss')"
            >
              <a slot="title" :href="item.modelFileName">{{ item.modelTitle }}</a>
              <a-avatar
                :size="64"
                shape="square"
                slot="avatar"
                :src="item.modelImgName"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </a-row>
  </div>
</template>

<script>
import api from '@api/apiSugar';
import baseUrl from '@api/baseUrl'; // 导入接口域名列表
import moment from "moment";

export default {
  name: "ModalManager",
  data() {
    return {
      moment,
      baseUrl, // 服务器基础域名列表
      searchVal: '', // 搜索关键词
      editVisible: false, // 编辑弹窗控制
      currentModelData: {}, // 当前模型信息
      modelListData: [], // 模型列表数据
    }
  },
  mounted() {
    this.refreshModelList();
  },
  methods: {
    onSearch() {
      this.refreshModelList().then(res => {
        this.$message.success(res);
      }).catch(err => {
        this.$message.error(err);
      });
    },
    showModalInfo(item) {
      this.editVisible = true;
      this.currentModelData = item;
    },
    // 删除模型
    handleDelete(id) {
      api.modelController.deleteModel({
        id,
      }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message);
          this.refreshModelList();
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    // 封装异步函数获取模型列表数据
    refreshModelList() {
      return new Promise(((resolve, reject) => {
        api.modelController.getModelListByName({
          name: this.searchVal,
        }).then(res => {
          if (res.data.success) {
            resolve(res.data.message);
            this.modelListData = res.data.data.map(item => {
              return Object.assign(item, {
                modelFileName: this.baseUrl.serverBaseController + 'public/' + item.modelFileName,
                modelImgName: this.baseUrl.serverBaseController + 'public/' + item.modelImgName,
              })
            });
          } else {
            reject(res.data.message);
          }
        })
      }))
    },
  }
}
</script>