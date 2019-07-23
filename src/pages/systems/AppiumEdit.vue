<template>
  <div>
    <el-header style="height:10px;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item :to="{ path: '/Systems' }" replace>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Appium' }" replace>Appium管理</el-breadcrumb-item>
        <el-breadcrumb-item >编辑版本</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <div class="template-manage">
      <div class="temp-title">
        <el-input placeholder="请输入Appium版本名称" v-model="Vsname" style="width:30%;margin-bottom:10px;" size="mini" disabled>
          <template slot="prepend">Appium版本</template>
        </el-input>
        <div style="width:30%;text-align:right;">
          <el-button size="mini" type="warning" icon="el-icon-sort" @click="exportAppium" round>导出</el-button>
          <el-button size="mini" type="success" icon="el-icon-circle-check-outline" @click="updateTemp" round>保存</el-button>
        </div>
      </div>
      <div class="temp-list">
        <el-table class="template-list" :data="tempList.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%" size="mini">
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column label="参数名">
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span>{{ scope.row.name }}</span>
              </div>
              <div v-else>
                <el-input v-model="scope.row.name" placeholder="参数名称"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="适用类型">
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span>{{ scope.row.apply_system }}</span>
              </div>
              <div v-else>
                <el-select v-model="scope.row.apply_system" placeholder="类型">
                  <el-option v-for="item in osType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="类别">
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span>{{ scope.row.essential | conditions }}</span>
              </div>
              <div v-else>
                <el-select v-model="scope.row.essential" placeholder="必填">
                  <el-option v-for="item in essential" :key="item.value" :label="item.label " :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="例子">
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span>{{ scope.row.example }}</span>
              </div>
              <div v-else>
                <el-input v-model="scope.row.example" type="textarea" rows="4" resize="none"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="描述">
            <template slot-scope="scope">
              <div v-if="!scope.row.editing">
                <span>{{ scope.row.desc }}</span>
              </div>
              <div v-else>
                <el-input v-model="scope.row.desc" type="textarea" rows="4" resize="none"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="operate-groups">
                <el-button type="primary" size="mini" v-if="!scope.row.editing" icon="el-icon-edit-outline"
                  @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
                <el-button type="primary" size="mini" v-if="scope.row.editing" icon="el-icon-success"
                  @click="handleSave(scope.$index, scope.row)">确定
                </el-button>
                <el-button size="mini" type="danger" v-if="!scope.row.editing" icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row,scope.row.id)">删除
                </el-button>
                <el-button size="mini" type="warning" v-if="scope.row.editing" icon="el-icon-warning"
                  @click="handleCancel(scope.$index, scope.row)">取消
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-footer style="text-align:right;height:50px;margin-top:20px;">
          <el-button size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="addTemp" round>新增参数</el-button>
        </el-footer>
      </div>
      <el-pagination v-if="tempList.length>pagesize"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="tempList.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      Vsname:'',
      Vsid:'',
      newdata:false,
      tempList: [],
      pagesize:10,
      currentPage:1,
      osType: [{
        label: 'Ios特有',
        value: 'Ios特有'
      }, {
        label: 'Android特有',
        value: 'Android特有'
      }, {
        label: 'IOS,ANDROID共有',
        value: 'IOS,ANDROID共有'
      }],
      essential: [{
        label: '必填',
        value: 't'
      },{
        label: '选填',
        value: 'f'
      }]
    }
  },
  created () {
    this.getRouterData()
  },
  methods: {
    //修改时获取信息
    getRouterData(){
      this.Vsname= this.$route.params.appium_name
      this.Vsid = this.$route.params.appium_id
      console.log(this.Vsname,this.Vsid);
      let _this=this;
      _this.$axios({
          method:'post',
          url:'/api/appium_version/select',
          data:_this.$qs.stringify({id:_this.Vsid})
      }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.tempList = res.data.data
          }
      })
    },
    //修正index
    indexMethod(index){
      return (this.currentPage-1)*this.pagesize+index+1;
    },
    //分页函数
    handleSizeChange(val) {
      console.log('size',val)
      this.pagesize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val){
      console.log('Current',val)
      let _this=this
      _this.currentPage = val;
    },
    // 编辑
    handleEdit ($index, row) {
      let realIndex = this.indexMethod($index)-1
      this.$set(this.tempList[realIndex], 'editing', true)
      this.newdata=false
    },
    // 保存
    handleSave ($index, row) {
      let realIndex = this.indexMethod($index)-1
      if(this.condition(realIndex)){
        this.$set(this.tempList[realIndex], 'editing', false)
      }else{
        return this.$message.warning("请先填写完成编辑项！")
      }  
    },
    // 判断空值
    condition(index){
      let data = this.tempList[index];
      if (!data.name || !data.apply_system || !data.essential){
        return false
      }
      return true
    },
    // 取消
    handleCancel ($index, row) {
      // console.log(this.tempList)
      let realIndex = this.indexMethod($index)-1
      console.log(realIndex)
      this.$set(this.tempList[realIndex], 'editing', false)
      if(this.newdata){
        this.tempList.splice(realIndex, 1)
      }
      if(this.currentPage > Math.ceil((this.tempList.length)/this.pagesize)){
        this.handleCurrentChange(Math.ceil((this.tempList.length)/this.pagesize)) 
      }
    },
    // 新增一条模板数据
    addTemp () {
      let lastpage = Math.ceil((this.tempList.length+1)/this.pagesize)
      this.handleCurrentChange(lastpage)
      this.newdata=true;
      this.tempList = this.tempList || []
      for (let i of this.tempList) {
          if (i.editing) {return this.$message.warning("请先保存当前编辑项");}
      }
      this.tempList.push({
        name: '',
        apply_system: '',
        essential: '',
        example:'',
        desc:'',
        editing: true
      })
    },
    // 删除参数
    handleDelete ($index, row,id) {
      console.log(id)
      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _this=this;
        _this.$axios({
            method:'post',
            url:'/api/appium/appium_param_delete',
            data:_this.$qs.stringify({id:id})
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            let realIndex = _this.indexMethod($index)-1
            _this.tempList.splice(realIndex, 1)
            if(_this.currentPage > Math.ceil((_this.tempList.length)/_this.pagesize)){
              _this.handleCurrentChange(Math.ceil((_this.tempList.length)/_this.pagesize)) 
            }
            return _this.$message.success(res.data.msg) 
          }else{
            return _this.$message.error(res.data.msg);
          }
        })
      }).catch((data) => {
        return this.$message.info(data);
      })
    },
    // 上传保存
    updateTemp(){
      console.log(this.tempList)
      if(this.tempList.length==0){
        return this.$message.error("请至少添加一个参数！");
      }

      let data={
        'appium_data':JSON.stringify(this.tempList),
        'appium_name':this.Vsname,
        'appium_version_id':this.Vsid
      }
      console.log(data)
      let _this=this;
      _this.$axios({
          method:'post',
          url:'/api/appium/update',
          data:_this.$qs.stringify(data)
      }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            return _this.$message.success("保存成功！");
          }
      })
    },
    // 导出
    exportAppium(){
      let _this=this;
      _this.$axios({
        method:'post',
        url:'/api/appium/export',
        data:_this.$qs.stringify({'appium_version_id':_this.Vsid}),
        responseType: 'blob',
      }).then(function (res){
        // console.log(res);
        if(res.data){
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', _this.Vsname+'.yml')
          document.body.appendChild(link)
          link.click()
        }
      }).catch(function (error) {
        console.log(error)
      })
    },
  },
  filters:{
    conditions:function(con){
      let data 
      if(con.toLowerCase() == 't'){
        data = '必填'
      }else{
        data = '选填'
      }
      return data
    }
  },
};
</script>

<style scoped lang="scss">
.template-manage {
  padding:1em;
  margin: 0 auto;
  .temp-title {
    display: flex;
    justify-content: space-between;
    height: 30px;
    margin-top: 20px;
  }
  .el-table {
    background-color: #f7f7f7;
    margin-top: 20px;
    th>.cell {
      text-align: center !important; 
   }
  }
  .operate-groups {
    display: flex;
    justify-content: flex-start;
    .upAndDown {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      .el-button--mini {
        padding: 0;
        width: 30px;
        margin-left: 0;
      }
      .down {
        margin-top: 2px;
      }
    }
  }
}
.el-pagination{
  margin:1em;
  float:right;
}
</style>