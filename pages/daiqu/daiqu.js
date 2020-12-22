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
    condition:'是'
 
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
    })
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

  onClose() {
    this.setData({ show: false });
  },

  showPopup() {
    this.setData({ show: true });
  },

  sure(){
   
     this.onClose();  
     this.SalesOrderStatics();
  },


  //这上面都是查询条件相关的东西

  SalesOrderStatics(){
    var json ={}
    json.starttime =this.data.starttime;
    json.endtime = this.data.endtime;
    json.companyname =this.data.companyname;
    json.condition =this.data.condition;
    var jsonstr =JSON.stringify(json)
     salesorder.SalesOrderStatics(this.data.company.id,jsonstr).then(res=>{
          if(res.data.msg==true){
            this.compareprice(res.data.list[0],res.data.list1[0],res.data.list2[0],res.data.list3[0])
            this.setData({
              usualcount:{
                value:100,
                text:"￥"+res.data.list4[0].totalmoney==null?0:res.data.list4[0].totalmoney
              }
            })
          }
     })
  },
  
  compareprice(list,list1,list2,list3){
      var max = 0;
      if(list.totalmoney>max){
        max =list.totalmoney
      }
      if(list1.totalmoney>max){
        max =list1.totalmoney
      }
      if(list2.totalmoney>max){
        max =list2.totalmoney
      }
      if(list3.totalmoney>max){
        max =list3.totalmoney
      }
      this.setData({
        month:{
          value: parseInt(list.totalmoney/max*100),
          text:"￥"+list.totalmoney
        },
        quarter:{
          value: parseInt(list1.totalmoney/max*100),
          text:"￥"+list1.totalmoney
        },
        year:{
          value: parseInt(list2.totalmoney/max*100),
          text:"￥"+list2.totalmoney
        },month12:{
          value: parseInt(list3.totalmoney/max*100),
          text:"￥"+list3.totalmoney
        }
      })
      console.log(this.data);
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
    var company = wx.getStorageSync("company");
   
    if (company) {
      this.setData({
        company
      }) 
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


})