const app = getApp()
const api =require("../../../config/api")
let _this;
const salesorder = require('../../../utils/salesorder')
const router =require('../../../utils/router')
function formatDate(num){
  num =parseInt(num);
  if(num<10){
    return "0"+num
  }else{
    return num
  }
}

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
    qrshow:false,
    showsf:false,
    fileList:[],
    cancelimglist:[],
    FapiaoList:[],
    msgData:"",
    active:2,
    steps: [],
  },
  SfInfo(){
    debugger;
    if(this.data.msgData==''){
      salesorder.SfInfo(this.data.detail.id).then(res=>{
        if(res.data.msg==true){
          this.setData({
            msgData:res.data.msgData,
            msgData1:res.data.msgData1,
            showsf:true
          })
          var steps=[];
          var obj ={};
          obj.text="物流信息"
          obj.desc ="物流单号"+res.data.msgData.routeLabelInfo[0].message
          steps.push(obj); 
          var routelist =res.data.msgData1.routeResps[0].routes;
          for(var i in routelist){
            var item =routelist[i]
            var obj ={};
            var date= new Date(item.acceptTime);
            obj.text=item.acceptAddress;
            obj.desc =item.remark +"  "+","+date.getFullYear()+"-"+ formatDate((date.getMonth()+1))+"-"+formatDate(date.getDate()) +" "+formatDate(date.getHours())+":"+formatDate(date.getMinutes())
            steps.push(obj); 
          }
          steps =steps.reverse();
          this.setData({
            steps,
            active:0
          })
          // {
          //   text: '物流情况1',
          //   desc: '描述信息',
          //   inactiveIcon: 'location-o',
          //   activeIcon: 'success',
          // },
        }
    })
    }else{
      this.setData({
        showsf:true
      })
    }
   
  },

    
  showqr(){
      console.log("展示")
      this.setData({
        qrshow:true
      })
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
  
  showimage2(e){
    wx.previewImage({
      current:e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.approveList // 需要预览的图片http链接列表
    })
  },
  
  clickPDF(e){
    let url = e.currentTarget.dataset.url;
    let name = e.currentTarget.dataset.name;
    Dialog.confirm({
      title: '下载',
      message: '确认下载'+name,
      confirmButtonText:"是",
      cancelButtonText:"否"
    })
    .then(() => {
      // on confirm
      console.info(url);
      wx.downloadFile({
        // 示例 url，并非真实存在
        url: url,
        success: function (res) {
          const filePath = res.tempFilePath
          console.info(filePath);
          wx.openDocument({
            showMenu:true,
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
          
          //const tempFilePaths = res.tempFilePaths
          // wx.saveFile({
          //   tempFilePath: filePath,
          //   success (res) {
          //     const savedFilePath = res.savedFilePath;
          //     console.info(savedFilePath);
          //     app.globalData.Toast.showToast("以保存到"+savedFilePath+"目录");
          //     wx.getSavedFileInfo({
          //         filePath: savedFilePath,
          //         success(data) {
          //             debugger
          //         },
          //         fail (error) {
          //             debugger
          //         }
          //     })
          //   }
          // })
          
        }
      })
    })
    .catch(() => {
      // on cancel
      console.log("否")
    });
    
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
        _this.setData({
          cancelimglist:[],
          FapiaoList:[]
        })
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
      //this.ChangeOrderStatus();
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

  applyagain(){
    router.navigateTo("/pages/dayin/dayin?orderid="+this.data.detail.id+"&again=true");
  },
 
  cancel() {
    Dialog.confirm({
      title: '发票确认',
      message: '开具发票是否有问题',
      cancelButtonText:"无",
      confirmButtonText:"有"
  
    })
    .then(() => {
      // on confirm
      console.log("有问题")
      Dialog.alert({
        title: '联系客服',
        message: "如发票有问题,请联系客服"
      }).then(() => {
        // on close
      });
    })
    .catch(() => {
      // on cancel
      
      console.log("没问题")
      this.ChangeOrderConfirmStatus();
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
        let orderitem =[]
        var item  =res.data.orderitem;
        for(var i in item ){
           var obj ={}
           var detailList =[];
           var taxno =item[i].taxno
           obj.taxno =taxno;
           obj.cancel=item[i].cancel;
           var detail={}
           detail.name =item[i].name;
           detail.money =item[i].money;
           detail.model =item[i].model;
           detail.number =item[i].number;
           detail.remark =item[i].remark;
           detail.tax =item[i].tax;
           detail.unit =item[i].unit;
           detail.unitprice =item[i].unitprice;
           detail.cancel =item[i].cancel;
           detailList.push(detail);
           obj.detailList =detailList
           if(orderitem.length==0){
             orderitem.push(obj);
           }else{
             var flag =true;
             for(var j in orderitem){
               if(obj.taxno ==orderitem[j].taxno){
                 orderitem[j].detailList.push(detail);
                 flag=false;
                 break;
               }
             }
             if(flag){
              orderitem.push(obj);
             }
           }
        }
        console.log(orderitem)
        var cancelimglist = [];
        var  FapiaoList = [];
        var  FapiaoListPDF = [];
        var approveList = [];
        var approveListPDF = [];
        for(var i in res.data.cancelimglist){
           cancelimglist.push(api.PicUrl("CancelApply",ID,res.data.cancelimglist[i].name))
        }
        
        for(var i in res.data.FapiaoList){
          var obj =res.data.FapiaoList[i];
          var type = "image";
          if(obj.picname && obj.picname.indexOf("pdf")>-1){
            type = "pdf";
          }
          var url = api.PicUrl("salesorderdetail", obj.salesOrderId, obj.picname);
          if(type=="image"){
            FapiaoList.push(url);
          }
          
          if(type=="pdf") {
            let filename = obj.picname.split("fileName=")[1];
            FapiaoListPDF.push({
              type: 'pdf',
              name: filename,
              url: url
            });
          }
          
          
        }
        
        for(var i in res.data.approveList){
          var obj = res.data.approveList[i];
          let filename = obj.fileName;
          if(obj.fileName && obj.fileName.indexOf("objectId")>-1){
            filename = obj.fileName.split("fileName=")[1];
          }
          var type = "image";
          if(obj.fileName && obj.fileName.indexOf("pdf")>-1){
            type = "pdf";
          }
          var url = api.PicUrl("SalesOrderApprove", obj.id, obj.fileName);
          if(type=="image"){
            approveList.push(url);
          }
          
          if(type=="pdf") {
            approveListPDF.push({
              type: 'pdf',
              name: filename,
              url: url
            });
          }
        }
       
        this.setData({
          cancelimglist,
          FapiaoList,
          FapiaoListPDF,
          approveList,
          approveListPDF,
          detail:res.data.orderdetail,
          orderitem,salesorder,
          qrsrc:api.PicUrl("salesorder",ID+"_qr",res.data.orderdetail.qr)
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
