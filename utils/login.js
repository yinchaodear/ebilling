let API = require('../config/api')
const util = require('../utils/util');
const Toast =require("../utils/Toast")
const router= require("../utils/router")
const LOGINAPI = '/rest/customer/login'
const SystemMessageUrl = 'ebilling/account/systemmessage'
const PhoneCodeUrl ='ebilling/account/phonecode'
const JudgeLoginUrl ='ebilling/account/judgelogin'
const ExitUrl='ebilling/account/exit'
const RegisterUrl ='ebilling/account/register'
const LoginKefuUrl ='ebilling/account/loginkefu'
function login(map) {
  //Map.phone map.pwd
  return new Promise(function (resolve, reject) {
    util.request(map, "GET").then(res => {
      console.log(res);
      resolve(res);
     
    })
  })
}

function loginDaily(map) {
  //Map.phone map.pwd
  var currentuser = wx.getStorageSync('currentuser');
  if (currentuser) {
    var params = {}
    var data = {}
    data.phone = currentuser.phone;
    data.pwd = currentuser.pwd;
    params.url = "ebilling/account/login"
    params.data = data
    util.request(params, "GET").then(res => {
      console.log(res);
      if (res.data.msg == 'success') {
        Toast.showToast("自动登录成功");
        wx.setStorageSync('currentuser', res.data);
      }
    })

  }

}
function SystemMessage(pageno,pagesize){
  var params={
    url:SystemMessageUrl,
    data:{
      pageno,
      pagesize
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function PhoneCode(phone){
  var params={
    url:PhoneCodeUrl,
    data:{
      phone
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
   
    })
  })
}

function JudgeLogin(){
  return new Promise(function (resolve, reject) {
    wx.login({
      complete: (res) => {
        var params={
          url:JudgeLoginUrl,
          data:{
            code:res.code
          }
        }        
          util.request(params, "Get").then(res => {
            console.log(res);
            resolve(res);
            if (res.data.msg == 'success') {
              Toast.showToast("自动登录成功");
              wx.removeStorageSync('kefuid')
              wx.setStorageSync('currentuser', res.data);
            }else{
              if(res.data.msg=='none'){
                
                wx.clearStorageSync();
                Toast.showToast("未登录");
                router.navigateTo("/pages/login/login")
              }
            }
          })    
      }
     
    })
   })

}

function Exit(){
  var params={
    url:ExitUrl,
    data:{
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
   
    })
  })
 
}

function Register(id,pwd){
  var params={
    url: RegisterUrl,
    data:{
      id,
      pwd
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
   
    })
  })
 
}


function LoginKefu(username,pwd) {
  var params={
    url:LoginKefuUrl,
    data:{
      username,
      pwd
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
   
    })
  })
}

module.exports = {
  login,
  loginDaily,
  SystemMessage,
  PhoneCode,
  JudgeLogin,
  Exit,
  Register,
  LoginKefu
}