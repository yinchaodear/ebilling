const app = getApp()
const api =require("../../../config/api")
const router = require('../../../utils/router')
import Dialog from '../../../dist/dialog/dialog';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    message:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.message){
        this.setData({message:JSON.parse(options.message)});
    }
  },
  
})
