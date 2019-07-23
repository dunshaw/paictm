<template>
    <el-row class="index">
      <div class="bgblack">
        <section>
        <p>成都平安科技 </p>
        <p>Ping An Technology (Shenzhen) Co., Ltd </p></section>
    </div>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-header class="index-main">
            <div class="logo">
                <!-- <img src="../assets/logo.png"> -->
                <!-- <h1 class="site_title">平安科技</h1> -->
                <!-- <div class="line"></div> -->
            </div>  
          </el-header>
          <el-container>
            <el-main>
                <transition enter-active-class="bounceIn" leave-active-class="" :duration='{enter:500, leave: 0}'>
                    <h3 v-if="flag" class="animated">{{ login }}</h3>
                </transition>
                <transition enter-active-class="bounceIn" leave-active-class="" :duration='{enter:500, leave: 0}'>
                    <h3 v-if="!flag" class="animated">{{ register }}</h3>
                </transition>


              <el-form ref="form" :model="form" :rules = "rules">
                <el-form-item prop="account">
                    <el-input v-model="form.account" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-button type="primary" round @click="logins(form)" v-if="flag">登 录</el-button>
                <el-button type="warning" round @click="registers(form)" v-else="flag" >注 册</el-button>
              </el-form>
              <el-link type="warning" @click="flag=!flag" v-if="flag">暂无账号？去注册</el-link>
              <el-link type="warning" @click="flag=!flag" v-else="flag">已有账号？去登录</el-link>
<!--               <el-button plain @click="flag=!flag" v-if="flag">暂无账号？注册</el-button>
              <el-button plain @click="flag=!flag" v-else="flag">已有账号？登录</el-button> -->
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name:'Login',
        data() {
            return {
                test:true,
                flag:true,
                login:' 登 录 ' ,
                register:' 注 册 ',
                form:{
                    account: '',
                    password: '',
                },
                rules:{
                    account:[
                        { required: true, message:'请输入用户名', trigger:'blur'},
                        { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }

                    ],
                    password:[
                        { required: true, message:'请输入密码', trigger:'blur'},
                        { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            logins(form){
                let _this = this
                // console.log(form);
                // localStorage.setItem('UMCode',_this.form.account);
                _this.$refs.form.validate(function(valid){
                    if(valid){
                        let data = {
                            name: _this.form.account,
                            password: _this.form.password
                        };
                        _this.$axios({
                            method:'post',
                            url:'/api/users/login',
                            data:_this.$qs.stringify(data)
                        }).then(function (res){
                            // console.log(res);
                            if(res.data.status==200){
                                _this.$router.push('Home')
                                localStorage.setItem('usertoken',res.data.token) 
                                _this.$store.commit('changeLoginFlag',true)
                                _this.$store.commit('changeLoginName',_this.form.account)
                                _this.$store.commit('changeToken',res.data.token)    
                            }else{
                                return _this.$message.error(res.data.msg)
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                    }else{
                        console.log(valid)
                        return false;
                    }
                })
            },
            registers(form){
                let _this = this
                // localStorage.setItem('UMCode',_this.form.account);
                _this.$refs.form.validate(function(valid){
                    if(valid){
                        let data = {
                            name: _this.form.account,
                            password: _this.form.password
                        };
                        _this.$axios({
                            method:'post',
                            url:'/api/users/create',
                            data:_this.$qs.stringify(data)
                        }).then(function (res){
                            console.log(res);
                            if(res.data.status==200){
                                _this.$notify({
                                title: '成功',
                                message: res.data.msg,
                                type: 'success'});
                            }else{
                                _this.$notify.error({
                                title: '失败',
                                message: res.data.msg});
                            }
                        }).catch(function (error) {
                            console.log(error)
                        })
                    }else{
                        console.log(valid)
                        return false;
                    }
                })
            },
        }
    };
</script>




<style scoped>



    h3{
        letter-spacing:2px;
        color: rgba(20,35,63,.8);  
        margin-bottom: 20px; 

    }
    .el-main{
        background-color: rgba(255,255,255,.1);
        position: absolute;
        width: 34%;
        padding: 2em;
        top: 20%;
        left: 33%;
        text-align: center;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    }
    .el-main h3{
        color: #fff;
        font-size: 22px;
    }
    .el-container{
       min-height: 400px;
    }

    .el-main .el-button{
        margin-top: 10px;
        height: 35px;
        line-height: 12px;
        width: 100%;
    }

    .el-link{
        margin-top:1rem;
    }



    .index{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        background-color: #fff;
        background-image: url(../assets/bg3.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        overflow: hidden;
    }
    .index-main {
        width: 50%;
        height: 100%;
    }
    .logo img{
        position: absolute;
        width: 60px;
        top: 3%;
        left: 50%;
        z-index: 999;
    }

    .site_title{
        color: #f35626;
        background-image: -webkit-linear-gradient(92deg,#f35626,#feab3a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -webkit-animation: hue 60s infinite linear;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .bgblack{
        width: 100%;
        height: 100%;
        background-color:rgba(0,0,0,.1);
    }
    .bgblack>>>section{
        color: rgba(255,255,255,.7);
        position: absolute;
        bottom: 1%;
        right:1%;
        text-align: right;
        letter-spacing: 1px;
    }
</style>