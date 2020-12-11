const app = getApp()
const router = require('../../utils/router')
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },


  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path);
  },

  ddinput(e){
  
    let name = e.currentTarget.dataset.name;
    this.data[name] = e.detail.value;
    this.setData({
      phone: this.data.phone,
      password: this.data.password
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#6e42d3',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  authorLogin(e){
    if(this.data.phone == ''){
      wx.showToast({
        title: '请填写手机号',
        icon:'none'
      })
    }else   if(this.data.password == ''){
      wx.showToast({
        title: '请填写密码',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '授权中',
        task:true
      })
      let userInfo = e.detail.userInfo
      userInfo.id = wx.getStorageSync("user").id
      userInfo.phone = this.data.phone
      userInfo.dphone = this.data.dphone
      
    }
    
  },
 
})