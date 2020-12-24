const app = getApp()
const company =require("../../utils/company")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
   
    ],
    load:false,
    search:'',
    wheres:''
  },
  searchInput(e){
    let search = e.detail.value
    this.setData({
      search:search
    })
    var list  = this.data.list;
    for(var i in list){
       if(list[i].accountname.indexOf(search)!=-1){
         list[i].show=true
       }else{
        list[i].show=false
       }
    }
    this.setData({
      list:list
    })
    // this.getArea()
  },

  QueryMyCompany:function(){
    company.QueryMyCompany().then(res=>{
        this.setData({
          list:res.data
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#6e42d3',
    })
    this.QueryMyCompany();
  },
  checkedIt(e){
    var _this = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '请确认您的选择',
      content: '您的选择是"' + _this.data.list[index].accountname+'"',
      cancelText:'我点错了',
      confirmText:'确认',
      confirmColor:'#6887e1',
      success(res){
        if(res.confirm){
          wx.setStorageSync('company', _this.data.list[index])
          wx.navigateBack({
            complete: (res) => {},
          })
        }else{

        }
      }
    })
    
  },
  getArea(){
   
  },
  getDail(aid){
    app.com.post('user/get/aid',{
      aid:aid
    },function(res){
      if(res.code == 1){
        wx.setStorageSync("dl", res.data)
        // _this.getServer(res.data.pk_id)
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },  
  getServer(id){
    app.com.post('server/get/uid', {
      uid: id
    }, function (res) {
      if (res.code == 1) {
        wx.setStorageSync("server", res.data)
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

})