const app = getApp()
let _this;
const salesorder = require('../../../utils/salesorder')
const router =require('../../../utils/router')

import Dialog from '../../../dist/dialog/dialog';
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
      applytime:'2011-20-20',
      show:false,
    }
  },

  sure(){
     this.onClose();
     var taxno = this.data.taxno;
     if(taxno==''){
       app.globalData.Toast.showToast("输入为空")
        return; 
     }
     taxno =taxno.split(" ");
     console.log(taxno);
     var taxnoList =[]
     for(var i in taxno){
       if(taxno[i]!=''){
         taxnoList.push(taxno[i])
       }
     }
     this.cancelApply(taxnoList);
  },

  cancelApply(taxno){
    salesorder.CancelApply(this.data.detail.id,taxno).then(res=>{
          if(res.data.msg==true){
            app.globalData.Toast.showToast("申请成功");
            this.GetSalesOrderInfo(this.data.detail.id);
          }else{
            Dialog.alert({
              title: '申请失败',
              message: '未找到所填发票号的开票项',
            }).then(() => {
              // on close
            });
          }
    })
  },

  textareainput(e){
     console.log(e);
     this.setData({
       taxno:e.detail.value
     })
  },

  onClose() {
    this.setData({ show: false });
  },

  showPopup() {
    this.setData({ show: true });
  },
  comfirm() {
    var _this =this;
    Dialog.confirm({
      title: '发票确认',
      message: '现场收到的发票是否有问题',
      confirmButtonText:"有",
      cancelButtonText:"无"
    })
    .then(() => {
      // on confirm
      console.log("有问题")
      setTimeout(() => {
        _this.cancel1()
      }, 1000);
    })
    .catch(() => {
      // on cancel
  
      console.log("没问题")
      this.ChangeOrderStatus();
    });
   
  },

  cancel1:function(){
    Dialog.confirm({
      title: '作废申请',
      message: '是否对发票进行作废处理',
      confirmButtonText:"是",
      cancelButtonText:"否"
    })
    .then(() => {
      // on confirm
      console.log("有问题")
      this.showPopup(); 
    })
    .catch(() => {
      // on cancel
     
    });
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
  cancel() {
    Dialog.confirm({
      title: '发票确认',
      message: '开具发票是否有问题',
      confirmButtonText:"无",
      cancelButtonText:"有"
    })
    .then(() => {
      // on confirm
       console.log("没问题")
       this.ChangeOrderConfirmStatus();
    })
    .catch(() => {
      // on cancel
      console.log("有问题")
    });

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