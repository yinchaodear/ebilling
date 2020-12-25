const app = getApp()
const api =require("../../../config/api")
const router = require('../../../utils/router')
import Dialog from '../../../dist/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageId:
  },
  
  ChangeOrderConfirmStatus(){
    salesorder.ChangeOrderConfirmStatus(this.data.detail.id).then(res=>{
      if(res.data.msg==true){
        app.globalData.Toast.showToast("确认完成");
        this.GetSalesOrderInfo(this.data.detail.id);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.orderid){
        this.GetSalesOrderInfo(options.orderid);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
})
