const app = getApp()
let _this;
const salesorder = require('../../../utils/salesorder')
const router =require('../../../utils/router')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wx_id:wx.getStorageSync("user").id,
    detail:{
      serino:'20111111',
      status:'审核中',
      company:{name:"a公司"},
      company1:{name:"b公司"},
      applytime:'2011-20-20'
    }
  },
  comfirm() {
    this.ChangeOrderStatus();
  },
  
  ChangeOrderStatus(){
    salesorder.ChangeOrderStatus(this.data.detail.id).then(res=>{
      if(res.data.msg==true){
        this.GetSalesOrderInfo(this.data.detail.id);
      }
    })
  },

  takeIt(e) {
    router.navigateTo("/pages/dayin/dayin?orderid="+this.data.detail.id);
  },
  takeDo(msg) {
    wx.showLoading({
      title: '请稍等',
      task: true
    })
    
    app.com.post('help/jd', {
      jd_id: wx.getStorageSync("user").id,
      id: msg.id,
      openid: msg.openid,
      form_id: msg.form_id,
      title: msg.title,
      order_num: msg.order_num
    }, function (res) {
      wx.hideLoading()
      if (res.code == 1) {
        wx.showToast({
          title: '接单成功',
        })
        _this.getList(_this.data.list.id)
      } else {
        wx.showToast({
          title: '接单失败',
          icon: 'none'
        })
      }
    })
  },
  cancel(e) {
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
            task: true
          })
          app.com.cancel(e.currentTarget.dataset.id, 'navigateTo', function (res) {
            wx.hideLoading()
            if (res) {
              _this.getList(e.currentTarget.dataset.id)
            }
          })
        }
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
  
  GetSalesOrderInfo(ID){
    salesorder.GetSalesOrderInfo(ID).then(res=>{
      if(res.data.msg==true){
        this.setData({
          detail:res.data.orderdetail,
          orderitem:res.data.orderitem
        })
     }
    })
  },

  makePhoneCall(e){
    let ty = e.currentTarget.dataset.type
    if (this.data.wx_id == this.data.list.wx_id || this.data.wx_id == this.data.list.jd_id){
      wx.makePhoneCall({
        phoneNumber: this.data.list[ty],
      })
    }else{
      wx.showToast({
        title: '您不是该单的发布者或接单人',
        icon:'none'
      })
    }
    
  },
  makePhoneCall2(e) {
    let ty = e.currentTarget.dataset.type
    if (this.data.wx_id == this.data.list.wx_id || this.data.wx_id == this.data.list.jd_id) {
      wx.makePhoneCall({
        phoneNumber: this.data.jduser[ty],
      })
    } else {
      wx.showToast({
        title: '您不是该单的发布者或接单人',
        icon: 'none'
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
})