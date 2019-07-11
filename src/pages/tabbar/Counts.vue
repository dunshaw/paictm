<template>
  <div>
    <el-header style="height:30px;padding-left:5%;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item >用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-container>
      <el-table :data="tableData" style="width: 100%" stripe :cell-style="isCenter" :header-cell-style="isThead">
        <el-table-column label="用户名" style="width: 20%">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权限" style="width: 50%">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="300"
              padding= '20px'
              @show="closes(scope.$index)"
              v-model="scope.row.visible">
              <p>请选择您想要修改的用户权限？</p>
              <div style="text-align: center; margin: 10px">
                <el-tag type="danger" size="mini" @click="handleEdit(scope.$index, 'superadmin')">超级管理员</el-tag>
                <el-tag type="warning" size="mini" @click="handleEdit(scope.$index, 'admin')">管理员</el-tag>
                <el-tag type="text" size="mini" @click="handleEdit(scope.$index, 'tester')">测试员</el-tag>
              </div>
            <el-tag size="medium" :type="fication(scope.row.role)" slot="reference">{{ scope.row.role }}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
  </div>
</template>




<script>
import Switch from '../../components/Switch'


export default {
    name: 'Counts',
      data(){
        return {
          msg:'Counts!',
          tableData: [],
        }
      },
      components:{
        myswitch:Switch,
      },
      mounted(){
        // console.log('mounted')
        this.getuserlist()
      },
      methods: {
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
        //获取所有的用户数据
        getuserlist(){
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/users/select_all',
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                  _this.tableData = res.data.data
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
        //颜色分类
        fication(role){
          // console.log(role)
          if(role==='admin'){
            return 'warning'
          }else if(role==='superadmin'){
            return 'danger'
          }else{
            return ''
          }
        },
        handleEdit(index, type) {
          let _this = this;
          if(_this.tableData[index].role===type){
            _this.tableData[index].visible=false
            return;
          }
          _this.tableData[index].role=type
          _this.tableData[index].visible=false
          let data = {
              name: _this.tableData[index].name,
              id:_this.tableData[index].id,
              role: type
          };
          _this.myupdate('/users/update',_this.$qs.stringify(data))
        },
        handleDelete(index, row){
          let _this=this;
          // console.log(_this.tableData[index].id);
          let data = {
              name: _this.tableData[index].name,
              id:_this.tableData[index].id,
          };
          this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              _this.myupdate('/users/delete',_this.$qs.stringify(data))
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        closes(index){
          for(var i=0;i<this.tableData.length;i++){
            if(i!=index){this.tableData[i].visible=false}
          }
        },
        myupdate(url,data){
          let _this = this;
          _this.$axios({
            method:'post',
            url:'/api'+url,
            data:data,
          }).then(function (res){
              // console.log(res);
              if(res.data.status==200){
                  _this.getuserlist()
                  return _this.$message.success(res.data.msg)
              }else{
                return _this.$message.error(res.data.msg)
              }
          })
        },
      },
    };
</script>
<style scoped>
  .el-container{
    border: 1px #eee solid;
    padding: 2em;
    text-align: center;
    margin: 2em;
    width: 90%;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 10px;
  }
  .el-tag{
    cursor: pointer;
  }

</style>
