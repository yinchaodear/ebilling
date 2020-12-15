const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
const saleorder =require("../../utils/salesorder")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[   
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
    flag:0,
    url:'get',
    wheres:"",
    sorts:"",
    fields:'',
    pageno:0,
    pagesize:20,
    type:'全部',
    text:"全部"
  },
  SalesOrderList(type,expressstaus){
       saleorder.SalesOrderList(type,  expressstaus,this.data.pageno,this.data.pagesize).then(res=>{
          if(res.msg =='操作成功'){
            var list=  this.data.list;
            if(res.data.list.length>0){
              list = list.concat(res.data.list);
            }
            this.setData({
              list:list
            })
          } 
         

       })
  },



  //这边是筛选条件
  itemchange(e){
    console.log(e);
    var index = e.detail;
    var text = this.data.option1[index].text;
    this.setData({
      text,
      list:[]
    })
     this.SalesOrderList(this.data.type,text);
  },


  comfirm(e){
    console.log(e);
    let id = e.currentTarget.dataset.id;
    router.navigateTo("/pages/dayin/dayin?orderid="+id);

  },
  takeIt(e){

    
  },
  takeDo(msg){

  },
  pay(e) {

  },
  cancel(e){

    
  },
  changeTag(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      flag: e.currentTarget.dataset.index,
      type:this.data.tag[index],
      list:[],
      text:"全部"
    })
    this.SalesOrderList(this.data.type,this.data.text)
  },
  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.type){
       this.SalesOrderList(options.type,this.data.text)
     }else{
       this.SalesOrderList(this.data.type)
     }
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