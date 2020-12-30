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
    password:'',
    show:false
  },

  showPop() {
    this.setData({ show: true});
  },

  onClose() {
    this.setData({ show: false });
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
      var _this =this;
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
        _this.authorLoginphone(item.phone,item.pwd);
      })
      .catch(() => {
        // on cancel
    
        console.log("不登录")
        //this.ChangeOrderStatus();
      });
  },

  authorLoginphone(phone,pwd){
    //console.log(e);
      wx.showLoading({
        title: '登录中',
      })
      var params ={}
      var data ={}
      data.phone =phone;
      data.pwd = pwd;
      data.nickname ="";
      data.encryptedData="";
      data.iv = "";
      data.code ="";
      params.url = loginurl;
      params.data =data
      login.login(params).then(res=>{
          console.log(res);
          if(res.data.msg=='success'){
            wx.hideLoading({
              complete: (res) => {},
            })
            if(res.data.existopenid==true){
              Toast.showToast("登录成功");
              wx.setStorageSync('currentuser', res.data);
              Dialog.alert({
                title: '临时登录',
                message: "此微信已绑定账号为"+res.data.existphone+"\n如需修改请联系客服",
                theme: 'round-button',
              }).then(() => {
                // on close
                wx.switchTab({
                  url: '/pages/index/index',
                })
              });
       

            }else{
              Toast.showToast("登录成功");
              wx.setStorageSync('currentuser', res.data);
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }, 1500);    
            }
          
          }else{
            if(res.data.msg=='nopwd'){
              Notify({
                message: '用户暂不可用,请先注册',
                duration: 2000,
               });
               setTimeout(function(){
                    router.navigateTo("/pages/register/register")
               },1500)
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

    
  },


  onSearch(e) {
    console.log(e.detail)
    if(e.detail ==''){
      app.globalData.Toast.showToast("输入为空")
      return;
    }

   
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
        title: '请填写账号',
        icon:'none'
      })
    }else   if(this.data.password == ''){
      wx.showToast({
        title: '请填写密码',
        icon:'none'
      })
    }else{

      login.LoginKefu(this.data.phone, this.data.password).then(res=>{
          console.log(res);
          if(res.data.msg=='success'){
            Toast.showToast("登录成功");
            wx.setStorageSync('kefuid', res.data.id);
             this.setData({
               list:res.data.list
             })
             this.showPop()
          }else{
        
            if(res.data.msg=='none'){
              Notify({
                message: '无此用户，',
                duration: 2000,
               });
            
            }
            if(res.data.msg=='pwd'){
              Notify({
                message: '密码错误，',
                duration: 2000,
               });
            }
        
            
          }

      })
      
    }
    
  },
 
})