<style lang="scss">
.AllModel {
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
  <div class="AllModel">
    <a-card title="所有模型库">
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
                <a-button type="primary" :disabled="!item.isPublic" @click="addIntoMyModel(item)">
                  加入仓库
                </a-button>
                <a-button type="danger" :disabled="item.isPublic" @click="showApplyModal(item)">
                  申请使用
                </a-button>
              </template>
              <a-card-meta>
                <a-tooltip slot="avatar" placement="top">
                  <template slot="title">
                    <span>{{ item.ownerName }}</span>
                  </template>
                  <div class="owner-display">
                    {{ item.ownerNick.charAt(item.ownerNick.length - 1) }}
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
    <a-modal v-model="applyVisible" title="申请使用模型" okText="确认" cancelText="取消" @ok="handleApply"
             :afterClose="() => {}">
      <a-form-item label="申请理由" :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }">
        <a-textarea
          placeholder="请输入申请理由"
          :rows="3"
        />
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>
import api from '@api/apiSugar';
import baseUrl from '@api/baseUrl'; // 导入接口域名列表

export default {
  name: "AllModel",
  data() {
    return {
      baseUrl,
      modelList: [],
      applyVisible: false, // 申请使用modal显示
      currentModelId: '', // 当前点击的模型id
    }
  },
  activated() {
    this.getModelList();
  },
  methods: {
    getModelList() {
      api.modelController.getModelList({
        type: 'all',
      }).then(res => {
        this.modelList = res.data.data.map(item => {
          return Object.assign(item, {
            modelFileName: this.baseUrl.serverBaseController + 'public/' + item.modelFileName,
            modelImgName: this.baseUrl.serverBaseController + 'public/' + item.modelImgName,
          })
        });
      })
    },
    addIntoMyModel(data) {
      this.$confirm({
        title: '确定将该模型加入我的模型库吗?',
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: () => {
          api.modelController.addUsableModel({id: data._id}).then(res => {
            if(res.data.success) {
              this.$message.success(res.data.message);
            }else {
              this.$message.error(res.data.message);
            }
          })
        },
      });
    },
    // 打开模型申请modal
    showApplyModal(data) {
      this.applyVisible = true;
      this.currentModelId = data._id;
    },
    handleApply() {

    }
  }
}
</script>

