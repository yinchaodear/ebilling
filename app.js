let utils = require('./utils/util.js')
let login =require('./utils/login')
App({

  onLaunch: function () {
    let _this = this;
    login.loginDaily();
  },
  

  globalData: {
    userInfo: null
  }
})