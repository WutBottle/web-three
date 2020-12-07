<style lang="scss">
.MyModel {
  padding: 20px;

  .line-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<template>
  <div class="MyModel">
    <a-card title="我的模型库">
      <a-row :gutter="[16, 16]">
        <a-col :span="8">
          <a-card hoverable>
            <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <template slot="actions" class="ant-card-actions">
              <a-button type="primary" size="small" @click="chooseModel">
                选择
              </a-button>
              <a-button type="dashed" size="small" @click="setPublic">
                公开
              </a-button>
              <a-button type="danger" size="small">
                删除
              </a-button>
            </template>
            <a-card-meta>
              <a-tooltip slot="title" placement="top">
                <template slot="title">
                  <span>六面体骰子六面体骰子六面体骰子六面体骰子</span>
                </template>
                <div class="line-ellipsis">六面体骰子六面体骰子六面体骰子六面体骰子</div>
              </a-tooltip>
              <a-tooltip slot="description" placement="top">
                <template slot="title">
                  <span>这是个六面体骰子这是个六面体骰子</span>
                </template>
                <div class="line-ellipsis">这是个六面体骰子这是个六面体骰子</div>
              </a-tooltip>
            </a-card-meta>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card hoverable>
            <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <template slot="actions" class="ant-card-actions">
              <a-button type="primary" size="small" @click="chooseModel">
                选择
              </a-button>
              <a-button type="dashed" size="small">
                公开
              </a-button>
              <a-button type="danger" size="small">
                删除
              </a-button>
            </template>
            <a-card-meta>
              <a-tooltip slot="title" placement="top">
                <template slot="title">
                  <span>六面体骰子六面体骰子六面体骰子六面体骰子</span>
                </template>
                <div class="line-ellipsis">六面体骰子六面体骰子六面体骰子六面体骰子</div>
              </a-tooltip>
              <a-tooltip slot="description" placement="top">
                <template slot="title">
                  <span>这是个六面体骰子这是个六面体骰子</span>
                </template>
                <div class="line-ellipsis">这是个六面体骰子这是个六面体骰子</div>
              </a-tooltip>
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-card-meta>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card hoverable>
            <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <template slot="actions" class="ant-card-actions">
              <a-button type="primary" size="small" @click="chooseModel">
                选择
              </a-button>
              <a-button type="dashed" size="small">
                公开
              </a-button>
              <a-button type="danger" size="small">
                删除
              </a-button>
            </template>
            <a-card-meta>
              <a-tooltip slot="title" placement="top">
                <template slot="title">
                  <span>六面体骰子六面体骰子六面体骰子六面体骰子</span>
                </template>
                <div class="line-ellipsis">六面体骰子六面体骰子六面体骰子六面体骰子</div>
              </a-tooltip>
              <a-tooltip slot="description" placement="top">
                <template slot="title">
                  <span>这是个六面体骰子这是个六面体骰子</span>
                </template>
                <div class="line-ellipsis">这是个六面体骰子这是个六面体骰子</div>
              </a-tooltip>
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-card-meta>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card hoverable>
            <img
              slot="cover"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <template slot="actions" class="ant-card-actions">
              <a-button type="primary" size="small" @click="chooseModel">
                选择
              </a-button>
              <a-button type="dashed" size="small">
                公开
              </a-button>
              <a-button type="danger" size="small">
                删除
              </a-button>
            </template>
            <a-card-meta>
              <a-tooltip slot="title" placement="top">
                <template slot="title">
                  <span>六面体骰子六面体骰子六面体骰子六面体骰子</span>
                </template>
                <div class="line-ellipsis">六面体骰子六面体骰子六面体骰子六面体骰子</div>
              </a-tooltip>
              <a-tooltip slot="description" placement="top">
                <template slot="title">
                  <span>这是个六面体骰子这是个六面体骰子</span>
                </template>
                <div class="line-ellipsis">这是个六面体骰子这是个六面体骰子</div>
              </a-tooltip>
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import api from '@api/apiSugar';

export default {
  name: "MyModel",
  data() {
    return {
      modelList: [{
        id: '1',
        ownerId: '',
        modelTitle: '',
        modelId: '',
        modelImg: '',
        modelDesc: '',
      }]
    }
  },
  mounted() {
    api.modelController.getModelList({
      type: 'my',
    }).then(res => {
      console.log(res)
    })
  },
  methods: {
    chooseModel() {
      this.$confirm({
        title: '确定选择该模型进入工作台?',
        okText: '确定',
        okType: 'primary',
        cancelText: '取消',
        onOk: () => {
          this.$router.push('/work');
        },
      });
    },
    setPublic() {

    }
  }
}
</script>

