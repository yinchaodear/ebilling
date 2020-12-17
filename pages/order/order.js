// pages/order/order.js
const app = getApp()
const login = require("../../utils/login")
const router = require("../../utils/router");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags:['我发出的','我收到的'],
    tagFlag:0,
    list:[],
    pageno:0,
    pagesize:10,
    load:true,
    end:false,
  },
  changeTag(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      tagFlag:index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow:function(){

    this.SystemMessage();
  },

  onPullDownRefresh(){
    console.log("刷新");
    this.setData({
      list:[],
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
    })
    this.SystemMessage()
  },

  SystemMessage(){
    if(this.data.load==true&&this.data.end==false){
      login.SystemMessage(this.data.pageno,this.data.pagesize).then(res=>{
       this.setData({
         load:false
       })
         var list = this.data.list;
        if(res.data.msg==true&&res.data.list.length>0){
          list =list.concat(res.data.list);
          this.setData({
             list:list,
             load:true
          })
        }else if(res.data.msg==true&&res.data.list.length==0){
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
  navTo(e){
    console.log(e);
    var id =e.currentTarget.dataset.id;
    router.navigateTo("/pages/order/detail/detail?orderid="+id)
  },
  onReachBottom(){
     console.log("上拉加载");
     this.setData({
       pageno:this.data.pageno+1
     })
     this.SystemMessage()

  }


  
})