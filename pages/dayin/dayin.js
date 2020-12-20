const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
const salesorder =require('../../utils/salesorder')
const company =require("../../utils/company")
import Notify from '../../dist/notify/notify';
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redirect:'',
    showShare: false,
    title:'',
    apply:{ },
    activeNames: ['1'],
    activeNames1:['1'],
    activeNames2:['1'],
    ItemList:[{}]
  
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    const value =e.detail.value.join("");
    var nowarea =this.data.apply.area;
    var apply =this.data.apply;
    apply.area = value;
    this.setData({
      apply
    })
    if(value!=nowarea){
      this.Shipmoney()
    }
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
    }else if(title=='付款方式'){
      options= [
        {
          name: '寄付',
          icon: '../../img/jifu.png',
        },
        {
          name: '到付',
          icon: '../../img/daofu.png',
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
   }else  if(this.data.title=='付款方式'){

    apply.paytype = event.detail.name
    if(event.detail.name=='寄付'){
      this.Shipmoney()
    }
   this.setData({
     apply:apply
   })
 }
    
    this.onClose();
  },

  Shipmoney(){
     if(this.data.apply.expressway=='邮寄'&&this.data.apply.paytype=='寄付'){
          var reg = /.+?(省|市|自治区|自治州|县|区)/g;
          var city = this.data.apply.area.match(reg)
          console.log(city);
          salesorder.Shipmoney(city[0]).then(res=>{
              if(res.data.msg==true){
                var apply =this.data.apply;
                apply.expressmoney =res.data.postfee;
                this.setData({
                  apply:apply
                })
              }
          })
     }
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
        var nowarea =apply.area;
        apply.receipt = address.f_receipt
        apply.receiptel =address.f_receiptel
        apply.area = address.f_receiptarea
        apply.addressdetail = address.f_receiptaddress
        apply.shipcode = address.f_receiptecode;
        this.setData({
          apply:apply
        })
        if(address.f_receiptarea!=nowarea){
          this.Shipmoney();
        }
        wx.removeStorageSync('address');   
      }
    }
 
  },



  submit(e){
    console.log(e);
    var status = e.currentTarget.dataset.status;
    var apply =this.data.apply;
    apply.status =status;
    this.setData({
      apply:apply
    })
    wx.showLoading({
      title: '提交中',
    })
    if(status=='暂存'){
      console.log("不做事");
      this.addSalesOrder(this.data.apply,this.data.ItemList);
    }else{
      console.log("进行一系列判断");
      this.CheckSalesOrder();
    }
    return;

  },

  CheckSalesOrder(){
      var apply =this.data.apply;
      var ItemList =this.data.ItemList;
      if(this.data.apply.expressway=='邮寄'&&this.data.apply.paytype=='寄付'&&this.data.apply.alreadypay!='是'){
           //先进行运费的判断,如果小于 先把订单保存为暂存状态,然后提示要去充值
        salesorder.CompareShipmoney(this.data.apply.company.id,this.data.apply.expressmoney).then(res=>{
            if(res.data.msg==false){
              Notify({
                message: '当前开票单位余额为'+res.data.leftmoney+",订单转为暂存状态,请及时充值",
                duration: 2000,
               });      
               apply.status='暂存';
               this.setData({
                 redirect:'充值'
               })
               this.addSalesOrder(apply,ItemList,res.data.leftmoney);
            }else{
              //余额充足,先扣除余额,
               this.addSalesOrder(apply,ItemList);
            }
        })
      }else{
        console.log("不用校验运费")
        this.addSalesOrder(apply,ItemList);
      }    
       // this.addSalesOrder(this.data.apply,this.data.ItemList);
      
  },

 
  addSalesOrder(salesorder1,salesorderitem,leftmoney){
    var _this =this
    salesorder.AddSalesOrder(salesorder1,salesorderitem).then(res=>{
          if(res.data.msg==true){
            wx.removeStorageSync('company1')
            setTimeout(function(){
              if(_this.data.redirect=='充值'){
                router.redirectTo("/pages/mine/cash/cash?leftmoney="+leftmoney)
              }else{
                if(salesorder1.status=="审核中"||salesorder1.status=='加急'){
                  router.switchTab("/pages/banzu/banzu?type=审核中");
                }else{
                  router.switchTab("/pages/banzu/banzu?type=暂存");
                }    
              }
            },1500 )
           
                
        }else{
          app.globalData.Toast.showToast("保存失败")
        }
        
      
    })
  }
  

})