const app = getApp()
const api =require("../../../config/api")
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
    },
    step:1,
    fileList:[],
    cancelimglist:[],
    FapiaoList:[]
  },

  showimage(e){
    console.log(e);
    wx.previewImage({
      current:e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.cancelimglist // 需要预览的图片http链接列表
    })
  },

  showimage1(e){
    wx.previewImage({
      current:e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.FapiaoList // 需要预览的图片http链接列表
    })
  },
  afterRead(event) {
    var _this= this;
    const { file } = event.detail;
    const { fileList = [] } = this.data;
    fileList.push({ ...file});
    this.setData({fileList})
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  
  },
  afterdelete(e){
    console.log(e);
    let index=e.detail.index;
    var fileList =this.data.fileList;
    fileList.splice(index,1);

    this.setData({fileList})
  },

  upload:function(){
    var _this =this;
    var fileList  =this.data.fileList;
    if(fileList.length==0){
      app.globalData.Toast.showToast("照片为空")
      return;
    }
    for(var i in fileList){
      var i11 =i
      wx.uploadFile({
        url: api.UPLOADURL, // 仅为示例，非真实的接口地址
        filePath: fileList[i].url,
        name: 'file',
        formData: {
          objectId: _this.data.detail.id,
          objectType:"CancelApply"
        },
        success(res) {
          // 上传完成需要更新 fileLis  
          var fileList  =_this.data.fileList;
          fileList[i].upload=true;
          _this.setData({
            fileList
          })
        },
      });
    }
    this.checkupload()
  },

  checkupload(){
      var _this =this;
      var fileList =this.data.fileList;
      var flag =true;
      for(var i in fileList){
        if(fileList[i].upload!=true){
          flag==false;
        }
      }
      if(flag){
        app.globalData.Toast.showToast("上传成功");
        _this.onClose()
        _this.GetSalesOrderInfo(_this.data.detail.id);
      }else{
        setTimeout(() => {
          __this.checkupload()
        }, 200);
      }
  },

  sure(){
     //this.onClose();
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
            this.setData({
              step:2
            })
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
    this.setData({ show: true,
    step:2
    });
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
          orderitem:res.data.orderitem,
        })
        var cancelimglist = this.data.cancelimglist;
        var  FapiaoList  =this.data.FapiaoList;
        for(var i in res.data.cancelimglist){
           cancelimglist.push(api.PicUrl("CancelApply",this.data.detail.id,res.data.cancelimglist[i].name))
        }
        for(var i in res.data.FapiaoList){
          var obj =res.data.FapiaoList[i];
          FapiaoList.push(api.PicUrl("salesorder",obj.salesOrderId+'_'+obj.paperno, obj.picname));
        }
       
        this.setData({
          cancelimglist,
          FapiaoList
        })
        

     }
    })
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  
})