<template>
  <div>
    <el-header style="height:30px;padding-left:5%;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item :to="{ path: '/Systems' }" replace>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item >执行设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
      
    <el-main>
      <h3 style="text-align:center;margin-bottom:10px;color:#666;">执行机列表</h3>
      <el-tooltip content="添加执行机." placement="top" >
        <el-button type="primary" icon="el-icon-plus" circle class="addbtn" size="mini" @click="adddata"></el-button>
      </el-tooltip>
      <el-table ref="form" :data="tableData" style="width: 90%;margin:0 auto;"  stripe :cell-style="isCenter" :header-cell-style="isThead">
        <el-table-column label="执行机名称" width="180">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top"
              padding='20px'>
              <h3 style="margin:5px;color:#f35626;text-align:center;">编辑名称</h3>
              <el-input v-model="scope.row.name" size="mini" suffix-icon="el-icon-edit" placeholder="请输入执行机名称">
                <template slot="prepend">{{scope.row.name}}</template>
              </el-input>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.name | condition}}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="执行机地址">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top"
              padding='20px'>
              <h3 style="margin:5px;color:#f35626;text-align:center;">编辑地址</h3>
              <el-input v-model="scope.row.computer_url" size="mini" suffix-icon="el-icon-edit" placeholder="请输入执行机地址">
                <template slot="prepend">{{scope.row.name}}</template>
              </el-input>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.computer_url | condition}}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="文件路径">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top"
              padding='20px'>
              <h3 style="margin:5px;color:#f35626;text-align:center;">编辑路径</h3>
              <el-input v-model="scope.row.file_path" size="mini" suffix-icon="el-icon-edit" placeholder="请输入执行机路径">
                <template slot="prepend">{{ scope.row.name }}</template>
              </el-input>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.file_path | condition }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="执行机脚本">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" circle v-show="scope.row.id != ''" size="mini" @click="downloads(scope.row.id)"></el-button>
          </template>
        </el-table-column>
        <el-table-column width="100" label="保存 / 删除">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" circle size="mini" @click="controls(scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handledelete(scope.row.id,scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>


      
  </div>

</template>

<script>
export default {
  name: 'Computers',
    data(){
      return {
        tableData: [],
      }
    },
    mounted(){
        this.getcomputer()
    },
    methods:{
      //css样式
      isCenter({row,column,rowIndex,columnIndex}){
          return 'color:#3A99FB;font-size:12px;letter-spacing:1px;font-weight:500;text-align: center;'
      },
      isThead({row,column,rowIndex,columnIndex}){
          return 'color:#999;font-size:14px;letter-spacing:1px;font-weight:bold;text-align:center;'
      },
      // 获取执行机数据
      getcomputer(){
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/computer/get_computers',
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.tableData=res.data.computer_list
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      controls(index){
        if(this.tableData[index].id){
          // 更新
          this.handlesave(this.tableData[index])
        }else{
          // 新建
          this.handlecreate(this.tableData[index],index)
        }
      },
      // 更新
      handlesave(newdata){
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/computer/computer_update',
          data:_this.$qs.stringify(newdata),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            return _this.$message.success(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      // 删除
      handledelete(id,index){
        let _this=this;
        if(id){
          let _this=this;
          this.$confirm('此操作将永久删除该执行机, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$axios({
            method:'post',
            url:'/api/computer/computer_delete',
            data:_this.$qs.stringify({'id':id}),
            }).then(function (res){
              if(res.data.status==200){
                _this.tableData.splice(index,1)
                return _this.$message.success(res.data.msg)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });          
        }else{
         _this.tableData.splice(index,1)
        }
        
      },
      // 添加
      adddata(){
        for(let i of this.tableData){
          if(i.name=='' || i.computer_url=='' || i.file_path==''){
            return this.$message.error('请编写完已有的执行机内容！')
          }
        }
        let data = {'id':'','name':'','computer_url':'','file_path':''}
        this.tableData.push(data)
        return this.$message.success('请在新列表中输入执行机内容！')
      },
      // 保存
      handlecreate(newdata,index){
        console.log(newdata)
        for(var key in newdata){
          if(newdata[key]=='' && key!='id'){
            return this.$message.error('请填写执行机内容！')
          }
        }
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/computer/computer_create',
          data:_this.$qs.stringify(newdata),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.getcomputer()
            return _this.$message.success(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      // 下载
      downloads(id){
        console.log(id);
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/computer/computer_task_file_download',
          data:_this.$qs.stringify({'computer_id':id}),
          responseType: 'blob',
        }).then(function (res){
          // console.log(res);
          if(res.data){
            let url = window.URL.createObjectURL(new Blob([res.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', 'actuator.zip')
            document.body.appendChild(link)
            link.click()
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
    },
    filters:{
      condition:function(data){
        // console.log(data)
        if(data){
          return data
        }
        return '请编辑执行机信息!!'
      },
    },
  };
</script>
<style scoped>
  .el-main{
    width: 90%;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-top:10px;
    position: relative;
  }
  .addbtn{
    position: absolute;
    right:8%;
    top:10px;
  }
</style>