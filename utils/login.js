let API = require('../config/api')
const util = require('../utils/util');
const Toast =require("../utils/Toast")
const LOGINAPI = '/rest/customer/login'
const SystemMessageUrl = 'ebilling/account/systemmessage'
const PhoneCodeUrl ='ebilling/account/phonecode'
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

module.exports = {
  login,
  loginDaily,
  SystemMessage,
  PhoneCode
}