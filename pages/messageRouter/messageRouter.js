const app = getApp()
const router = require("../../utils/router");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      objectId:null,
      objectType:null
  },
    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options);
    if(options!=null){
        this.setData({
            objectType:options.objectType,
            objectId:options.objectId
        })
    }
    this.navTo();
  },
    
  navTo(){
      console.info(this.data);
      let {objectType, objectId} = this.data;
      if(objectType==null||objectType=='null'){
          app.globalData.Toast.showToast("未知的消息类型");
          return;
      }
      if(objectType=="SalesOrder"){
          if(objectId!=null){
              router.redirectTo("/pages/order/detail/detail?orderid="+objectId)
          }
      }
  },
  
})
