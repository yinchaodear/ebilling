const app = getApp()
const router =require('../../utils/router')
const Toast =require('../../utils/Toast')
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
      company:{
        name:"测试",
        id:'111'
      },
      company1:{
        name:"测试1",
        id:'1112'
      }
    },
    activeNames: ['1'],
    activeNames1:['1'],
    ItemList:[{}]
  
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
    this.setData({
      ItemList:ItemList
    })
    console.log(ItemList)
  },

  deleteitem(e){
    var index = e.currentTarget.dataset.index;
    var ItemList =this.data.ItemList;
    ItemList.splice(index,1);
    this.setData({
      ItemList:ItemList
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
      apply.experssway = event.detail.name
     this.setData({
       apply:apply
     })
   }
    
    this.onClose();
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

  },
  onShow(){
    
  },

  submit(){
    console.log(this.data.apply);
    console.log(this.data.ItemList);
  }
 
  
  

})