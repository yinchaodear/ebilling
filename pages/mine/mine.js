import Dialog from "../../dist/dialog/dialog";
import Notify from "../../dist/notify/notify";

const loginurl ='ebilling/account/login'
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
      wx.clearStorage({
        complete: (res) => {
         that.setData({});
         app.globalData.Toast.showToast("退出成功");
         setTimeout(function(){
          router.navigateTo("/pages/login/login")
         },1500)
        
        },
      })
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
  
  switch:function(){
    if(!this.data.kefuid){
      app.globalData.Toast.showToast("不是客服！");
      wx.clearStorage({
        complete: (res) => {
         that.setData({});
         app.globalData.Toast.showToast("退出成功");
         setTimeout(function(){
          router.navigateTo("/pages/login/login")
         },1500)
        
        },
      })
      return;
    }
    
    var that = this;
    login.searchAccount(this.data.kefuid).then(res=>{
        console.log(res);
        if(res.success){
          that.setData({list:res.data.list,show:true});
        }
    })
  },
  
  onClose() {
    this.setData({ show: false });
  },
  
  onCancel(){
    this.onClose();
  },
  
  onChange(e) {
    console.log(e);
    var value = e.detail
    this.setData({
      value: e.detail, 
    });
    var list = this.data.list;
    for(var i in list){
      if(list[i].lastname.indexOf(value)!=-1||list[i].phone.indexOf(value)!=-1
      ||list[i].accountname.indexOf(value)!=-1){
        if(list[i].show==false||list[i].show==undefined){
          list[i].show=true
        }
      }else{
        list[i].show=false
      }
    }
    this.setData({
      list
    })
  },
  
  loginbyphone(e){
      var that = this;
      var index =e.currentTarget.dataset.index;
      var item = this.data.list[index];
      console.log(item)
      Dialog.confirm({
        title: '确认账户'+item.lastname,
        message: '确定用此账户登录?',
        confirmButtonText:"确定",
        cancelButtonText:"取消"
      })
      .then(() => {
        // on confirm
        console.log("登录")
        that.authorLoginphone(item.phone, item.pwd);
      })
      .catch((e) => {
        // on cancel
        console.info(e);
        console.log("不登录")
        //this.ChangeOrderStatus();
      });
  },

  authorLoginphone(phone, pwd){
    //console.log(e);
      var that = this;
      wx.showLoading({
        title: '登录中',
      })
      var params = {}
      var data = {}
      data.phone = phone;
      data.pwd = pwd;
      data.nickname = "";
      data.encryptedData = "";
      data.iv = "";
      data.code = "";
      data.kefuLogin = "1";
      params.url = loginurl;
      params.data = data
      login.login(params).then(res=>{
          console.log(res);
          if(res.data.msg=='success'){
            wx.hideLoading({
              complete: (res) => {},
            })
            
            app.globalData.Toast.showToast("登录成功");
            wx.removeStorageSync('company');
            wx.removeStorageSync('company1');
            wx.setStorageSync('currentuser', res.data);
            that.onClose();
            setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/index',
                })
            }, 1500);
          
          }else{
            if(res.data.msg=='nopwd'){
              Notify({
                message: '用户暂不可用,请稍后再试',
                duration: 2000,
               });
               setTimeout(function(){
                    router.navigateTo("/pages/register/register")
               },1500)
            }
            if(res.data.msg=='none'){
              Notify({
                message: '无此用户，请确认',
                duration: 2000,
               });
            }
            if(res.data.msg=='oversize'){
              Notify({
                message: '有重复用户,请联系客服',
                duration: 2000,
               });
            }
            
          }

      })

    
  },


  onSearch(e) {
    if(e.detail ==''){
      app.globalData.Toast.showToast("输入为空")
      return;
    }
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
    this.setData({kefuid:wx.getStorageSync('kefuid')});
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
