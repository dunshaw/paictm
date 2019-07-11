<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="form" label-width="90px" size="mini" >
          <h3 style="text-align:center;margin-bottom:10px;">工程配置<i class="el-icon-close closebtn" @click='closeForm()'></i></h3>
          <el-form-item label="工程名称" prop="name" v-if="isFromShow">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="工程系统" prop="system_type" v-if="isFromShow">
            <el-select v-model="ruleForm.system_type" placeholder="请选择测试系统">
              <el-option label="android" value="android"></el-option>
              <el-option label="ios" value="ios"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测试工具" prop="task_tool" v-if="isFromShow">
            <el-select v-model="ruleForm.task_tool" placeholder="请选择测试工具">
              <el-option label="cucumber" value="cucumber"></el-option>
              <el-option label="behave" value="behave" v-show="this.ruleForm.system_type!='ios'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="测试APK" prop="">
            <el-select v-model="ruleForm.app_file_name" placeholder="请选择测试APK">
              <el-option v-for="item in apklist" :label="item" :value="item" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="showtypes">
            <h3 style="text-align:center;margin-bottom:10px;"> 授 权 </h3>
            <el-main>
                <el-form-item v-for="item in user" :label="item.name+':'" label-width="120px" class="myradio" :key="item.id">
                  <el-radio v-model="item.role" label="share" size="mini">编辑</el-radio>
                  <el-radio v-model="item.role" label="readonly" size="mini">只读</el-radio>
                  <el-radio v-model="item.role" label="cancle" size="mini">取消</el-radio>
                </el-form-item>
            </el-main></div>
          <div class="footer">
            <el-button type="primary" @click="submitForm" size="small">确定</el-button>
            <el-button size="small" @click="closeForm()">取消</el-button>
          </div>
        </el-form>
    </div>
</template>  



<script>
import {mapState} from 'vuex'

export default {
  name: 'projectfrom',
      data(){
          return {
              ruleForm: {
                name: '',
                system_type: '',
                task_tool:'',
                app_file_name:'',
              },
              user: [],
              apklist:[],
              rules:{
                  name:[
                      { required: true, message: '请输入设备名', trigger: 'blur' },
                      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                  ],
                  system_type:[
                      { required: true, message: '请选择测试系统', trigger: 'blur' },
                  ],
                  task_tool:[
                      { required: true, message: '请选择测试工具', trigger: 'blur' },
                  ],
                  app_file_name:[
                      { required: true, message: '请选择测试APK', trigger: 'blur' },
                  ],
              },     
          }
      },
      props:['showtypes'],
      computed:{
          ...mapState({
            isFromShow:state => state.isFromShow,
          }),
          systemType(){
            return this.ruleForm.system_type 
          },
      },
      watch:{
        systemType(val){
          if(val === 'ios'){
            this.ruleForm.task_tool = 'cucumber';
          }else{
            this.ruleForm.task_tool = '';
          }
        }
      },
      mounted(){
          this.getusers()
        },
      methods:{
          //关闭表单model
          closeForm(){
              this.$store.commit('isFromFlag',false)
              this.$store.commit('isFromData','')
              this.$store.commit('isFromShow',true)
          },
          // 获取from数据
          getusers(){
              // 编辑
              if(this.$store.state.isFromData){
                  let _this=this;
                  _this.$axios({
                    method:'post',
                    url:'/api/project/select',
                    data:_this.$qs.stringify({'project_id':_this.$store.state.isFromData,'user_name':_this.$store.state.isLoginName}),
                  }).then(function (res){
                    console.log(res);
                    if(res.data.status==200){
                      _this.ruleForm = res.data.data 
                      _this.user = res.data.user_data
                      _this.apklist=res.data.package_list
                    }
                  }).catch(function (error) {
                    console.log(error)
                  })
              }
              //新增时
              else{
                  let _this=this;
                  _this.$axios({
                    method:'post',
                    url:'/api/project/get_infos',
                    data:_this.$qs.stringify({'name':_this.$store.state.isLoginName}),
                  }).then(function (res){
                    console.log(res);
                    if(res.data.status==200){
                        _this.user = res.data.user_data
                        _this.user.forEach(item=>{
                          item.role=''
                        })
                        _this.apklist=res.data.authoritie_list
                    }
                  }).catch(function (error) {
                    console.log(error)
                  })
              }
          },
          //新增修改上传数据
          submitForm(){
              this.ruleForm['user']=JSON.stringify(this.user)
              this.ruleForm['username']=this.$store.state.isLoginName
              console.log(this.ruleForm)
              //old 修改
              if(this.$store.state.isFromData){
                  let _this=this;
                  _this.$refs.form.validate(function(valid){
                      if(valid){
                          _this.$axios({
                            method:'post',
                            url:'/api/project/update',
                            data:_this.$qs.stringify(_this.ruleForm),
                          }).then(function (res){
                            console.log(res);
                            if(res.data.status==200){
                              _this.closeForm()
                              return _this.$message.success(res.data.msg); 
                            }else{
                              return _this.$message.error(res.data.msg); 
                            }
                          }).catch(function (error) {
                            return this.$message.error(error);
                          })
                      }else{
                          return _this.$message.error('请填写完整红色部分信息!'); 
                      }
                  }) 
              }
              //new 新增
              else{                    
                  let _this=this;
                  _this.$refs.form.validate(function(valid){
                      if(valid){
                          _this.$axios({
                            method:'post',
                            url:'/api/project/create',
                            data:_this.$qs.stringify(_this.ruleForm),
                          }).then(function (res){
                            console.log(res);
                            if(res.data.status==200){
                              let AddData={
                                'id':res.data.project_id,
                                'name':_this.ruleForm.name,
                                'system_type':_this.ruleForm.system_type,
                                'app_file_name':_this.ruleForm.app_file_name,
                              }
                              _this.$emit('transferData',AddData)
                              _this.closeForm()
                              return _this.$message.success(res.data.msg); 
                            }else{
                              return _this.$message.error(res.data.msg); 
                            }
                          }).catch(function (error) {
                            return this.$message.error(error);
                          })
                      }else{
                          return _this.$message.error('请填写完整红色部分信息!'); 
                      }
                  })
              }
          },
      },
};


</script>

<style scoped>
.el-form{
    width: 40%;
    max-height: 500px;
    overflow-y:auto;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 3%;
    margin-bottom: 5%;
    padding: 2em;
    border-radius: 10px;
  }
  .closebtn{
    float: right;
    cursor: pointer;
  }
  .myradio{
    width: 98%;
    display: inline-block;
    outline: 1px solid #eee;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    margin: 1%;
  }
  .el-main{
    padding: 0px;
    outline: 1px solid #eee;
    margin-bottom: 20px;
  }
  .el-radio{
    margin-left: 10%;
  }
  .el-input{
    max-width: 90%;
  }
  .footer{
    padding: 0;
    margin-left: 0;
    height: 30px;
    text-align: right;
  }
  .el-select{
      width: 90%;
    }
</style>

