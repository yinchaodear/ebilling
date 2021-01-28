const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
const saleorder =require("../../utils/salesorder")
import Dialog from '../../dist/dialog/dialog';
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
    tag:['全部','审核中','开具中','待确认','已开具','已作废','已完成','暂存'],
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
    text:"全部",
    array: ['大于等于','等于','小于等于'],
    show:false,
    starttime:"",
    endtime:'',
    companyname:'',
    ordermoney:'',
    condition:''
  },

  del(){
    this.setData({
      starttime:"",
      endtime:'',
      companyname:'',
      ordermoney:'',
      condition:'',
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
    })
  },

  querywaittip(e){
       const oid =e.currentTarget.dataset.oid;
       saleorder.querywaittip(oid).then(res=>{
                if(res.data.msg==true){
                  Dialog.alert({
                    title: '等待详情',
                    message: res.data.result
                  }).then(() => {
                    // on close
                  });
                }
       })
  },

  ordermoney(e){
    this.setData({
      ordermoney:e.detail.value
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
    this.setData({
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
      list:[]
    })
     this.onClose();
     debugger;
     this.SalesOrderList(this.data.type,this.data.text)
  },


  //这上面都是查询条件相关的东西


  SalesOrderList(type,expressstaus){
    var json ={}
    json.starttime =this.data.starttime;
    json.endtime = this.data.endtime;
    json.companyname =this.data.companyname;
    json.ordermoney =this.data.ordermoney;
    json.condition =this.data.condition;
    var jsonstr = JSON.stringify(json)
    if(this.data.load==true&&this.data.end==false){
       saleorder.SalesOrderList(type,  expressstaus,this.data.pageno,this.data.pagesize,jsonstr).then(res=>{
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
    let item = e.currentTarget.dataset.item;
    console.info(item)
    let that = this;
    if(item.f_is_sub_express_msg==0 && item.f_express_type=='邮寄' && item.f_sostatus!='已作废'  &&  item.f_sostatus!='已完成' && this.data.tempidlist && this.data.tempidlist.length>0){
        let tmplIds = this.data.tempidlist;
        wx.requestSubscribeMessage({
            tmplIds : tmplIds,
            success(res) {
                if(res[tmplIds[0]]=='accept'){//简单判断
                     console.log("订阅")
                    //设置为已订阅
                    that.updateSalesOrderExpressSubStatus(item.f_id);
                    router.navigateTo(path);
                }else{
                    router.navigateTo(path);
                }
            },
            fail(res) {
                console.log("不订阅")
                router.navigateTo(path);
            }
        })
    }else if(item.f_is_sub_qujian_msg==0 && item.f_express_type=='自取' && item.f_sostatus!='已作废'  &&  item.f_sostatus!='已完成' && this.data.tempidlist2 && this.data.tempidlist2.length>0){
        let tmplIds = this.data.tempidlist2;
        wx.requestSubscribeMessage({
            tmplIds : tmplIds,
            success(res) {
                if(res[tmplIds[0]]=='accept'){//简单判断
                    console.log("订阅")
                    //设置为已订阅
                    that.updateSalesOrderQujianSubStatus(item.f_id);
                    router.navigateTo(path);
                }else{
                    router.navigateTo(path);
                }
                
            },
            fail(res) {
                console.log("不订阅")
                router.navigateTo(path);
            }
        })
    }else{
        router.navigateTo(path);
    }
  },
    
    updateSalesOrderExpressSubStatus(id) {
      saleorder.updateSalesOrderExpressSubStatus(id).then(res=>{
        console.info(res);
      })
    },
    
    updateSalesOrderQujianSubStatus(id) {
      saleorder.updateSalesOrderQujianSubStatus(id).then(res=>{
        console.info(res);
      })
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
    
  minimessage(){
    saleorder.minimessage("快递").then(res=>{
      console.log("程序模板")
      console.log(res)
      if(res.data.msg==true){
        if(res.data.list.length>0){
          this.setData({
            tempidlist:res.data.list
          })
        }
      }
    })
    saleorder.minimessage("自取").then(res=>{
      console.log("程序模板")
      console.log(res)
      if(res.data.msg==true){
        if(res.data.list.length>0){
          this.setData({
            tempidlist2:res.data.list
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //可能是从统计跳转过来的
    let starttime = wx.getStorageSync('starttime');
    let endtime = wx.getStorageSync('endtime');
    //用过一次就删掉
    wx.removeStorageSync('starttime');
    wx.removeStorageSync('endtime');
    
    this.setData({
        pageno:0,
        pagesize:10,
        load:true,
        end:false,
        list:[],
        starttime,
        endtime
    })
    this.SalesOrderList(this.data.type,this.data.text);
    this.minimessage();
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
      title:'横竖湾一键智能发票通',
      path:'/pages/index/index'
    }
  }
})
