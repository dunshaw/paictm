<template>
    <div class="mydiv">
      <el-header style="min-height:80px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;margin-bottom:20px;">
          <el-breadcrumb-item :to="{ path: '/Systems' }" replace>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item >Appium管理</el-breadcrumb-item>
        </el-breadcrumb>
        <label class="mylabel">
          <el-button size="mini" @click="addAppium" icon="el-icon-plus" type="primary" plain>添加版本</el-button>
        </label>
      </el-header>

      <el-table :data="tableData" style="width: 100%" :cell-style="isCenter" :header-cell-style="tableHeaderColor" border>
        <el-table-column type="index" width="100">
        </el-table-column>
        <el-table-column label="Appium版本" style="width: 50%">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>




<script>



export default {
    name: 'appium',
      data(){
        return {
          msg:'appium!',
          tableData: [],
        }
      },
      mounted(){
        this.getappiums()
      },
      methods:{
        //回调样式
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==0){
              return 'font-weight: bold;color:#999;text-align:center;'
            }
          if(columnIndex==1){
              return 'font-weight: bold;color:#638f51;text-align:center;'
            }
          else{
            return 'text-align:center;'
          }
        },
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
          if (rowIndex === 0) {
            return 'font-weight: 500;text-align:center;background-color:#f2f3f8;'
          }
        },
        //获取数据
        getappiums(){
          console.log('gogogo;')
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/appium_version/select_all',
          }).then(function (res){
              console.log(res);
              if(res.data.status===200){
                _this.tableData = res.data.data
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
        //编辑appium
        handleEdit(index, row) {
          let _this=this;
          console.log(index, row);
          this.$router.push({
            name:'appiumedit',
            params:{
              appium_id:_this.tableData[index].id,
              appium_name:_this.tableData[index].name,
            }
          })
        },
        //删除appium
        handleDelete(index, row) {
          let _this=this;
          console.log(index, row);
            this.$confirm('此操作将删除Appium版本, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$axios({
                method:'post',
                url:'/api/appium_version/delete',
                data:_this.$qs.stringify({'id':_this.tableData[index].id})
            }).then(function (res){
              // console.log(res)
              if(res.data.status===200){
                _this.tableData.splice(index,1);
                return _this.$message.success("删除成功！");
              }
            }).catch(function (error) {
                console.log(error)
            })
          }).catch(() =>{
            this.$message({
              type: 'info',
              message: '已取消'
            }); 
          })
        },
        //新建appium
        addAppium(){
          this.$router.push({ path: '/Appium/add' })
        },
      },
    }
</script>
<style scoped>
 .table-th{
  text-align: center;
 }

 .mydiv{
  padding: 2em;
  padding-top: 0;
  
 }
</style>