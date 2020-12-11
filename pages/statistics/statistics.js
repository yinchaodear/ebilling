const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        serino:'20111111',
        status:'审核中',
        company:{name:"a公司"},
        company1:{name:"b公司"},
        applytime:'2011-20-20'
      },
      {
        serino:'20111111',
        status:'开具中',
        company:{name:"a公司"},
        company1:{name:"b公司"},
        applytime:'2011-20-20'
      },
      {
        serino:'2055153135',
        status:'已开具',
        company:{name:"a公司"},
        company1:{name:"b公司"},
        applytime:'2011-20-20'
      },
      {
        serino:'2055153135',
        status:'暂存',
        company:{name:"a公司"},
        company1:{name:"b公司"},
        applytime:'2011-20-20'
      }
    
    ],
    option1:[
      { text: '全部', value: 0 },
      { text: '待取件', value: 1 },
      { text: '已取件', value: 2 },
      { text: '待邮寄', value: 3 },
      { text: '已邮寄', value: 4 },
    ],
    value1: 0,
    page:1,
    load:false,
    size:10,
    tag:['全部','审核中','开具中','已开具','暂存','已作废','待确认'],
    flag:2,
    url:'get',
    wheres:"",
    sorts:"",
    fields:'',
    wx_id:wx.getStorageSync("user").id
  },

  //这边是筛选条件
  itemchange(e){
    console.log(e);
    var index = e.detail;
    var text = this.data.option1[index].text;
    console.log(text)
  },

  getWxsmData(){
    let date = new Date()
    let m = date.getMonth() + 1
    let month = m < 10 ? ""+"0"+m:m
    let com = date.getFullYear() + '-' + month+'%'
    app.com.post('anlysis/get/wx/sm',{wx_id:wx.getStorageSync("user").id,com_time:com},function(res){
      console.log(res)
      if(res.code == 1){
        _this.setData({
          anlysis:res.data
        })
      }
    })
  },
  comfirm(e){
    let id = e.currentTarget.dataset.id
    wx.showLoading({
      title: '请稍等',
      task:true
    })
    app.com.post('help/confirm',{id:id},function(res){
      wx.hideLoading()
      if(res.code == 1){
        wx.showToast({
          title: '订单已完成',
        })
        _this.getList(0)
      }else{
        wx.showToast({
          title: '确认失败',
          icon: 'none'
        })
      }
    })
  },
  takeIt(e){
    let index = e.currentTarget.dataset.index
    let msg = this.data.list[index]
    if (wx.getStorageSync("res").state == 1){
      if (wx.getStorageSync("res").a_id == wx.getStorageSync("area").pk_id) {
        this.takeDo(msg)
      }else{
        wx.showModal({
          title: '提示',
          content: '您不是该学校的接单员',
          confirmText: '朕知道了',
          showCancel:false,
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/register/register',
              })
            }
          }
        })
      }
    } else{
      wx.showModal({
        title: '提示',
        content: '您还不是接单员，是否前往申请',
        confirmText:'立即前往',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/register/register',
            })
          }
        }
      })
    }
    
    
  },
  takeDo(msg){
    wx.showLoading({
      title: '请稍等',
      task:true
    })
    app.com.post('help/jd', {
      jd_id: wx.getStorageSync("user").id,
      id: msg.id,
      openid:msg.openid,
      form_id:msg.form_id,
      title:msg.title,
      order_num:msg.order_num
    }, function (res) {
      wx.hideLoading()
      if (res.code == 1) {
        wx.showToast({
          title: '接单成功',
        })
        _this.getList(0)
      } else {
        wx.showToast({
          title: '接单失败',
          icon: 'none'
        })
      }
    })
  },
  pay(e) {
    wx.showLoading({
      title: '请稍等',
      task: true
    })
    app.com.post('help/pay', {
      title: e.currentTarget.dataset.title,
      openid: wx.getStorageSync("user").openid,
      oid: e.currentTarget.dataset.id,
      total_fee: e.currentTarget.dataset.price
    }, function (res) {
      if (res.code == 1) {
        app.com.wxpay(res,function(res){
          wx.hideLoading()
          if(res){
            _this.getList(0)
          }
        })
      }
    })
  },
  cancel(e){
    wx.showModal({
      title: '提示',
      content: '确定要取消吗？',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '请稍等',
            task: true
          })
          app.com.cancel(e.currentTarget.dataset.id, 'navigateTo',function(res){
            wx.hideLoading()
            if(res){
              _this.getList(0)
            }
          })
        }
      }
    })
    
  },
  changeTag(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      flag: e.currentTarget.dataset.index,
      type:this.data.tag[index]
    })
    console.log(this.data)
  },
  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    _this.getList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.list.length < this.data.total){
      _this.getList(1)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:'互帮互助代替你',
      path:'/pages/index/index'
    }
  }
})