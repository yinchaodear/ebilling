const app = getApp()
const router = require('../../utils/router')
const Toast =require("../../utils/Toast")
const login = require("../../utils/login");
const loginurl ='ebilling/account/login'
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'17751765030',
    password:'8888'
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
    wx.login({
      complete: (res) => {
        console.log(res);
        this.setData({
          code:res.code
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  authorLogin(e){
    console.log(e);
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
      var params ={}
      var data ={}
      data.phone =this.data.phone;
      data.pwd = this.data.password;
      data.nickname =e.detail.userInfo.nickName;
      data.encryptedData=e.detail.encryptedData;
      data.iv = e.detail.iv;
      data.code =this.data.code;
      params.url = loginurl;
      params.data =data
      login.login(params).then(res=>{
          console.log(res);
          if(res.data.msg=='success'){
            Toast.showToast("登录成功");
            wx.setStorageSync('currentuser', res.data);
            wx.switchTab({
              url: '/pages/index/index',
            })
          }

      })
      
    }
    
  },
 
})