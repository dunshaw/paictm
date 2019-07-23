<template>
    <div>
      <el-container>
        <el-header>
          <h3 style="text-align:center; font-size:22px;opacity: 0.8;letter-spacing:5px;">
            工程测试命令管理</h3>
           <!-- <el-button icon="el-icon-caret-bottom" circle size='mini' type="danger" @click="backto"></el-button> -->
           <el-page-header @back="backto"></el-page-header>
        </el-header>
        <div class="block">
          <!-- 选择修改语言 -->
          <div class="codeselect">
            <el-dropdown @command="codechange" trigger="click">
              <span class="el-dropdown-link">
                {{codeLang}}<i class="el-icon-setting el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="ruby">ruby</el-dropdown-item>
                <el-dropdown-item command="python">python</el-dropdown-item>
                <el-dropdown-item command="javascript">javascript</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <i class="el-icon-setting" style="color:#409eff;font-size:18px;"></i>
          <span class="demonstration">
            选择测试命令</span>
          <el-cascader :options="options" v-model="selectedOptions" @change="optionChange" size="mini" style="width:50%;display:block;margin-top:10px;margin-left:3%;">
          </el-cascader>
        </div>
        <i class="el-icon-setting" style="color:#409eff;font-size:18px;">
          <span class="demonstration" style="margin-left:8px;">编辑测试命令</span>
        </i>
        <el-main>
          <el-input placeholder="请输入命令" v-model="usercontent" suffix-icon="el-icon-edit" size="mini" style="width:50%;margin-top:20px;margin-left:3%;">
            <template slot="prepend">测试命令:</template>
          </el-input>

          <el-input :disabled="true" v-model="codehead" size="mini" style="width:50%;margin-top:15px;margin-left:3%;">
          </el-input>

          <el-input style="width:50%;margin-left:3%;" type="textarea" resize="none" rows="7"
            v-model="codemain" @focus="Edit_test_commands" >
          </el-input>
          <el-input v-model="codeend" :disabled="true" size="mini" style="width:50%;margin-left:3%;border-radius:0px;">
          </el-input>
        </el-main>
        <el-footer>
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit-outline" size="mini" round @click='confirm'>确定</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" round @click='handledelete'>删除</el-button>
          </el-button-group>
        </el-footer>
      </el-container>
    </div>
</template>


