<template>
    <div>
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Functions' }" >兼容性测试</el-breadcrumb-item>
          <el-breadcrumb-item>Appium 配置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
<!--       <p>{{ $route.params.project_id }}</p>
      <p>{{ $route.params.project_name }}</p> -->


      <el-main class="mainbox">
        <el-header style="margin:0;height:40px;width:95%;margin:0 auto;">
          <el-button size="mini" type="primary" plain @click="handleEdit(null,null)">新增</el-button> 
          <el-button icon="el-icon-caret-left" circle size='mini' type="" @click="backto" style='float: right;
'></el-button>
        </el-header>
        <div style="width:95%;margin:0 auto;">
          <el-table :data="tableData" style="width: 100%" :show-header="false" size="small" :cell-style="isCenter" border stripe>
            <el-table-column :cell-style="isCenter" width="400">
              <template slot-scope="scope">
                <i class="el-icon-bell" style="color:#409EFF;"></i>
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column >
            <el-table-column align="right">
              <template slot-scope="scope">
                <el-button-group style="margin-right: 80px">
                  <el-button size="mini" type="warning" icon="el-icon-edit" round @click="handleRename(scope.row.id,scope.$index)">重命名</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-edit-outline" round @click="handleEdit(scope.row.id,scope.row.name)">编辑</el-button>
                  <el-button size="mini" type="info" icon="el-icon-printer" round @click="handleCopy(scope.row.id,scope.row.name)">复制</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" round @click="handleDelete(scope.row.id,scope.$index)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
        


        
    </div>

</template>




<script>
import {mapState} from 'vuex'



export default {
    name: 'functionappium',
      data(){
        return {
          project_name:'',
          project_id:'',
          tableData: [],
        }
      },
      created(){
        this.getRouterData()
      },
      mounted(){
        this.get_appiums()
      },
      methods: {
        //接收路由传参
        getRouterData(){
          this.project_name = this.$route.query.project_name
          this.project_id = this.$route.query.project_id
        },
        //样式
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==0){
            return 'color:#666;padding-left:30px;font-size:14px;letter-spacing:1px;font-weight:500;'
          }
        },
        //获取工程已有appium配置
        get_appiums(){
          let _this=this;
          console.log(this.project_id)
          let data={'project_id':this.project_id}
          _this.$axios({
            method:'post',
            url:'/api/appium/get_appium_list',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.tableData=res.data.data
            }
          })
        },
        //重命名
        handleRename(id,$index) {
          this.$prompt('请输入新Appium名称', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: 'Appium名称不能为空！'
          }).then(({ value }) => {
              let _this=this;
              let data = {'deploy_id':id,'deploy_name':value}
              _this.$axios({
                method:'post',
                url:'/api/deploy/deploy_rename',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                // console.log(res);
                if(res.data.status==200){
                  _this.tableData[$index].name=value
                  return _this.$notify.success(res.data.msg);
                }else{
                  return _this.$message.error(res.data.msg);  
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });       
          })
        },
        //删除
        handleDelete(id,$index) {
          let _this=this;
          this.$confirm('此操作将永久删除该配置, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let data = {'deploy_id':id}
            console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/deploy/deploy_delete  ',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData.splice($index,1);
                  return _this.$message.success(res.data.msg);  
                }else{
                  return _this.$message.error(res.data.msg);  
                }
              }) 
          }).catch(() => {
              return _this.$message.info('已取消删除');  
          });
        },
        //复制事件
        handleCopy(id,name){
          let _this=this;
          this.$prompt('请输入新Appium配置名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '配置名不能为空！'
          }).then(({ value }) => {
              let data = {'deploy_id':id,'deploy_name':value}
              console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/deploy/deploy_copy',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData.push(res.data.data);
                  return _this.$message.success(res.data.msg);  
                }else{
                  return _this.$message.error(res.data.msg); 
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消复制'
            });       
          })
        },
        //新增和编辑
        handleEdit(id,name){
          console.log(id,name)
          //路由传参,跳转
          this.$router.push({
            name:'functionappiumdetails',
            path:'/Project/FunctionAppium/Details',
            query:{
              appium_config_id:id,
              appium_config_name:name,
              project_id:this.project_id,
              project_name:this.project_name
            }
          })
        },
        backto(){
          this.$router.back(-1)
        },
      },
      
    };
</script>
<style scoped>
.mainbox{
   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
   width:90%;
   margin:0 auto;

}

</style>