let utils = require('./utils/util.js')
App({

  onLaunch: function () {
    let _this = this;
    utils.Login();
  },
  

  globalData: {
    userInfo: null
  }
})