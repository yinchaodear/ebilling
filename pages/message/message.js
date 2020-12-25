// pages/order/order.js
const app = getApp()
const message = require("../../utils/message")
const router = require("../../utils/router");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagFlag:0,
    list:[],
    pageno:1,
    pagesize:10,
    loading:false,
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
    this.onPullDownRefresh();
  },

  onPullDownRefresh(){
    console.log("刷新");
    this.reset();
    this.SystemMessage()
  },

    reset(){
        this.setData({
          list:[],
          pageno:1,
          pagesize:10,
          loading:false,
          end:false,
        })
    },
    
  SystemMessage(){
    const app = getApp();
    if(this.data.loading==false && this.data.end==false){
      message.SystemMessage(this.data.pageno, this.data.pagesize).then(res=>{
       this.setData({
         loading:true
       })
        var list = this.data.list;
        if(res.success==true&&res.data.length>0){
            for(var x in res.data){
                res.data[x].sendTime = app.formatDate(res.data[x].sendTime, 'yyyy-MM-dd HH:mm:ss');
            }
            list = list.concat(res.data);
            this.setData({
             list:list,
             loading:false
            })
        }else if(res.success==true&&res.data.length==0){
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
    var id = e.currentTarget.dataset.id;
    
    let msgObj = {};
    let list = this.data.list;
    for(var x in list){
        if(list[x].id==id){
            msgObj = list[x];
        }
    }
    //标记为已读
    message.batchMark(id).then(res=>{
        if(res.success==true){
            msgObj.status = '已读';
        }else if(res.success==true&&res.data.length==0){
           console.log("标记为已读失败")
        }
    })
    router.navigateTo("/pages/message/detail/detail?message="+JSON.stringify(msgObj))
  },
    
  onReachBottom(){
     console.log("上拉加载");
     this.setData({
       pageno:this.data.pageno+1
     })
     this.SystemMessage()
  }
  
})
