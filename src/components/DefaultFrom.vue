<template>
    <div>
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="160px" size="mini" >
        <h3 style="text-align:center;margin-bottom:10px;">新增任务</h3>
        <el-form-item label="测试任务名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="测试任务对象" prop="apk">
          <el-select v-model="ruleForm.apk" placeholder="请选择测试对象">
            <el-option :label="item" :value="item" v-for='item in apklist' :key='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Package名" prop="package">
          <el-input v-model="ruleForm.package"></el-input>
        </el-form-item>
        <el-form-item label="帧率间隔时间(s)" prop="fps">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="流量间隔时间(s)" prop="flow">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电量间隔时间(s)" prop="electric">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="CPU/内存间隔时间(s)" prop="cpu">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
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
    data() {
      return {
        ruleForm: {
          name: '',
          apk:'',
          package:'',
          flow:'',
          cpu:'',
          fps:'',
          electric:'',
        },
        apklist:[],
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
          package: [
            { required: true, message: '请输入Package名', trigger: 'blur' },
          ],
          flow: [
            { required: true, message: '请输入流量间隔时间', trigger: 'blur' },
          ],
          cpu: [
            { required: true, message: '请输入CPU/内存间隔时间', trigger: 'blur' },
          ],
          fps: [
            { required: true, message: '请输入帧率间隔时间', trigger: 'blur' },
          ],
          electric: [
            { required: true, message: '请输入电量间隔时间', trigger: 'blur' },
          ],
          apk: [
            { required: true, message: '请选择测试对象', trigger: 'change' }
          ],
        },
      }
    },
    computed:{
        ...mapState({
          isFromShow:state => state.isFromShow,
        }),
    },
    mounted(){
      this.get_apklist()
    },
    methods: {
      //关闭表单model
      closeForm(){
        this.$store.commit('isFromFlag',false)
      },
      // 获取apk
      get_apklist(){
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
      },
      submitForm(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm);
          } else {
            return this.$message.error('请填写完整红色部分信息!'); 
          }
        });
      },
    }
  };
</script>

<style scoped lang="scss">
.el-form{
    width: 50%;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 3%;
    margin-bottom: 5%;
    padding: 2em;
    border-radius: 10px;
    .el-select{
      width: 90%;
    }
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
</style>