<script>
export default {
  name: 'CommandsControl',
  data(){
    return {
      msg:'CommandsControl',
      //语言
      codeLang:'',
      //工程id、name
      projectid:'',
      projectname:'',
      //工程工具
      tooltype:'',
      //选择的当前命令
      selectedOptions: ['new'],
      //显示的测试命令
      usercontent:'',
      //编辑框内容
      codehead: '',
      //是否有修改content
      inputflag:'',
      codemain:'',
      codeend:'',
      //所有命令
      options: [{
          value:'new',
          label:'新增命令',
        }],
    }
  },
  computed:{
    isCode () {
      return this.$store.state.isCodeLang　　//监听的code改变
    }
  },
  watch:{
    isCode(newcode,oldcode){
      // console.log(newcode,oldcode)
      this.get_test_commands(newcode,1)
    }
  },
  created(){
    this.getRouterData()
  },
  mounted(){
    this.get_test_commands(this.codeLang,0)
  },
  methods: {
    //接收route参数
    getRouterData(){
      this.projectid = this.$route.query.projectid
      this.projectname = this.$route.query.projectname
      this.codeLang = this.$store.state.isCodeLang
      this.tooltype = this.$route.query.task_tool
    },
    // 请求option数据
    optionChange(value,label){
      let _this=this;
      // console.log(value,label);
      if(value[0]=='new'){
        _this.codehead=''
        _this.codemain=''
        _this.usercontent=''
      }else{
        _this.$axios({
          method:'post',
          url:'/api/command/get_command_code',
          data:_this.$qs.stringify({'command_id':value[1],'task_tool':_this.tooltype}),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.codehead=res.data.code.start
            _this.codemain=res.data.code.code
            _this.codeend=res.data.code.end
            _this.usercontent=res.data.content
          }
        })
      }
    },
    //语言改变事件
    codechange(command){
      // console.log(command);
      this.codeLang=command;
      this.$store.commit('isCodeLang',this.codeLang)
    },
    //获取已有命令
    get_test_commands(codeLang,model){
      // console.log(codeLang,model)
      let _this=this;
      if(codeLang){
        _this.$axios({
          method:'post',
          url:'/api/command/get_commands',
          data:_this.$qs.stringify({'project_id':_this.projectid,'script_type':codeLang,'model':model,'task_tool':_this.tooltype}),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.options=res.data.data
            return _this.$message.success(res.data.msg);  
          }else{
            _this.options = [{
              value:'new',
              label:'新增命令',
            }]
            return _this.$message.error(res.data.msg); 
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    //编辑命令
    Edit_test_commands(){
      // console.log(this.usercontent)
      let usercontent = this.usercontent
      let _this=this;
      if(usercontent.length==0){
        return 
      }
      if(usercontent && _this.inputflag!=usercontent){
        _this.$axios({
            method:'post',
            url:'/api/command/get_code',
            data:_this.$qs.stringify({'content':usercontent,'script_type':_this.codeLang,'task_tool':_this.tooltype})
        }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.codehead=res.data.data
              _this.inputflag = usercontent
            }else{
              return _this.$message.error(res.data.msg);
            }
        })
      }else{
        return 
      } 
    },
    condition(codeLang,codenub){
      this.get_test_commands(codeLang,codenub)
      this.codehead=''
      this.codemain=''
      this.usercontent=''
    },
    //确定事件
    confirm(){
      let _this=this;
      if(this.codehead){
        if(this.tooltype == 'cucumber'){
          this.codeend = 'end'
        }
        let data = {
          'project_id':_this.projectid,
          'script_type':_this.codeLang,
          'task_tool':_this.tooltype,
          'content':_this.usercontent,
          'code':_this.codehead+'\n'+_this.codemain+'\n'+_this.codeend
        }
        console.log(data)
        if(this.selectedOptions[0]=='new'){
            // console.log('add');
            _this.$axios({
            method:'post',
            url:'/api/command/create',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.condition(_this.codeLang,2)
            }else{
              return _this.$message.error(res.data.msg); 
            }
          })
        }else{
          // console.log('edit')
          // console.log(_this.selectedOptions[1])
          data.command_id=_this.selectedOptions[1]
          _this.$axios({
            method:'post',
            url:'/api/command/update',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            // console.log(res);
            if(res.data.status==200){
                return _this.$message.success("命令修改成功!"); 
            }
          })
        }
      }else{
        return this.$message.error("请输入正确的测试命令!"); 
      }
    },
    //删除事件
    handledelete(){
      let _this=this;
      // console.log(this.selectedOptions[0])
      if(this.selectedOptions[0]=='new'){
        this.$message.error("请选择有效的命令删除!"); 
        return 
      }else{
        // console.log(this.selectedOptions[1])
        this.$confirm('此操作将永久删除该命令, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method:'post',
            url:'/api/command/delete',
            data:_this.$qs.stringify({'id':_this.selectedOptions[1]}),
          }).then(function (res){
            // console.log(res);
            if(res.data.status==200){
              _this.condition(_this.codeLang,3)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    backto(){
      this.$router.back(-1)
    },
  }
}
;
</script>

<style scoped>
  .el-container{
    width: 90%;
    /*outline: 1px solid red;*/
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    padding: 2em;

  }
  .demonstration{
    color:#409eff;
    font-size: 14px;
    margin-left: 3px;
    margin-right: 5px;
  }
  .block{
    height: 80px;
  }
  .el-main{
    /*outline: 1px solid skyblue;*/
    padding: 0;
  }
  .el-footer{
    line-height: 60px;
    padding-left: 3%;
  }
  .codeselect{
  float: right;
  text-align: right;
}
  .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;

  }
  .el-header{
    position: relative;
  }
  .el-header>>>button{
    position: absolute;
    right: 5px;
    top: 0;
  }
</style>
