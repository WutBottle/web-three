<style lang="scss">
.UserManager {
  .list-wrapper {
    height: calc(100vh - 200px);
    margin: 20px 0;
    overflow: auto;

    .avatar {
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
}
</style>

<template>
  <div class="UserManager">
    <a-row>
      <a-col :span="10">
        <a-input-search v-model="searchVal" placeholder="请输入用户名" enter-button @search="onSearch"/>
      </a-col>
      <a-col :span="14"></a-col>
    </a-row>
    <a-row>
      <div class="list-wrapper">
        <a-list item-layout="horizontal" :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-button slot="actions" type="primary">
              修改
            </a-button>
            <a-button slot="actions" type="danger">
              删除
            </a-button>
            <a-list-item-meta
              :description="item.nickname + ' ' + item.age + ' ' + item.company + ' ' + item.major + ' ' + moment(item.date).format('YYYY-MM-DD HH:mm:ss')"
            >
              <a slot="title">{{ item.username }}</a>
              <div class="avatar" slot="avatar">
                {{ item.nickname.substr(0, 1) }}
              </div>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </div>
    </a-row>
  </div>
</template>

<script>
import api from '@api/apiSugar';
import moment from "moment";

export default {
  name: "UserManager",
  data() {
    return {
      moment,
      searchVal: '', // 搜索用户名
      data: []
    }
  },
  mounted() {
    this.onSearch();
  },
  methods: {
    // 获取用户列表
    onSearch() {
      api.tokensController.getUserList({
        name: this.searchVal,
      }).then(res => {
        if (res.data.success) {
          this.$message.success(res.data.message);
          this.data = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
  }
}
</script>