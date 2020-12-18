let utils = require('./utils/util.js')
let login =require('./utils/login')
const Toast =require('./utils/Toast')
App({

  onLaunch: function () {
    let _this = this;
    login.JudgeLogin();
  },
  

  globalData: {
    userInfo: null,
    Toast:Toast
  }
})