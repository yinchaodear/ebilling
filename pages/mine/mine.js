const app = getApp()
const router = require("../../utils/router")
const login=require("../../utils/login")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  exit:function(){
    if(!this.data.currentuser){
      app.globalData.Toast.showToast("您还没有登录！");
      return;
    }
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认退出当前账户?',
      success(res){
        if(res.confirm){
            login.Exit().then(res=>{
               if(res.data.msg=='success'){
                 wx.clearStorage({
                   complete: (res) => {
                     that.setData({});
                     app.globalData.Toast.showToast("退出成功");
                     setTimeout(function(){
                      router.navigateTo("/pages/login/login")
                     },1500)
                    
                   },
                 })
               }
            })
            
        }
      }
    })
  },
  swtobz(e){
    wx.setStorageSync("bzflag", e.currentTarget.dataset.index)
    wx.switchTab({
      url: '/pages/banzu/banzu',
    })
  },
  navTo(e) {
      var path = e.currentTarget.dataset.path;
     router.navigateTo(path)
  },
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("dl").phone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({currentuser : (wx.getStorageSync('currentuser')==""||wx.getStorageSync('currentuser')==null)?null:wx.getStorageSync('currentuser')})
    // if (wx.getStorageSync("user").phone) {
    //   this.setData({
    //     userInfo: wx.getStorageSync("user")
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '/pages/login/login',
    //   })
    // }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
