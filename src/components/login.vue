<template>
    <div class="login_container">
      <div class="login_box">
          <!-- 头像 -->
          <div class="header">
              <img src="../assets/微信图片_20200619193823.jpg" alt="">
          </div>
         <!-- 表单 -->
                  <el-form  ref="loginFormRef" label-width="0px" class="login_form" :model="form" :rules="loginRules" >
                      <!-- 用户名 -->
               <el-form-item  prop="username">
               <el-input  prefix-icon="el-icon-user" v-model="form.username"></el-input>
               </el-form-item>
               <!-- 密码 -->
               <el-form-item   prop="password">
               <el-input  prefix-icon="el-icon-lock" v-model="form.password" type="password"></el-input>
              </el-form-item>
              <!-- 按钮 -->
                 <el-form-item  class="btns">
             <el-button type="success" @click="ringLoginForm">登录</el-button>
            <el-button type="warning" @click="resetLoginForm" >重置</el-button>
              </el-form-item>
         </el-form>
      </div>
    </div>
</template>
<script>
    export default {
data() {
    return {
        // 登录表单的数据对象
        form:{
         username:'',
          password:''
        },
        // 表单验证规则对象
       loginRules:{
        //验证用户名
           username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '请输入的长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        //验证密码
          password: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 6, max: 10, message: '请输入的长度在 6 到 10 个字符', trigger: 'blur' }
          ],
        },
    }

},
methods: {
    // 重置按钮函数
    resetLoginForm(){
    //  console.log(this);
    this.$refs.loginFormRef.resetFields()
    },
    // 登录前的表单预验证
    ringLoginForm(){
        this.$refs.loginFormRef.validate( async valid=>{
            // 判断是否符合规则
        if(!valid) return;
      const {data:res}= await  this.$http.post('login',this.form);
     if (res.meta.status!==200) {
       return this.$message.error('登录失败,请输入正确的账号或密码 !');
     }
     this.$message.success('登录成功！');
        console.log(res);
        // 传递token在sessionStorage里面
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.push('/home');
    });
     
    }
},
 }
</script>
<style lang="less" scoped>
    .login_container {
        background-color: #fff;
        height: 100%;
    }
    
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #2b4b6b;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -225px;
        margin-top: -150px;
        .header {
            height: 150px;
            width: 150px;
            border-radius:50%;
            border:1px solid #ccc;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            // padding: 10px;
            img {
                width: 100%;
                height: 100%;
                border-radius:50%;
            }
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
    box-sizing: border-box;
    }
    .btns {
        display: flex;
        justify-content: flex-end
    }
</style>