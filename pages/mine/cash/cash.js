const app = getApp()
const salesorder =require("../../../utils/salesorder")
const company =require("../../../utils/company")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFee:'0.00',
    realFee:0,
    cashFee:null,
    money:100
  },
  cashInput(e){
     this.setData({
       money:e.detail.value
     })
  },

  Charge(id){
    company.Charge(this.data.company.id,this.data.money).then(res=>{
       if(res.data.msg==true){
         wx.showToast({
           title: '充值成功',
         })
         setTimeout(function(){
          wx.navigateBack({
            complete: (res) => {},
          })
         },1500)
        
       }else{
        wx.showToast({
          title: '充值失败',
        })
       }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
     var company =wx.getStorageSync('company');
     if(company!=''){
       if(options.leftmoney){
        this.setData({
          company,
          leftmoney:options.leftmoney
        })
       }
         
     }
  },
 
  cashAll(){
    if(this.data.realFee > 0.3){
      this.setData({
        cashFee: this.data.realFee.toFixed(2)
      })
    }else{
      wx.showToast({
        title: '单笔提现金额不能小于0.3元',
        icon: 'none'
      })
    }
  },
  cashIt(){
    this.Charge()
  }
})