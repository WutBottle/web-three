<style lang="scss">
.UserCenter {

}
</style>

<template>
  <div class="UserCenter">
    <a-row>
      <a-col :span="16">
        <UserInfo :userData="userData" @updateFatherData="updateUserInfo"/>
      </a-col>
      <a-col :span="8">
        <a-card title="消息列表" :bordered="false">

        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import UserInfo from '@components/UserInfo/UserInfo';
import api from '@api/apiSugar';

export default {
  name: "UserCenter",
  components: {
    UserInfo,
  },
  data() {
    return {
      userData: {},
    }
  },
  mounted() {
    this.updateUserInfo();
  },
  methods: {
    updateUserInfo() {
      api.tokensController.getUserInfo().then(res => {
        if (res.data.success) {
          this.userData = res.data.data;
        } else {
          this.$message.error('获取用户信息失败');
        }
      })
    },

  }
}
</script>

