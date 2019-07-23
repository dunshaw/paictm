<template>
    <div>
      <el-header style="height:10px;padding-left:5%;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Systems' }" replace>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item >工程管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-container>
        <el-table :data="tableData" style="width: 100%" :cell-style="isCenter" size="mini">
          <el-table-column type="index" width="100">
          </el-table-column>
          <el-table-column label="工程名" style="width: 20%">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.project_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所有者" style="width: 20%">
            <template slot-scope="scope">
              <el-tag size="medium">{{ scope.row.user_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row.project_id,scope.row.user_name,scope.$index)" icon="el-icon-edit">更改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.project_id,scope.$index)" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <transition enter-active-class="fadeInLeft" leave-active-class="fadeOutLeft" :duration='{enter:800, leave: 800}'>
          <el-form :inline="true" :model="formInline" class="animated" v-show="fromshow" size="small">
            <el-form-item label="工程名">
              <el-input v-model="formInline.project_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="管理员">
              <el-select v-model="owner" @change="changes=true">
                <el-option
                    v-for="item in formInline.user" :key="item.id" :value="item.user_name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-left:20px;">
              <el-button type="primary" @click="updataEn(formInline.project_id,owner)">确定</el-button>
              <el-button type="info" @click="close">取消</el-button>
            </el-form-item>
          </el-form>
        </transition>
      </el-container>  
    </div>
</template>




<script>
import {mapState} from 'vuex'



export default {
    name: 'engineering',
      data(){
        return {
          msg:'engineering!',
          fromshow:false,
          tableData:[],
          formInline:{},
          owner:'',
          changes:false,
          index:'',
        }
      },
      mounted(){
        this.getprojectlist()
      },
      methods: {
        getprojectlist(){
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/authoritie/select_all',
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.tableData = res.data.data
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==1){
              return 'font-weight: bold;color:#999;'
            }
          },
        handleEdit(projectid,owner,index) {
          let _this=this;
          _this.owner = owner;
          _this.index = index;
          _this.$axios({
              method:'post',
              url:'/api/authoritie/select',
              data:_this.$qs.stringify({'project_id':projectid})
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.formInline = res.data.data
                _this.fromshow=true
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
        updataEn(projectid,owner){
          let _this=this;
          if(_this.changes){
              _this.$axios({
                  method:'post',
                  url:'/api/authoritie/update',
                  data:_this.$qs.stringify({'project_id':projectid,'user':owner,'olduser':_this.tableData[_this.index].user_name})
              }).then(function (res){
                console.log(res)
                if(res.data.status==200){
                  _this.getprojectlist()
                  return _this.$message.success(res.data.msg); 
                }else{
                  return _this.$message.error(res.data.msg);
                }
              }).catch(function (error) {
                  console.log(error)
              })
          }
          _this.fromshow=false
          
        },
        close(){
          this.fromshow=false
          this.changes=false
        },
        handleDelete(id, index) {
          console.log(id, index);
          let _this = this;
          this.$confirm('此操作将永久删除该工程, 是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$axios({
              method:'post',
              url:'/api/project/delete',
              data:_this.$qs.stringify({'project_id':id}),
            }).then(function (res){
              console.log(res.data);
              if(res.data.status==200){
                _this.tableData.splice(index, 1)
                return _this.$message.success(res.data.msg); 
              }
            }).catch(function (error){
              return _this.$message.error(error); 
            })
          }).catch((err) => {
            return this.$message.info('已取消！'); 
          })
        }
      },
    };
</script>



<style scoped>
  .el-container{
    border: 1px #eee solid;
    padding: 3em;
    text-align: center;
    margin: 2em;
  }
  .el-tag{
    cursor: pointer;
  }

  .el-form{
    width: 80%;
    height: 100px;
    position: fixed;
    left: 10%;
    padding-top: 50px;
    border: 1px solid rgba(64,158,255,.5);
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 3px 3px rgba(64,158,255,.1);
  }

</style>