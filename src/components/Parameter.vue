<template>
  <div class="box">
    <i class="el-icon-close" style="float:right;cursor:pointer;" @click="modelflag(false)"></i>
    <h3 style="text-align:center;margin-bottom:10px;">参数列表</h3>
    <!-- {{projectid}} -->
    <el-main class="mainbox">
      <el-table ref="form" :data="parameterlist" style="width: 100%"  stripe border :cell-style="isCenter" :header-cell-style="isThead" height="450">
        <el-table-column prop="name" label="参数名" width="100"></el-table-column>
        <el-table-column label="参数类型" width="80">
          <template slot-scope="scope">{{ scope.row.type | conditiontype}}</template>
        </el-table-column>
        <el-table-column label="所属界面" width="80">
          <template slot-scope="scope">{{ scope.row.belong_page | conditionbelong}}</template>
        </el-table-column>
        <el-table-column prop="device_name" label="适用设备" width="80"></el-table-column>
        <el-table-column label="参数值">
          <template slot-scope="scope"><span style="white-space: pre-wrap;">{{ scope.row.value | conditionvalue(scope.row.type)}}</span></template>
        </el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" circle size="mini" @click="editparame(scope.row.id,scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteparame(scope.row.id,scope.row.type,scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-footer class="footer">
        <el-button-group>
          <el-button size="mini" type="primary" icon="el-icon-plus" round @click="handlecreate('ruleForm')">新增</el-button>
          <el-button size="mini" type="info" icon="el-icon-download" round>导出</el-button>
          <el-button size="mini" type="info" icon="el-icon-upload2"  round>导入</el-button>
        </el-button-group>
      </el-footer>
    </el-main>

    <!-- 新增参数from -->
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut" :duration='{enter:800, leave: 800}'>
      <div v-if="formflag" class='animated frombg'>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" size="mini" >
          <h3 style="text-align:center;margin-bottom:10px;margin-top:10px;">设置参数</h3>
          <el-form-item label="参数名" prop="name">
            <el-input v-model="ruleForm.name" :disabled="editflag"></el-input>
          </el-form-item>
          <el-form-item label="参数类型" prop="type" >
            <el-select v-model="ruleForm.type" placeholder="请选择所属类型" :disabled="editflag">
              <el-option label="界面" value="page"></el-option>
              <el-option label="控件" value="element"></el-option>
              <el-option label="输入值" value="input"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="ruleForm.type!='element'">
          <el-form-item label="参数值" prop="value">
            <el-input v-model="ruleForm.value"></el-input>
          </el-form-item>
          </div>
          <div v-if="ruleForm.type=='element'">
            <el-form-item label="所属界面" prop="belong_page">
              <el-select v-model="ruleForm.belong_page" placeholder="请选择所属界面" :disabled="editflag">
                <el-option :label="page.name" :value="page.id" v-for="page in belongpages" :key="page.id"></el-option>
              </el-select>
            </el-form-item>
            <div v-if='task_tool=="behave"'>
              <el-form-item label="text" prop='text'><el-input v-model="ruleForm.text"></el-input></el-form-item>
              <el-form-item label="resourceId" prop='resourceId'><el-input v-model="ruleForm.resourceId"></el-input></el-form-item>
            </div>
            <div v-else='task_tool=="behave"'>
              <el-form-item label="element_id" prop='element_id'><el-input v-model="ruleForm.element_id"></el-input></el-form-item>
              <el-form-item label="index" prop='index'><el-input v-model="ruleForm.index"></el-input></el-form-item>
              <el-form-item label="xpath" prop='xpath'><el-input v-model="ruleForm.xpath"></el-input></el-form-item>
              <el-form-item label="uiautomator" prop='uiautomator'><el-input v-model="ruleForm.uiautomator"></el-input></el-form-item>
              <el-form-item label="acc" prop='accessibility_id'><el-input v-model="ruleForm.accessibility_id"></el-input></el-form-item>
              <el-form-item label="name" prop='attr_name'><el-input v-model="ruleForm.attr_name"></el-input></el-form-item>
              <el-form-item label="clazz" prop='clazz'><el-input v-model="ruleForm.clazz"></el-input></el-form-item>
              <el-form-item label="text" prop='text'><el-input v-model="ruleForm.text"></el-input></el-form-item>
              <el-form-item label="css" prop='css'><el-input v-model="ruleForm.css"></el-input></el-form-item>
            </div>
          </div>
          <el-form-item label="适用设备">
            <el-select v-model="ruleForm.device_id" placeholder="请选择手机设备,默认为通用" multiple collapse-tags :disabled="editflag">
              <el-option :label="device.name" :value="device.id" v-for="device in devices" :key="device.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateparam('ruleForm')" v-if="!editflag">立即创建</el-button>
            <el-button type="primary" @click="editerparam('ruleForm')" v-if="editflag">保存</el-button>
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>



  </div>
</template>



<script>
import {mapState} from 'vuex'

  export default {
    data() {
      return {
        parameterlist:[],
        belongpages:[],
        devices:[],
        task_tool:'',
        editflag:false,
        formflag:false,
        ruleForm: {
          name: '',
          type:'',
          value: '',
          belong_page:'',
          device_id:[],
          element_id:'',
          clazz:'',
          index:'',
          xpath:'',
          text:'',
          css:'',
          uiautomator:'',
          accessibility_id:"",
          attr_name:'',
          resourceId:'',  
        },
        rules:{
            name:[
                { required: true, message: '请输入参数名', trigger: 'blur' },
            ],
            type:[
                { required: true, message: '请选择参数类型', trigger: 'change' }
            ],
            value:[
                { required: true, message: '请输入参数值', trigger: 'blur' },
            ],
            belong_page:[
                { required: true, message: '请选择所属界面', trigger: 'change' }
            ],
        },
      }
    },
    props: ['projectid'],
    computed:{
        ...mapState({
          isParameterFlag:state => state.isParameterFlag,
        }),
    },
    mounted(){
            this.getparameter()
        },
    methods: {
        //修改模态flag
        modelflag(flag){   
          this.$store.commit('isParameterFlag',flag)
        },
        //获取参数
        getparameter(){
          // console.log(this.projectid)
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/parameter/get_parameters',
            data:_this.$qs.stringify({'project_id':_this.projectid}),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.task_tool = res.data.task_tool
              _this.belongpages=res.data.app_pages
              _this.parameterlist = res.data.app_pages.concat(res.data.app_elements.concat(res.data.app_input_parameters))
            }
          }).catch(function (error) {
            console.log(error)
          })
        },
        //css样式
        isCenter({row,column,rowIndex,columnIndex}){
            if(columnIndex==0 || columnIndex==4){
              return 'color:#7BAEE4;font-size:12px;letter-spacing:1px;font-weight:500;text-align: center;'
            }else{
              return 'color:#666;font-size:12px;letter-spacing:1px;font-weight:500;text-align: center;'
            }
        },
        isThead({row,column,rowIndex,columnIndex}){
            return 'color:#666;font-size:14px;letter-spacing:1px;font-weight:bold;text-align:center;'
        },
        //编辑修改
        editparame(id,index){
          this.ruleForm['device_id']=[]
          let _this=this
          this.editflag=true
          this.formflag=true
          let data = this.parameterlist[index]
          _this.ruleForm['project_id']=this.projectid
          _this.ruleForm['type']=data['type']
          _this.ruleForm['name']=data['name']
          _this.ruleForm['id']=id
          _this.ruleForm['device_id'].push(data['device_name'])
          if(data['type']=='element'){
            let elementvalue=data['value']
            console.log('1111',elementvalue['belong_page'])
            _this.ruleForm['belong_page']=elementvalue['belong_page'],
            _this.ruleForm['element_id']=elementvalue['element_id'],
            _this.ruleForm['clazz']=elementvalue['clazz'],
            _this.ruleForm['index']=elementvalue['index'],
            _this.ruleForm['xpath']=elementvalue['xpath'],
            _this.ruleForm['text']=elementvalue['text'],
            _this.ruleForm['css']=elementvalue['css'],
            _this.ruleForm['uiautomator']=elementvalue['uiautomator'],
            _this.ruleForm['accessibility_id']=elementvalue['accessibility_id'],
            _this.ruleForm['attr_name']=elementvalue['attr_name'],
            _this.ruleForm['resourceId']=elementvalue['resourceId']
          }else{
            _this.ruleForm['value']=data['value']
          }
        },
        //编辑保存
        editerparam(formName){
          let _this=this;
          console.log(_this.ruleForm)
          this.$refs[formName].validate((valid) => {
            if (valid) {
              _this.$axios({
                method:'post',
                url:'/api/parameter/app_parameter_update',
                data:_this.$qs.stringify(_this.ruleForm),
              }).then(function (res){
                // console.log(res);
                if(res.data.status==200){
                  _this.getparameter()
                  _this.resetForm()
                  return _this.$message.success(res.data.msg)
                }
              })
            } else {
              _this.$message.error('请填写红色输入框内容！')
              return false;
            }
          });
        },
        resetForm(){
          this.formflag=false
          this.editflag=false
          this.ruleForm={
              name: '',
              type:'',
              value: '',
              belong_page:'',
              device_id:[],
              element_id:'',
              clazz:'',
              index:'',
              xpath:'',
              text:'',
              css:'',
              uiautomator:'',
              accessibility_id:"",
              attr_name:'',
              resourceId:''}
        },
        //新增事件获取设备
        handlecreate(){
          this.formflag=true
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/devices/get_project_devices',
            data:_this.$qs.stringify({'project_id':_this.projectid}),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.devices=res.data.data
            }
          })
        },
        //删除参数
        deleteparame(id,type,index){
          console.log(id,type,index)
          let _this=this;
          this.$confirm('此操作将永久删除该命令, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$axios({
              method:'post',
              url:'/api/parameter/app_parameter_delete',
              data:_this.$qs.stringify({'type':type,'id':id}),
            }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.parameterlist.splice(index,1)
                return _this.$message.success(res.data.msg)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        //创建参数
        updateparam(formName){
          console.log(this.ruleForm)
          let _this=this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              _this.ruleForm['project_id']=_this.projectid
              _this.ruleForm['task_tool']=_this.task_tool
              _this.ruleForm['device_id']=JSON.stringify(_this.ruleForm['device_id'])
              let data = _this.ruleForm
              _this.$axios({
                method:'post',
                url:'/api/parameter/create_parameter',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  // _this.parameterlist=_this.parameterlist.concat(res.data.data)
                  _this.getparameter()
                  _this.resetForm()
                  return _this.$message.success(res.data.msg)
                }
              })
            }else {
              return this.$message.error('请填写红色输入框内容！');
            }
          });
        },

    },
    filters:{
      conditiontype:function(data){
        // console.log(data)
        switch (data){
          case 'page':
            return '页面'
          case 'element':
            return '控件'
          case 'input':
            return '输入值'
        }
      },
      conditionbelong:function(data){
        // console.log(data)
        if(data){
          return data
        }
        return '不适用'
      },
      conditionvalue:function(data,type){
        // console.log(data,type)
        if(type=='element'){
          let showdata =''
          for(var key in data){
            if(data[key] && key!='belong_page'){
              showdata += key+':'+data[key]+'\n'
            }
          }
          return showdata
        }
        return data
      },
    },

  };
</script>

<style scoped>
  .box{
    width: 60%;
    max-height: 85%;
    background-color: #fff;
    margin:0 auto;
    margin-top: 2%;
    margin-bottom:5%;
    padding: 1em;
    border-radius: 10px;
    overflow-y:auto;
  }
  .footer{
    padding: 0;
    margin-left: 0;
    height: 30px;
    text-align: center;
    padding-right: 5%;
    line-height: 60px;
  }
  .titleh3{
    text-align:center;
    margin-bottom:10px;
    color: #666;
  }
  .frombg{
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index:99;
  }
  .el-form{
    width: 50%;
    left: 25%;
    position: absolute;
    max-height: 100%;
    overflow-y:auto;
    /*border: 1px solid red;*/
    border-radius: 5px;
    background-color: #fff;
    z-index: 9999;
    top: 3%;
    box-shadow: 10px 10px 8px rgba(0, 0, 0, .12), 2px 2px 6px rgba(0, 0, 0, .24)
  }
  .el-form .el-input,.el-form .el-select{
    width: 70%;
  }
</style>