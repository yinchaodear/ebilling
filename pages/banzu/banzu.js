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
    pagesize:10,
    load:true,
    end:false,
    type:'全部',
    text:"全部"
  },
  SalesOrderList(type,expressstaus){
    if(this.data.load==true&&this.data.end==false){
       saleorder.SalesOrderList(type,  expressstaus,this.data.pageno,this.data.pagesize).then(res=>{
         this.setData({
          load:false
         })
         var list = this.data.list;
          if(res.msg =='操作成功'&&res.data.list.length>0){         
              list = list.concat(res.data.list);      
              this.setData({
              list:list,
              load:true
              })
          } else if(res.data.msg==true&&res.data.list.length==0){
            this.setData({
              end:true
            })
            console.log("已经没有更多")
         }
       })
      }else{
        console.log("正在加载");
      }

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
    //  if(options.type){
    //    this.SalesOrderList(options.type,this.data.text)
    //  }else{
    //    this.SalesOrderList(this.data.type)
    //  }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      list:[]
    })
    this.SalesOrderList(this.data.type)
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