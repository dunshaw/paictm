<template>
    <div>
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Functions' }" >兼容性测试</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.project_name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>

<!--       <p>{{ $route.params.project_id }}</p>
      <p>{{ $route.params.project_name }}</p> -->


      <el-main>
        <h3 style="text-align:center;margin-bottom:10px;color:#333;">测试用例集</h3>
        <el-header style="margin:0;height:40px;width:95%;margin:0 auto;">
          <el-input v-model="search" size="mini" style="margin:0;height:40px;" placeholder="搜索用例集"/>
          <el-button size="mini" type="primary" plain @click="dialogFormVisible = true">新增测试用例集</el-button> 
        </el-header>
        <div style="width:95%;margin:0 auto;">
          <el-table :data="table" style="width: 100%" :show-header="false" size="small" :cell-style="isCenter" border stripe>
            <el-table-column :cell-style="isCenter" width="400">
              <template slot-scope="scope">
                <i class="el-icon-document"></i>
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column >
            <el-table-column align="right">
              <template slot-scope="scope">
                <el-button-group style="margin-right: 80px">
                  <el-button size="mini" type="warning" icon="el-icon-edit" round @click="handleRename(scope.row.id,scope.$index)">重命名</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-edit-outline" round @click="handleEdit(scope.row.id,scope.row.name,scope.row.script_type)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" round @click="handleDelete(scope.row.id,scope.$index)">删除</el-button>
                </el-button-group>
                <el-tag size="mini" style="margin-right:10px;">{{ scope.row.script_type }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>

      <el-dialog title="新增测试用例集" :visible.sync="dialogFormVisible" >
        <el-form :model="form" :rules="rules" ref="form" >
          <el-form-item label="用例集名称:" :label-width="formLabelWidth" prop="test_suit_name">
            <el-input v-model="form.test_suit_name" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="用例集语言:" :label-width="formLabelWidth" prop="script_type">
            <el-select v-model="form.script_type" placeholder="请选择用例集语言" size="mini">
              <el-option label="ruby" value="ruby"></el-option>
              <el-option label="python" value="python"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetForm('form')" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleAdd" size="mini">确 定</el-button>
        </div>
      </el-dialog>
        


        
    </div>

</template>




<script>
import {mapState} from 'vuex'

export default {

      data(){
        return {
          project_name:'',
          project_id:'',
          tableData: [],
          search: '',
          dialogFormVisible: false,
          form: {
            test_suit_name: '',
            script_type: '',
          },
          formLabelWidth: '120px',
          rules: {
            test_suit_name: [
              { required: true, message: '请输入用例集名称', trigger: 'blur' },
            ],
            script_type: [
              { required: true, message: '请选择用例集语言', trigger: 'change' }
            ],
          },
        }
      },
      created(){
        this.getRouterData()
      },
      computed:{
        table() {
          let _this = this;
          if (_this.search) {
            return this.tableData.filter(item=>{
                if(item.name.toLowerCase().includes(_this.search.toLowerCase())){
                    return item
                }
            });
          }
          return this.tableData 
        },
      },
      methods: {
        getRouterData(){
          this.project_name = this.$route.query.project_name
          this.project_id = this.$route.query.project_id
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/test_suit/get_project_test_suits',
              data:_this.$qs.stringify({'project_id':_this.project_id})
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.tableData=res.data.test_suit_list
              }else{
                return _this.$message.error(res.data.msg) 
              }
          })
        },
        //样式
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==0){
            return 'color:#999;padding-left:30px;font-size:14px;letter-spacing:1px;'
          }
        },
        //新增
        handleAdd(){
          this.$refs.form.validate((valid) => {
            let _this = this;
            if (valid) {
              let data = this.form;
              data['project_id'] = this.project_id;
              console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/test_suit/create',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData.push({'id':res.data.test_suit_id,'name':data.test_suit_name,script_type:data.script_type})
                  _this.resetForm('form')
                  return _this.$message.success(res.data.msg)
                }else{
                  return _this.$message.error(res.data.msg)
                }
              })
            } else {
              return _this.$message.error('请输入红色框内容!')
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields()
          this.dialogFormVisible=false
        },
        //删除
        handleDelete(id,$index) {
          console.log($index, id);
          this.$confirm('此操作将永久删除用例集, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let _this=this;
            let data = {'test_suit_id':id}
            console.log(data)
            _this.$axios({
              method:'post',
              url:'/api/test_suit/delete',
              data:_this.$qs.stringify(data),
            }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.tableData.splice($index,1);
                return _this.$message.success(res.data.msg)
              }else{
                return _this.$message.error(res.data.msg)
              }
            }) 
          }).catch(() => {
            return _this.$message.info('已取消删除')
          });
        },
        //重命名
        handleRename(id,$index) {
          console.log($index,id);
          this.$prompt('请输入新的用例集名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '新用例集名称不能为空！'
          }).then(({ value }) => {
              let _this=this;
              let data = {'test_suit_id':id,'test_suit_name':value}
              console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/test_suit/rename',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData[$index].name=value
                  return _this.$message.success(res.data.msg)   
                }else{
                  return _this.$message.error(res.data.msg)   
                }
              })
          }).catch(() => {
            return _this.$message.info('已取消')     
          })
        },
        //编辑事件，跳转
        handleEdit(id,name,lang){
          this.$router.push({
            name:'functiontestsuiteedit',
            path:'/Project/FunctionTestSuite/Edit',
            query:{
              suiteid:id,
              suitename:name,
              projectid:this.project_id,
              projectname:this.project_name,
              script_type:lang
            }
          })
        },
      },

    };
</script>
<style scoped>
  .el-input{
    width: 200px;
    margin-right: 100px;
  }
  .el-main{
    /*border: 1px solid red;*/
    border-radius: 4px;
    width:96%;
    margin:0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-height: 200px;
  }
</style>