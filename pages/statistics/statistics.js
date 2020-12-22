const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
const account =require('../../utils/account')
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
    tag:[],
    active: 0,
    flag:0,
    info:{},
    wheres:"",
    sorts:"",
    fields:'',
    pageno:0,
    pagesize:10,
    load:true,
    end:false,
    type:'全部',
    text:"全部",
    show:false,
    starttime:"",
    endtime:'',
    companyname:''
  },

  del(){
    this.setData({
      starttime:"",
      endtime:'',
      companyname:''
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

  bindEndtimeDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endtime: e.detail.value
    })
  },
  submit(){
      this.onClose()
     
      this.Statics(this.data.type,this.data.id)
  },

  onClose() {
    this.setData({ show: false });
  },

  showPopup() {
    this.setData({ show: true });
  },

  deatail(e){
    router.navigateTo("/pages/order/detail/detail?orderid="+e.currentTarget.dataset.id);
  },

  onClick(event) {
    console.log(event);
    var index =event.detail.index;
    if(index==0){
      console.log("统计全部的");
      this.setData({
        type:'全部'
      })
      this.Statics("全部");
    }else{
      var id = this.data.tag[index].id;
      this.setData({
        id,
        type:'公司'

      })
      console.log("查询id为"+id+'的公司')
      this.Statics("公司",id);
    }
   

  },

  Statics(name,id,json){
    var json ={}
    json.starttime =this.data.starttime;
    json.endtime = this.data.endtime;
    json.companyname =this.data.companyname;
    var jsonstr =JSON.stringify(json)
     account.Statics(name,id,jsonstr).then(res=>{
        if(res.data.msg ==true){
          var info =res.data.list[0];
          info.count =res.data.list1[0].count;
          this.setData({
            info,
            list:res.data.list2
          })

        }
     })
  },

  AccountInfoList(){
    account.AccountInfo().then(res=>{
        if(res.data.msg==true){
          var obj={
            name:'全部'
          }
          var tag = this.data.tag.concat(obj).concat(res.data.list);
          this.setData({
            tag
          })
          this.Statics("全部");
        }
    })

  },

  onReachBottom(){
    console.log("上拉加载");
    this.setData({
      pageno:this.data.pageno+1
    })
    this.SalesOrderList(this.data.type,this.data.text)

 },


  //这边是筛选条件
  itemchange(e){
    console.log(e);
    var index = e.detail;
    var text = this.data.option1[index].text;
    this.setData({
      text,
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
      list:[],
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
      text:"全部",
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
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
    this.AccountInfoList();
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
    console.log("刷新");
    this.setData({
      list:[],
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
    })
    this.SalesOrderList(this.data.type)
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