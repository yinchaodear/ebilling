//index.js
//获取应用实例
const app = getApp()
const login = require("../../utils/login")
const router =require("../../utils/router")
import Notify from '../../dist/notify/notify';
let _this;
Page({
  data: {
    price: '',
    des: '',
    phone: '',
    cert:'',
    stu_card:'',
    show:true,
    isUpdate:false,
    name:'',
    disabled:false,
    text:"发送",
    number:60,
    configTel:""
  },

  PhoneCode(){
     var name = this.data.name;
     if(name==''){
       app.globalData.Toast.showToast("电话号码为空");
       return;
     }
     login.PhoneCode(name).then(res=>{
       if(res.data.msg=='none'){
        Notify({
          message: '您还不是该企业客户,请联系客服',
          duration: 2000,
         });
       }else if(res.data.msg==true){
         this.setData({
           disabled:true,
           code1:res.data.code,
           id:res.data.id
         })
         this.count(this.data.number)
       }
     })
  },

  count(number){
    var _this =this;
    if(number>0){
      setTimeout(function(){
         _this.setData({
            text:number+"秒"
          })
          number= number-1;
          _this.count(number);
      },1000)
    }else{
      this.setData({
        disabled:false,
        number:60,
        text:"发送"
      })
    }
  },

   complete(e){
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var value =e.detail.value;
    this.setData({
      [type]:value
    })

  },
    
    
  completeFocus : function(e){
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var value =e.detail.value;
    var x = this.data;
    x["nameFocused"] = false;
    x["codeFocused"] = false;
    x["pw1Focused"] = false;
    x["pw2Focused"] = false;
    x[type+"Focused"] = true;
    this.setData(x)
  },
    
  gotoUpdate(){
    this.setData({
      show:true,
      isUpdate:true
    })
  },
    
  submit() {
    console.log(this.data);
    if(this.data.code!=this.data.code1){
      Notify({
        message: '验证码不正确',
        duration: 2000,
       });
       return;
    }
    if(this.data.pw1!=this.data.pw2){
      Notify({
        message: '两次密码不统一',
        duration: 2000,
       });
       return;
    }
    login.Register(this.data.id,this.data.pw1).then(res=>{
       if(res.data.msg==true){
        Notify({
          message: '注册成功,即将返回登录页面',
          duration: 2000,
         });
         setTimeout(function(){
           router.navigateTo("/pages/login/login");
         },2000)
       }
    })
  },
    
  makePhone(){
    wx.showToast({ title: '请联系您的专属客服,或者联系客服热线:'+""+this.data.configTel, icon: 'none', duration:2500 });
    // wx.makePhoneCall({
    //   phoneNumber: wx.getStorageSync("dl").phone,
    // })
  },
  onLoad: function (options) {
      //加载一下客服热线，做成配置吧
      let that = this;
      login.getConfigTel().then(res=>{
       if(res.data.msg==true){
           var configTel = res.data.tel;
           that.setData({configTel});
       }
    })
  },
    
  onShow(){
    
  }
 

})
