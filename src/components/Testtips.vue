<template>
  <el-container>
    <el-header>
      <h3>温馨提示</h3>
    </el-header>
    <el-main>
      <p>Ps1 : 您已勾选性能监控帧率或流量，请确保手机已具备root权限！<br>
        如已具备，请下滑继续操作；如未具备，请先执行以下操作。
      </p><hr>
      <section>
        <p>USB连接：</p><span>执行命令：adb -s udid root（如下图）</span>
        <img src="../assets/fps-usb.png">
      </section>
      <section>
        <p>WIFI连接：</p><span>执行命令：adb -s ip root（如下图）</span>
        <img src="../assets/fps-wifi.png">
      </section><hr>
      <p>Ps2 : 请打开待测手机应用，并进行相应操作，点击运行后，将开始记录CPU、内存、帧率、流量、电量等待测指标！
      </p><hr>
      <section>
        <p style="display:block;">以微信为例（如下图）：</p>
        <div style="text-align:center;">
          <img src="../assets/weixin1.png" style="display:inline-block;width:45%;">
          <img src="../assets/weixin2.png" style="display:inline-block;width:45%;">
          <img src="../assets/weixin3.png" style="display:inline-block;width:45%;">
          <img src="../assets/weixin4.png" style="display:inline-block;width:45%;">
        </div>
      </section>
    </el-main>
    <el-footer>
      <el-button  @click='runing' type="success" size='small'>确定</el-button>
      <el-button  @click='close' size='small' type="primary">取消</el-button>
    </el-footer>
  </el-container>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'test-tips',
  data() {
    return {
      running:true,
    }
  },
  methods:{
    close(){
      this.$store.commit('isTipsFlag',false)
    },
    runing(){
      this.close()
      this.$emit('transferData')
    }
  }
};
</script>

<style scoped lang="scss">
.el-container{
  width: 50%;
  margin: 0 auto;
  background: #fff;
  border-radius: 4px;
  height: 100vh;
  overflow-y:scroll;
  .el-header{
    height: 50px !important;
    line-height: 50px;
    background: rgb(112,185,229);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    text-align: center;
    color: #fff;
  }
  .el-main{
    font-size: 14px;
    hr{
      opacity: 0.5;
    }
    p{
      font-weight: bold;
      display: inline-block;
    }
    img{
      display: block;
      margin: 0 auto;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
  .el-footer{
    height: 50px !important;
    line-height: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    text-align: center;
  }
}

</style>