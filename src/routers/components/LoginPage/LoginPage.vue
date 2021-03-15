<style lang="scss">
.LoginPage {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 46%;
  margin-left: -250px;
  margin-top: -200px;
}
</style>
<template>
  <div class="LoginPage">
    <a-alert
      message="增材制造数据预处理平台"
      description="暂时为测试版本，涉及功能包括模型文件管理、模型显示交互、模型分层切片、切片轨迹填充、生成可执行G代码"
      type="info"
      style="margin-bottom: 20px"
    />
    <a-tabs v-model="tabsKey">
      <a-tab-pane key="login">
      <span slot="tab">
        <a-icon type="login" />
        登录
      </span>
        <a-form-model layout="horizontal" :model="loginForm" @submit="handleSubmit" v-bind="formItemLayout"
                      @submit.native.prevent>
          <a-form-model-item label="用户名">
            <a-input v-model="loginForm.username" placeholder="用户名">
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="密码">
            <a-input v-model="loginForm.password" type="password" placeholder="密码">
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-model-item>
          <a-form-model-item v-bind="{wrapperCol: { span: 24 }}">
            <a-button
              style="width: 100%;"
              type="primary"
              html-type="submit"
              :disabled="loginForm.user === '' || loginForm.password === ''"
            >
              登录
            </a-button>
            Or
            <a @click="() => this.tabsKey = 'register'">
              register now!
            </a>
          </a-form-model-item>
        </a-form-model>
      </a-tab-pane>
      <a-tab-pane key="register">
      <span slot="tab">
        <a-icon type="user-add" />
        注册
      </span>
        <a-form layout="horizontal" :form="registerForm" v-bind="formItemLayout">
          <a-form-item label="用户名">
            <a-input
              placeholder="请输入用户名"
              v-decorator="['username', { rules: [{ required: true, message: '请输入用户名!' }] }]"
            >
              <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item label="真实姓名">
            <a-input
              placeholder="请输入真实姓名"
              v-decorator="['nickname', { rules: [{ required: true, message: '请输入真实姓名!' }] }]"
            >
              <a-icon slot="prefix" type="idcard" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item label="密码">
            <a-input
              type="password"
              placeholder="请输入登录密码"
              v-decorator="['password', { rules: [{ required: true, message: '请输入登录密码!' }] }]"
            >
              <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)"/>
            </a-input>
          </a-form-item>
          <a-form-item v-bind="{wrapperCol: { span: 24 }}">
            <a-button
              style="width: 100%;"
              type="primary"
              @click="handleRegister"
            >
              注册
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import api from '@api/apiSugar';

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 18},
}
export default {
  name: "LoginPage",
  data() {
    return {
      formItemLayout,
      loginForm: {
        username: '',
        password: '',
      },
      registerForm: this.$form.createForm(this, {name: 'registerForm'}),
      tabsKey: 'login',
    }
  },
  methods: {
    // 处理登录
    handleSubmit() {
      api.tokensController.loginUser(this.loginForm).then(res => {
        if(res.data.success) {
          if(res.data.role === 'user') {
            window.localStorage.setItem('nickname', res.data.nickname);
            this.$router.push('/file');
          }else if(res.data.role === 'admin'){
            this.$router.push('/admin');
          }
          window.localStorage.setItem('Access-Token', `Bearer ${res.data.Token}`);
          window.localStorage.setItem('username', res.data.username);
          window.localStorage.setItem('role', res.data.role);
          this.$message.success('登录成功');
        }else {
          this.$message.error(res.data.message);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    // 处理注册
    handleRegister() {
      this.registerForm.validateFields((err, values) => {
        if (!err) {
          api.tokensController.registerUser({...values}).then(res => {
            if(res.data.success) {
              this.$message.success(res.data.message);
              this.tabsKey = 'login';
              this.registerForm.resetFields();
            }else {
              this.$message.error(res.data.message);
            }
          })
        }
      })
    }
  }
}
</script>

