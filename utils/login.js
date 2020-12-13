let API = require('../config/api')
const util = require('../utils/util');
const Toast =require("../utils/Toast")
const LOGINAPI = '/rest/customer/login'

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


module.exports = {
  login,
  loginDaily,
}