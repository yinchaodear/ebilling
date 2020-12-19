const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
const salesorder =require('../../utils/salesorder')
const company =require("../../utils/company")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    no:'',
    page:0,
    cai:false,
    total_fee:0,
    address:'',
    showShare: false,
    title:'',
    apply:{
      
      company1:{
        name:"测试1",
        id:'1112'
      }
    },
    activeNames: ['1'],
    activeNames1:['1'],
    activeNames2:['1'],
    ItemList:[{}]
  
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    const value =e.detail.value.join("");
    var apply =this.data.apply;
    apply.area = value;
    this.setData({
      apply
    })
  },
  additem(){
    var obj ={};
    var ItemList = this.data.ItemList;
    if(ItemList.length==8){
      Toast.showToast("最多添加8项");
      return;
    }
    ItemList.push(obj)
    this.setData({
      ItemList:ItemList
    })
  },

  confirmitemList(e){
    var index =e.currentTarget.dataset.index;
    var name= e.currentTarget.dataset.name;
    var value =e.detail.value;
    var ItemList = this.data.ItemList;
    ItemList[index][name] =value;
    if(ItemList[index].number!=''&&ItemList[index].unitprice!=''){
      ItemList[index].money=ItemList[index].number*ItemList[index].unitprice
    }
    this.setData({
      ItemList:ItemList
    })
    console.log(ItemList)
  },  

  del(){
     salesorder.RemoveSalesOrder(this.data.apply.id).then(res=>{
       if(res.data.msg==true){
         wx.navigateBack({
           complete: (res) => {},
         })
       }
     })
  },
   
  deleteitem(e){
    var index = e.currentTarget.dataset.index;
    var ItemList =this.data.ItemList;
    var item =ItemList[index];
    console.log(item);
    if(item.id){
      console.log("数据删除");
      this.RemoveSalesOrderItem(item.id);
    }else{
      ItemList.splice(index,1);
      this.setData({
        ItemList:ItemList
      })
    }
  },
  RemoveSalesOrderItem(id){
    salesorder.RemoveSalesOrderItem(id).then(res=>{
      if(res.data.msg==true){
        this.GetSalesOrderInfo(this.data.apply.id);
      }
    })
  },
  
  onItemChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onItemChange1(event) {
    this.setData({
      activeNames1: event.detail,
    });
  },
  onItemChange2(event) {
    this.setData({
      activeNames2: event.detail,
    });
  },


  applycomplete(e){
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var value =e.detail.value;
    var apply =this.data.apply;
    apply[type] = value;
    this.setData({
      apply:apply
    })
    console.log(apply)
  },


  onClick(e) {
    var title = e.currentTarget.dataset.title;
    var options=[]
    if(title=='取件方式'){
       options =[
        {
          name: '自取',
          icon: '../../img/ziqu.png',
        },
        {
          name: '邮寄',
          icon: '../../img/youji.png',
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
  onClose() {
    this.setData({ showShare: false });
  },
  onSelect(event) {
    console.log(event.detail.name);
    var apply =this.data.apply;
    if(this.data.title=='票据种类'){
       apply.type = event.detail.name
      this.setData({
        apply:apply
      })
    }else  if(this.data.title=='取件方式'){
      if(event.detail.name=='邮寄'&&this.data.apply.company1){
        //查找对方单位的默认地址
         this.AddressDetail();
      }
      apply.expressway = event.detail.name
     this.setData({
       apply:apply
     })
   }
    
    this.onClose();
  },


  AddressDetail(){
    company.AddressList(this.data.apply.company1.id,true).then(res=>{
      var apply =this.data.apply;
      if(res.data.msg==true&&res.data.addressList.length!=0){
        var obj = res.data.addressList[0]
        apply.receipt = obj.f_receipt;
        apply.receiptel = obj.f_receiptel;
        apply.area = obj.f_receiptarea;
        apply.addressdetail = obj.f_receiptaddress;
        apply.shipcode = obj.f_receiptecode;    
      }else{
        var apply =this.data.apply;
        apply.receipt = ""
        apply.receiptel = ""
        apply.area = ""
        apply.addressdetail = ""
        apply.shipcode =""
      }
      this.setData({
        apply:apply
      })
   })
  },


  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path);
  },
  chooseFile(){
    wx.navigateTo({
      url: '/pages/dayin/dy/dy',
    })
    // wx.chooseMessageFile({
    //   count: 1,
    //   type: 'all',
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths
    //     console.log(res)
    //   }
    // })
  },
  pageInput(e){
    this.data.page = e.detail.value
    this.init()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        if(options.orderid){
           this.GetSalesOrderInfo(options.orderid);
        }
  },

  GetSalesOrderInfo(id){
    salesorder.GetSalesOrderInfo(id).then(res=>{
      if(res.data.msg==true){
        this.setData({
          apply:res.data.orderdetail,
          ItemList:res.data.orderitem
        })
     }
    })
  },
  
  onUnload(){
      console.log("我被销毁了");
      wx.removeStorageSync('company1');       
      wx.removeStorageSync('address');
  },

  onShow(){
    var company = wx.getStorageSync("company");
    var company1 = wx.getStorageSync("company1");
    var address  =wx.getStorageSync('address');
    if(company){
      var apply =this.data.apply;
      apply.company =company
      this.setData({
       apply:apply
      })
    }
    if(company1){
      var apply =this.data.apply;
      apply.company1 =company1
      this.setData({
       apply:apply
      })
      if(this.data.apply.expressway=='邮寄'&&address==''){
        this.AddressDetail();
      }else{
        console.log("加载刚才存进来的");
        var apply =this.data.apply;
        apply.receipt = address.f_receipt
        apply.receiptel =address.f_receiptel
        apply.area = address.f_receiptarea
        apply.addressdetail = address.f_receiptaddress
        apply.shipcode = address.f_receiptecode;
        this.setData({
          apply:apply
        })
        wx.removeStorageSync('address');   
      }
    }
 
  },



  submit(e){
    console.log(e);
    var status = e.currentTarget.dataset.status;
    wx.showLoading({
      title: '提交中',
    })
    var apply =this.data.apply;
    apply.status =status;
    this.setData({
      apply:apply
    })
    console.log(this.data.apply);
    console.log(this.data.ItemList);
    this.addSalesOrder(this.data.apply,this.data.ItemList);
  },
 
  addSalesOrder(salesorder1,salesorderitem){
    salesorder.AddSalesOrder(salesorder1,salesorderitem).then(res=>{
      app.globalData.Toast.showToast("申请成功"); 
      setTimeout(() => {
          if(res.data.msg==true){
            wx.removeStorageSync('company1')
            if(salesorder1.status=="审核中"||salesorder1.status=='加急'){
              router.switchTab("/pages/banzu/banzu?type=审核中");
            }else{
              router.switchTab("/pages/banzu/banzu?type=暂存");
            }           
        }else{
          app.globalData.Toast.showToast("保存失败")
        }
        }, 1500);
      
    })
  }
  

})