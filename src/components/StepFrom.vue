<template>
  <div>
    <el-form :model="ruleForm" label-width="100px" size="mini" label-position="left" ref="ruleForm">
      <h3 class="titleh3">添加步骤</h3>
      <el-form-item label="步骤类型" >
        <el-select v-model="ruleForm.steptype" placeholder="请选择" @change="getcommands(ruleForm.steptype)">
          <el-option
            v-for="item in steptypes"
            :key="item.id"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="步骤内容" >
        <el-select v-model="ruleForm.command_id" placeholder="请选择" @change="parameters(ruleForm.command_id)">
          <el-option
            v-for="item in stepcontents"
            :key="item.id"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div>
      <el-form-item :label="i.name" v-for="i in ruleForm.parameters" :key="i.id">
        <el-input v-model="i.value"></el-input>
      </el-form-item>
      </div>

      <div class="footer">
        <el-button type="primary" size="small" @click="Handlecreate('ruleForm')">确定</el-button>
        <el-button size="small" @click="modelflag(false,'ruleForm')">取消</el-button>
      </div>
    </el-form>

  </div>
</template>



<script>
import {mapState} from 'vuex'

  export default {
    data() {
      return {
        ruleForm:{
          steptype:'',
          parameters:[],
          command_id:'',
        },
        steptypes:[{'name':'前置条件',value:"precondition"},{name:'行为',value:"action"},{name:'断言',value:"assert"}],
        stepcontents:[],
      };
    },
    computed:{
      ...mapState({
          isCodeLang:state => state.isCodeLang,
      }),
    },
    props: ['testcaseid','projectid'],
    methods: {
      modelflag(flag,formName){
        this.$refs[formName].resetFields()
        this.$store.commit('isStepFlag',flag)
      },
      getcommands(comandtype){
        console.log(comandtype)
        let _this=this;
        _this.stepcontents=[]
        _this.ruleForm.parameters=[]
        _this.ruleForm.command_id=''
        _this.$axios({
          method:'post',
          url:'/api/command/get_state_commands',
          data:_this.$qs.stringify({'project_id':_this.projectid,'script_type':_this.$store.state.isCodeLang,'state_type':comandtype}),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.stepcontents=res.data.data
          }else{
            return _this.$message.error(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      parameters(paparameter){
        let _this=this;
        _this.ruleForm.command_id=paparameter
        for (let i of this.stepcontents) {
          if (i.value == paparameter) {
            console.log(paparameter,i.parameter_num)
            _this.ruleForm.parameters=[]
            for(let j=1;j<=i.parameter_num;j++){
              _this.ruleForm.parameters.push({'name':'参数'+j,value:""})
            }
          }
        }
      },

      //新增步骤
      Handlecreate(formName){
        let _this=this;
        for (let i of this.ruleForm.parameters) {
          if(i.value==''){
            return this.$message.error('请输入参数名.')
          }
        }
        _this.ruleForm['test_case_id']=_this.testcaseid
        _this.ruleForm['script_type']=_this.isCodeLang
        _this.ruleForm['parameters']=JSON.stringify(_this.ruleForm['parameters'])
        _this.$axios({
          method:'post',
          url:'/api/test_step/create',
          data:_this.$qs.stringify(_this.ruleForm),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.modelflag(false,'ruleForm')
            let data={'content':res.data.content,'id':res.data.id,'showflag':false}
            _this.$emit('transferData',data)
            return _this.$message.success(res.data.msg)
          }else{
            return _this.$message.error(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },



    }
  };
</script>

<style scoped>
  .el-form{
    width: 40%;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 3%;
    margin-bottom: 5%;
    padding: 2em;
    border-radius: 10px;
  }
  .footer{
    padding: 0;
    margin-left: 0;
    height: 30px;
    text-align: right;
    padding-right: 5%;
  }
  .el-select, .el-input{
    width: 80%;
    padding-left: 10%;
  }
  .titleh3{
    text-align:center;
    margin-bottom:10px;
    color: #666;
  }
</style>