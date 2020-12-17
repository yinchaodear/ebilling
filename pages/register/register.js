//index.js
//获取应用实例
const app = getApp()
const login = require("../../utils/login")
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
    number:5
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
           code1:res.data.code
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
  gotoUpdate(){
    this.setData({
      show:true,
      isUpdate:true
    })
  },
  choose(e){
    let name = e.currentTarget.dataset.name
    wx.chooseImage({
      count:1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        if(name=='cert'){
          _this.setData({
            cert: tempFilePaths[0]
          })
          
        }else{
          _this.setData({
            stu_card: tempFilePaths[0]
          })
        }
        _this.upload(name)
      }
    })
  },
  upload(name){
    if (this.data[name] != '' && this.data[name].indexOf('tmp')>0){
      wx.showLoading({
        title: '上传中',
        mask: true
      })
      wx.uploadFile({
        url: app.com.API + 'file/upload', // 仅为示例，非真实的接口地址
        filePath: this.data[name],
        name: 'file',
        formData:{
          wx_id:wx.getStorageSync("user").id,
          a_id:wx.getStorageSync("area").pk_id,
          is_temp: 0
        },
        success(res) {
          wx.hideLoading()
          let red = JSON.parse(res.data)
          if (red.code == 1) {
            
            if(name == 'cert'){
              _this.setData({
                cert: red.data.url
              })
            }else{
              _this.setData({
                stu_card: red.data.url
              })
            }
            
          }
        }
      })
    }else{
      wx.showToast({
        title: '请选择图后再上传',
        icon:'none'
      })
    }
  },
  
  submit() {
    console.log(this.data);
  },
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("dl").phone,
    })
  },
  onLoad: function (options) {

  },
  onShow(){
     
    
  }
 

})
