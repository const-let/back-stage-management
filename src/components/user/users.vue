<template>
    <div>
      <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

<el-card >
<!-- 搜索与添加 -->
 
  <el-row :gutter="22">
      <el-col :span="12"> 
          <el-input placeholder="请输入内容" @clear="getUserList" clearable v-model="queryinfo.query" >
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
    </el-input>
  </el-col>
       <el-col :span="10">
           <el-button type="primary" plain @click="addVisible=true">添加用户</el-button>
       </el-col>
  </el-row>

    <!-- 用户列表区域 -->
    <el-table :data="userlist" border  stripe>
      <el-table-column type="index"></el-table-column>
     <el-table-column  label="姓名" prop="username"></el-table-column>
       <el-table-column  label="邮箱" prop="email"></el-table-column>
       <el-table-column  label="电话" prop="mobile"></el-table-column>
       <el-table-column  label="角色" prop="role_name"></el-table-column>
          <el-table-column  label="状态" prop="mg_state">
            <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"  active-color="#13ce66" @change="userStateChange(scope.row)"></el-switch>
            </template>
          </el-table-column >
               <el-table-column  label="设置" width="180px">
                 <template slot-scope="scope">
                   <!-- 修改按钮 -->
                     <el-tooltip  effect="dark" content="修改" placement="top" :enterable="false">
                     <el-button type="success" icon="el-icon-edit" circle size="small" @click="show(scope.row.id)"></el-button>
                  </el-tooltip>
                 <!-- 分配角色按钮 -->
                   <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning"  icon="el-icon-share"  circle size="small" ></el-button>
                  </el-tooltip>
                <!-- 删除按钮 -->
                 <el-tooltip  effect="dark" content="删除" placement="top" :enterable="false">
                      <el-button  type="danger"  icon="el-icon-delete"  circle size="small" @click="open(scope.row.id)"></el-button>
                  </el-tooltip>
                 </template>
               </el-table-column>
    </el-table>


    <!-- 分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1,2,5,10]"
      :page-size=" queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
   
   <!-- 添加用户的对话框 -->
     <el-dialog
  title="请添加用户"
  :visible.sync="addVisible"
  width="50%" @close="addDialog">
  <!-- 内容主体区域 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model=" addForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model=" addForm.password"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model=" addForm.email"></el-input>
  </el-form-item>
  <el-form-item label="手机" prop="mobile">
    <el-input v-model=" addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible=false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>

<!-- 修改用户的对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="edVisible"
  width="50%" @close="editClose">
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username" >
    <el-input v-model="editForm.username" :disabled="true"></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email" >
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机" prop="mobile" >
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="edVisible= false">取 消</el-button>
    <el-button type="primary" @click="editUserinfo">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data() {
      // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
      return {
        // 获取用户列表的参数对象
       queryinfo:{
          query:'',
          // 当前的页数
        pagenum:1,
        // 当前每页面显示多少数据
        pagesize:5 
       },
       userlist:[],
       total:0,
      //  控制用户的对话框的显示与隐藏
       addVisible:false,
      //  添加用户的表单数据
       addForm:{
         username:'',
         password:'',
         email:'',
         mobile:''
       },
      //  添加表单的验证对象
       addFormRules:{
         username:[
               { required: true, message: '请输入登录用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '请输入的长度在 3 到 10 个字符', trigger: 'blur' }
       ],
           password: [
            { required: true, message: '请输入密码', trigger:'blur' },
            { min: 6, max: 10, message: '请输入的长度在 6 到 10 个字符', trigger: 'blur' }
          ],
          email:[
             { required: true, message: '请输入邮箱', trigger:'blur' },
             {validator:checkEmail ,trigger: 'blur'}
          ],
          mobile:[
              { required: true, message: '请输入手机号码', trigger:'blur' },
              {validator:checkMobile ,trigger: 'blur'}
          ]
       },
          edVisible:false,
          // 查询用户对象信息
          editForm:{
          },
          // 修改表单的验证规则
        editFormRules:{  
           username:[
               { required: true, message: '请输入登录用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '请输入的长度在 3 到 10 个字符', trigger: 'blur' }
           ],
          email:[
             { required: true, message: '请输入邮箱', trigger:'blur' },
             {validator:checkEmail ,trigger: 'blur'}
          ],
          mobile:[
              { required: true, message: '请输入手机号码', trigger:'blur' },
              {validator:checkMobile ,trigger: 'blur'}
          ]}
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList(){
       const {data:res}=await this.$http.get('users',{params:this.queryinfo})
       console.log(res);
       if(res.meta.status!==200) return this.$message.error('获取用户列表失败!')
               this.userlist=res.data.users
                 this.total=res.data.total
      },
      // 监听选择每页面显示多少数据
      handleSizeChange(newSize){
      //  console.log(newSize) 
       this.queryinfo.pagesize=newSize
       this.getUserList()
      },
      // 监听改变页码改变的事件
      handleCurrentChange(newPage){
          //  console.log(newPage)
           this.queryinfo.pagenum=newPage
           this.getUserList()
      },
      // 监听状态按钮的状态改变
    async userStateChange(userinfo){
 const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
 if(res.meta.status!==200){
   userinfo.mg_state=!userinfo.mg_state
   return  this.$message.error('更新用户状态失败')
 } 
 this.$message.success('更新用户状态成功')
      },
      // 监听添加用户名的对话框关闭
      addDialog(){
          this.$refs.addFormRef.resetFields()
      },
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          // 添加进去
        const {data:res} = await this.$http.post('users',this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addVisible = false
        // 重新获取用户列表数据
        this.getUserList()
        })
      },
     async show(id){
      const {data:res}= await this.$http.get('users/'+id)
      if(res.meta.status!==200){
        return this.$message.error('查询用户信息失败')
      }
      this.editForm=res.data
      this.edVisible=true
      },
      editClose(){
        this.$refs.editFormRef.resetFields()
      },
      // 修改的提交
      editUserinfo(){
     this.$refs.editFormRef.validate(async valid=>{
       if(!valid) return
          //发起修改用户的请求
       const {data:res}= await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
  
      if(res.meta.status!==200){
       return  this.$message.error('更新用户状态失败')
          } 
          this.edVisible = false
          this.getUserList()
          this.$message.success('更新用户状态成功')
         })
        },
        // 删除按钮
       async open(id){
    const config= await this.$confirm('将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => {err}); 
          if (config!=='confirm') {
           return this.$message.info('已取消删除')
          }   
       const {data:res}  =await this.$http.delete('users/'+id)
       if(res.meta.status!==200){
         return this.$message.error('删除用户失败')
       }
       this.$message.success ('删除用户成功')
       this.getUserList()
        }
      }
    }
</script>
<style lang="less" scoped>
  .el-table {
    margin-top: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
</style>
