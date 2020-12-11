const app = getApp()
const router = require("../../utils/router")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kdtype: [{ la: '金额统计', price: 1 }, { la: '数量统计', price: 2 }, { la: '发票查询', price: 3 }],
    flag:0,
    address:'',
    showShare: false,

 
  },





  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path);
  },

  bindDateChangeStart(e){
    this.setData({
      starttime: e.detail.value
    })
  },
  bindDateChangeEnd(e){
    this.setData({
      endtime: e.detail.value
    })
  },
  onClose() {
    this.setData({ showShare: false });
  },
  onSelect(event) {
    debugger;
    console.log(event.detail.name);
   
    if(this.data.title=='时间段'){ 
      this.setData({
        duration:event.detail.name
      })
    }else  if(this.data.title=='取件方式'){
      apply.experssway = event.detail.name
     this.setData({
       apply:apply
     })
   }
    
    this.onClose();
  },

  onClick(e) {
    var title = e.currentTarget.dataset.title;
    var options=[]
    if(title=='时间段'){
       options =[
        {
          name: '月度',
          icon: '../../img/time.png',
        },
        {
          name: '季度',
          icon: '../../img/time.png',
        },
        {
          name: '年度',
          icon: '../../img/time.png',
        },
        {
          name: '区间',
          icon: '../../img/time.png',
        },
      ]
     
    }else if(title=='票据种类'){
      options= [
        {
          name: '普票',
          icon: '../../img/ticket.png',
        },
        {
          name: '专票',
          icon: '../../img/ticket.png',
        },
        {
          name: '代开专票',
          icon: '../../img/ticket.png',
        },
        {
          name: '机动车发票',
          icon: '../../img/ticket.png',
        },
        {
          name: '通用机打',
          icon: '../../img/ticket.png',
        },
        {
          name: '电子普票',
          icon: '../../img/ticket.png',
        },
      ]
    }
    this.setData({ 
      showShare: true,
      title:title,
      options:options
    });
  },
  

  change(e){
    
    this.setData({
      flag: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _this = this
    let p = wx.getStorageSync("server")[options.index].price_gui.split(',')
    this.data.kdtype[0].price = p[0]
    this.data.kdtype[1].price = p[1]
    this.data.kdtype[2].price = p[2]
    this.setData({
      msg: wx.getStorageSync("server")[options.index],
      kdtype:this.data.kdtype
    })
    if(wx.getStorageSync("address")){
      let add = wx.getStorageSync("address")
      this.setData({
        address: add.address + '-'+add.detail
      })
    }
  },
  formSubmit(e){
    let formId = e.detail.formId
    let mu = e.detail.value.mu
    if(this.data.address == ''){
      wx.showToast({
        title: '请选择地址',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: '发布中',
        mask:true
      })
      app.com.post('help/add',{
        openid: wx.getStorageSync("user").openid, 
        wx_id:wx.getStorageSync("user").id,
        mu:this.data.address,
        a_id: wx.getStorageSync("area").pk_id,
        form_id:formId,
        title:'快递代取',
        des:this.data.kdtype[this.data.flag].la+' '+e.detail.value.des,
        total_fee: this.data.kdtype[this.data.flag].price
      },function(res){
        if(res.code == 1){
          wx.showToast({
            title: '发布成功',
          })
          _this.wxpay(res)
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })
    }
  },
  wxpay(msg){
    app.com.wxpay(msg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


})