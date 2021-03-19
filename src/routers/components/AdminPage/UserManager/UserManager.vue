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
            <a-button slot="actions" type="primary" @click="showUserInfo(item)">
              修改
            </a-button>
            <a-popconfirm slot="actions" title="确定删除该用户？" okText="确定" cancelText="取消" @confirm="handleDelete(item._id)">
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a-button type="danger">
                删除
              </a-button>
            </a-popconfirm>
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
    <a-modal
      title="修改用户资料"
      :visible="editVisible"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="() => this.editVisible = false"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="真实姓名">
          <a-input
            v-decorator="['nickname', {
              rules: [{ required: true, message: '请输入真实姓名!' }],
              initialValue: currentUserData.nickname
            }]"
            placeholder="请输入真实姓名"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            type="password"
            v-decorator="['note', {
              rules: [{ required: true, message: '请输入密码!' }],
              initialValue: currentUserData.password
            }]"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number
            :min="0"
            v-decorator="['age', {
              initialValue: currentUserData.age
            }]"
            placeholder="年龄"
          />
        </a-form-item>
        <a-form-item label="单位">
          <a-input
            v-decorator="['company', {
              initialValue: currentUserData.company
            }]"
            placeholder="请输入单位"
          />
        </a-form-item>
        <a-form-item label="专业方向">
          <a-input
            v-decorator="['major', {
              initialValue: currentUserData.major
            }]"
            placeholder="请输入专业方向"
          />
        </a-form-item>
      </a-form>
    </a-modal>
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
      data: [],
      editVisible: false, // 编辑弹窗控制
      currentUserData: {}, // 当前用户信息
      formLayout: 'horizontal',
      form: this.$form.createForm(this, {name: 'form'}),
    }
  },
  mounted() {
    this.refreshUserList();
  },
  methods: {
    // 获取用户列表
    onSearch() {
      this.refreshUserList().then(res => {
        this.$message.success(res);
      }).catch(err => {
        this.$message.error(err);
      });
    },
    showUserInfo(item) {
      this.editVisible = true;
      this.currentUserData = item;
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          api.tokensController.updateUserInfo(values).then(res => {
            if (res.data.success) {
              this.editVisible = false;
              this.refreshUserList();
            }
            this.$message.success(res.data.message);
          })
        }
      });
    },
    // 封装异步函数获取用户列表数据
    refreshUserList() {
      return new Promise(((resolve, reject) => {
        api.tokensController.getUserList({
          name: this.searchVal,
        }).then(res => {
          if (res.data.success) {
            resolve(res.data.message);
            this.data = res.data.data;
          } else {
            reject(res.data.message);
          }
        })
      }))
    },
    // 删除用户
    handleDelete(id) {
      api.tokensController.deleteUser({
        id,
      }).then(res => {
        if (res.data.success) {
         this.$message.success(res.data.message);
         this.refreshUserList();
        } else {
          this.$message.error(res.data.message);
        }
      })
    }
  }
}
</script>