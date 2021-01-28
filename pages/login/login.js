const app = getApp()
const router = require('../../utils/router')
const Toast =require("../../utils/Toast")
const login = require("../../utils/login");
const loginurl ='ebilling/account/login'
import Notify from '../../dist/notify/notify';
import Dialog from '../../dist/dialog/dialog';
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

  redirectTo(e){
    var path = e.currentTarget.dataset.path;
    router.redirectTo(path);
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
            if(res.data.existopenid==true){
              Toast.showToast("登录成功");
              wx.setStorageSync('currentuser', res.data);
              Dialog.alert({
                title: '临时登录',
                message: "此微信已绑定账号为"+res.data.existphone+"\n如需修改请联系客服",
              }).then(() => {
                // on close
                wx.switchTab({
                  url: '/pages/index/index',
                })
              });
       

            }else{
              Toast.showToast("登录成功");
              wx.setStorageSync('currentuser', res.data);
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          
          }else{
            if(res.data.msg=='stop'){
              Notify({
                message: '用户暂不可用,请先注册',
                duration: 2000,
               });
               setTimeout(function(){
                    router.navigateTo("/pages/register/register")
               },1500)
            }
            
            if(res.data.msg=='nopwd'){
              Notify({
                message: '密码不正确，请重试或者重新注册验证',
                duration: 2000,
               });
            }
            
            if(res.data.msg=='none'){
              Notify({
                message: '无此用户',
                duration: 2000,
               });
               setTimeout(function(){
                    router.navigateTo("/pages/register/register")
               },1500)
            }
            if(res.data.msg=='oversize'){
              Notify({
                message: '有重复用户,请联系客服',
                duration: 2000,
               });
               setTimeout(function(){
                    router.navigateTo("/pages/register/register")
               },1500)
            }
            
          }

      })
      
    }
    
  },
 
})
