<template>
  <div>
    <el-row>
      <el-input placeholder="请输入Appium版本名称" v-model="Vsname" style="width:30%;margin-bottom:10px;" size="small">
        <template slot="prepend">Appium版本名称</template>
      </el-input>
      <el-col>
          <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row>
              <el-table-column type="index"></el-table-column>
              <el-table-column v-for="(v,i) in master_user.columns" :prop="v.field" :label="v.title" :width="v.width" :key="v.id">
                  <template slot-scope="scope">
                      <span v-if="scope.row.isSet">
                          <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel[v.field]">
                          </el-input>
                      </span>
                      <span v-else>{{scope.row[v.field]}}</span>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                      <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
                          {{scope.row.isSet?'保存':"修改"}}
                      </span>
                      <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;">
                          删除
                      </span>
                      <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
                          取消
                      </span>
                  </template>
              </el-table-column>
          </el-table>
      </el-col>
      <el-col >
        <el-button type="success" plain @click="addMasterUser()" size="mini" >添加</el-button>
      </el-col>
    </el-row>
  </div>
</template>


<script>
    //主要内容
    export default {
        name: "app",
        data(){
          return {
            Vsname:"",
            master_user: {
                sel: null,//选中行   
                columns: [
                    { field: "type", title: "参数名", width: 120 },
                    { field: "addport", title: "适用系统", width: 150 },
                    { field: "user", title: "类别", width: 120 },
                    { field: "pwd", title: "例子", width: 220 },
                    { field: "info", title: "描述" }
                ],
                data: [],
            },
          }
        },
        methods: {
            //读取表格数据
            readMasterUser() {
                //根据实际情况，自己改下啊 
                // this.master_user.data.map(i => {
                //     i.id = generateId.get();//模拟后台插入成功后有了id
                //     i.isSet=false;//给后台返回数据添加`isSet`标识
                //     return i;
                // });
            },
            //添加账号
            addMasterUser() {
                let _this=this;
                for (let i of _this.master_user.data) {
                    if (i.isSet) return _this.$message.warning("请先保存当前编辑项");
                }
                let j = { id: 0, "type": "", "addport": "", "user": "", "pwd": "", "info": "", "isSet": true, "_temporary": true };
                _this.master_user.data.push(j);
                _this.master_user.sel = JSON.parse(JSON.stringify(j));
            },
            //修改
            pwdChange(row, index, cg) {
                //点击修改 判断是否已经保存所有操作
                let _this=this;
                for (let i of _this.master_user.data) {
                    if (i.isSet && i.id != row.id) {
                        this.$message.warning("请先保存当前编辑项");
                        return false;
                    }
                }
                //是否是取消操作
                if (!cg) {
                    if (!_this.master_user.sel.id) _this.master_user.data.splice(index, 1);
                    return row.isSet = !row.isSet;
                }
                //提交数据
                if (row.isSet) {
                    //项目是模拟请求操作  自己修改下
                    (function () {
                        let data = JSON.parse(JSON.stringify(_this.master_user.sel));
                        for (let k in data) row[k] = data[k];
                        _this.$message({
                            type: 'success',
                            message: "保存成功!"
                        });
                        //然后这边重新读取表格数据
                        _this.readMasterUser();
                        row.isSet = false;
                    })();
                } else {
                    _this.master_user.sel = JSON.parse(JSON.stringify(row));
                    row.isSet = true;
                }
            }
        }
    }
  </script>


<style scoped>
  

</style>