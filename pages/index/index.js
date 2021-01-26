//index.js
//获取应用实例
import * as login from "../../utils/login";

const Toast = require("../../utils/Toast")
const app = getApp()
let _this;
Page({
  data: {
    imgurls:[],
    isFirst:true,
    list:[
      {
        server_name:'申请开票'
      },
      {
        server_name:'发票统计'
      },
      {
        server_name:'合同信息'
      }

    ],
    server:[
   
    ]
  },
  navToArea(){
    wx.navigateTo({
      url: '/pages/area/area',
    })
  },
  navTo2(e){
    app.com.navTo(e)
  },
  navTo(e) {

      let name = e.currentTarget.dataset.name
      let index = e.currentTarget.dataset.index
      var currentuser =wx.getStorageSync('currentuser');
      if(!currentuser){
        Toast.showToast("未登录");
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }, 1500);
        return;
      }
      if(true){
        if (name == '发票统计') {
          wx.navigateTo({
            url: '/pages/daiqu/daiqu?index=' + index,
          })
        } else if (name == '申请开票') {
          var company= wx.getStorageSync('company');
          if(company!=''){
            wx.navigateTo({
              url: '/pages/dayin/dayin?index=' + index,
            })
          }else{
            app.globalData.Toast.showToast("未选择公司");
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/area/area',
              })
            }, 1000);
          }
          
        } else {
          wx.navigateTo({
            url: '/pages/other/other?from=index',
          })

        }
      }else{
        wx.showModal({
          title: '提示',
          content: '服务暂停中',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#6887e1'
        })
      }
    // }
  },
  navToArea(){
    wx.navigateTo({
      url: '/pages/area/area',
    })
  },
  publist(){
    wx.navigateTo({
      url: '/pages/pub/pub',
    })
  },
  onLoad: function (options) {
    _this = this
    login.JudgeLogin();
  },
  getCarousel(){
    app.com.post('calousels/get',{a_id:wx.getStorageSync("area").pk_id},function(res){
      if(res.code == 1){
        _this.setData({
          imgurls:res.data.list
        })
      }
    })
  },
 
  onPullDownRefresh(){
    this.login()
    this.getServer(wx.getStorageSync('dl').pk_id)
  },
  onShow(){
      var company = wx.getStorageSync("company");
      this.setData({
        company:company
      })
      
      var currentuser =wx.getStorageSync('currentuser');
      if(!currentuser){
          wx.navigateTo({
            url: '/pages/login/login',
          })
      }
  },
  //通知
  getAdminMemr(){
    app.com.post('user/get/emer', { dl_id: 1 }, function (res) {
      _this.setData({
        emer: res.data
      })
      if (res.data.open_emer == 1) {
        wx.showModal({
          title: res.data.emer_title,
          content: res.data.emer_content,
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#6887e1'
        })
      }else{
        _this.getMemr()
      }
    })
  },
  getMemr(){
    app.com.post('user/get/emer',{dl_id:wx.getStorageSync("dl").pk_id || 1},function(res){
      _this.setData({
        emer:res.data
      })
      if(res.data.open_emer == 1){
        wx.showModal({
          title: res.data.emer_title,
          content: res.data.emer_content,
          showCancel:false,
          confirmText:'朕知道了',
          confirmColor:'#6887e1'
        })
      }
    })
  },
  getServer(id) {
    app.com.post('server/get/uid', {
      uid: id
    }, function (res) {
      if (res.code == 1) {
        wx.setStorageSync("server", res.data)
        _this.setData({list:res.data})
      
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  checkArea() {
    if (wx.getStorageSync('area')) {
      this.setData({
        area: wx.getStorageSync('area'),
      })
      if(_this.data.imgurls.length == 0){
        _this.getCarousel()
      }
      if(_this.data.list.length == 0){
        _this.getServer(wx.getStorageSync('dl').pk_id)
      }

    } else {
      wx.navigateTo({
        url: '/pages/area/area',
      })
    }
  },
  onShareAppMessage(){
    return {
      title:'横竖湾一键智能发票通',
      path:'/pages/index/index'
    }
  }
  
})
