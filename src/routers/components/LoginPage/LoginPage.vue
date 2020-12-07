<style lang="scss">
.LoginPage {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
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
      </a-form-model-item>
    </a-form-model>
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
      }
    }
  },
  methods: {
    handleSubmit() {
      api.tokensController.loginUser(this.loginForm).then(res => {
        if(res.data.success) {
          this.$message.success('登录成功');
          window.localStorage.setItem('Access-Token', `Bearer ${res.data.Token}`);
          this.$router.push('/file');
        }else {
          this.$message.error(res.data.message);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
</script>

