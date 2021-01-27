import company from "../../utils/company";

const app = getApp()
const router = require("../../utils/router")
const salesorder =require("../../utils/salesorder")
let _this;
Page({

  /**
   * 页面的初始数据 , { la: '发票查询', price: 3 }
   */
  data: {
    kdtype: [{ la: '金额统计', price: 1 }, { la: '数量统计', price: 2 }],
    flag:0,
    address:'',
    showShare: false,
    array: ['是','否'],
    show:false,
    starttime:"",
    endtime:'',
    companyname:'',
    ordermoney:'',
    condition:'是',
    type:"",
    types: [
      '普票','专票','代开专票','机动车发票','通用机打','电子普票'
    ],
    version:"",
    versions:[]
  },

  del(){
    this.setData({
      starttime:"",
      endtime:'',
      companyname:'',
      ordermoney:'',
      condition:'是',
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
      type:"",
      version:"",
    })
  },

  companynameFocus : function(){
    this.setData({companynameFocused:true});
    console.info("xxxxx")
  },
  
  companyname(e){
   this.setData({
     companyname:e.detail.value
   })
  },
  bindStarttimeDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      starttime: e.detail.value
    })
  },

  bindCondtionDateChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      condition: this.data.array[e.detail.value]
    })
  },
  
  bindEndtimeDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endtime: e.detail.value
    })
  },
  
  bindTypeDateChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      type: this.data.types[e.detail.value]
    })
  },
  

  onClose() {
    this.setData({ show: false });
  },

  showPopup() {
    this.setData({ show: true });
  },

  sure(){
     this.onClose();  
     if(this.data.flag==0){
       this.SalesOrderStatics();
     }else{
       this.InvoiceOperationStatistic();
     }
     
  },

  //这上面都是查询条件相关的东西

  SalesOrderStatics(){
    var json ={}
    json.starttime =this.data.starttime;
    json.endtime = this.data.endtime;
    json.companyname =this.data.companyname;
    json.condition =this.data.condition;
    var jsonstr = JSON.stringify(json)
     salesorder.SalesOrderStatics(this.data.company.id,jsonstr).then(res=>{
          if(res.data.msg==true){
            this.compareprice(res.data.list[0],res.data.list1[0],res.data.list2[0],res.data.list3[0],res.data.startTime, res.data.endTime)
            this.setData({
              usualcount:{
                starttime:res.data.startTime.total,
                endtime:res.data.endTime.total,
                text:"￥"+(res.data.list4[0].totalmoney==null?0:res.data.list4[0].totalmoney)
              }
            })
          }
     })
  },
  
  InvoiceOperationStatistic(){
    var json = {}
    json.type = this.data.type;
    json.starttime = this.data.starttime;
    json.endtime = this.data.endtime;
    var jsonstr = JSON.stringify(json)
    salesorder.InvoiceOperationStatistic(this.data.company.id, jsonstr).then(res=>{
      if(res.data.msg==true){
        let stats = res.data.stats;
        this.setData({
          quantityStats:stats
        })
      }
    })
  },
  
  compareprice(list,list1,list2,list3,startTime,endTime){
      this.setData({
        month:{
          starttime:startTime.month,
          endtime:endTime.month,
          text:"￥"+list.totalmoney
        },
        quarter:{
          starttime:startTime.quarter,
          endtime:endTime.quarter,
          text:"￥"+list1.totalmoney
        },
        year:{
          starttime:startTime.year,
          endtime:endTime.year,
          text:"￥"+list2.totalmoney
        },
        month12:{
          starttime:startTime.month12,
          endtime:endTime.month12,
          text:"￥"+list3.totalmoney
        }
      })
      console.log(this.data);
  },

  navTo(e) {
    var path = e.currentTarget.dataset.path;
    var type = e.currentTarget.dataset.type;
    let starttime = "";
    let endtime = "";
    if(type==="month"){
      starttime = this.data.month.starttime;
      endtime = this.data.month.endtime;
    }else if(type==="quarter"){
      starttime = this.data.quarter.starttime;
      endtime = this.data.quarter.endtime;
    }else if(type==="year"){
      starttime = this.data.year.starttime;
      endtime = this.data.year.endtime;
    }else if(type==="month12"){
      starttime = this.data.month12.starttime;
      endtime = this.data.month12.endtime;
    }else if(type==="total"){
      starttime = this.data.total.starttime;
      endtime = this.data.total.endtime;
    }
    
    wx.setStorageSync('starttime', starttime);
    wx.setStorageSync('endtime', endtime);
    
    router.switchTab(path);
    
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
    if(this.data.flag != e.currentTarget.dataset.index){
      this.setData({
        flag: e.currentTarget.dataset.index,
        starttime:"",
        endtime:'',
        companyname:'',
        condition:'是',
        type:"",
      })
    }
    if(e.currentTarget.dataset.index==1){
      if(this.data.needSubscribe){
        this.subscribeOnce();
      }
      this.InvoiceOperationStatistic();
    }else{
      this.SalesOrderStatics();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var company = wx.getStorageSync("company");
   
    if (company) {
      this.setData({
        company
      }) 
      //是否订阅了发票余量提醒
      this.checkSubscribe(company.id);
    }
    this.SalesOrderStatics();
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
  
  
  checkSubscribe(cid) {
    company.checkSubscribe(cid, '发票余量').then(res=>{
      console.info(res);
      let that = this;
      if(res.success==true){
        if(res.data && res.data.length==0){
          salesorder.minimessage("发票余量").then(res=>{
            if(res.data.msg==true){
              if(res.data.list.length>0){
                let tempidlist = res.data.list;
                that.setData({needSubscribe:true, tempidlist});
              }
            }
          })
        }
      }
    })
  },
  
  subscribeOnce() {
    let cid;
    var company = wx.getStorageSync('company');
    if(company){
      cid = company.id;
    }else{
      return;
    }
    let that = this;
    let tempidlist = this.data.tempidlist;
    wx.requestSubscribeMessage({
      tmplIds:tempidlist,
      success(res) {
        if(res[tempidlist[0]]=='accept'){
          console.log("订阅成功")
          that.subscribeOnceSuccess(cid);
        }else{
          console.log("点了取消订阅")
        }
      },
      fail(res) {
        console.log("不订阅")
      }
    })
  },
  
  subscribeOnceSuccess(cid){
    company.subscribeOnce(cid, '发票余量').then(res=>{
      console.info(res);
      let that = this;
      if(res.success==true){
        that.setData({needSubscribe:false})
        wx.showToast({
          title: "订阅成功",
        })
      }
    })
  }


})
