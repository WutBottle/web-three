<style lang="scss">
.UserInfo {
  .row-wrapper {
    margin-bottom: 12px;
    font-size: 16px;

    .title-wrapper {
      display: inline-block;
      width: 100px;
    }
  }

  .icon-wrapper {
    display: inline-block;
    margin-left: 12px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="UserInfo">
    <a-card title="个人资料" :bordered="false">
      <a slot="extra" @click="() => this.modalVisible = true">修改</a>
      <a-row class="row-wrapper">
        <span class="title-wrapper">用户名：</span>
        <span>{{ userData.username }}</span>
      </a-row>
      <a-row class="row-wrapper">
        <span class="title-wrapper">真实姓名：</span>
        <span>{{ userData.nickname }}</span>
      </a-row>
      <a-row class="row-wrapper">
        <span class="title-wrapper">密码：</span>
        <span>{{ !pwMode ? '******' : userData.password }}</span>
        <div class="icon-wrapper" @click="() => this.pwMode = !this.pwMode">
          <a-icon v-if="!pwMode" type="eye" theme="twoTone"/>
          <a-icon v-else type="eye-invisible" theme="twoTone"/>
        </div>
      </a-row>
      <a-row class="row-wrapper">
        <span class="title-wrapper">年龄：</span>
        <span>{{ userData.age }}</span>
      </a-row>
      <a-row class="row-wrapper">
        <span class="title-wrapper">单位：</span>
        <span>{{ userData.company }}</span>
      </a-row>
      <a-row class="row-wrapper">
        <span class="title-wrapper">专业方向：</span>
        <span>{{ userData.major }}</span>
      </a-row>
    </a-card>
    <a-modal
      title="修改个人资料"
      :visible="modalVisible"
      okText="确定"
      cancelText="取消"
      @ok="handleOk"
      @cancel="() => this.modalVisible = false"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="真实姓名">
          <a-input
            v-decorator="['nickname', {
              rules: [{ required: true, message: '请输入真实姓名!' }],
              initialValue: userData.nickname
            }]"
            placeholder="请输入真实姓名"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input
            type="password"
            v-decorator="['note', {
              rules: [{ required: true, message: '请输入密码!' }],
              initialValue: userData.password
            }]"
            placeholder="请输入密码"
          />
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number
            :min="0"
            v-decorator="['age', {
              initialValue: userData.age
            }]"
            placeholder="年龄"
          />
        </a-form-item>
        <a-form-item label="单位">
          <a-input
            v-decorator="['company', {
              initialValue: userData.company
            }]"
            placeholder="请输入单位"
          />
        </a-form-item>
        <a-form-item label="专业方向">
          <a-input
            v-decorator="['major', {
              initialValue: userData.major
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

export default {
  name: "UserInfo",
  props: {
    userData: {
      type: Object,
      default: () => {
      },
      require: true,
    }
  },
  data() {
    return {
      modalVisible: false,
      pwMode: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, {name: 'form'}),
    }
  },
  methods: {
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          api.tokensController.updateUserInfo(values).then(res => {
            if (res.data.success) {
              this.modalVisible = false;
              this.$emit('updateFatherData');
            }
            this.$message.success(res.data.message);
          })
        }
      });
    },
  }
}
</script>

