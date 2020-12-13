const app = getApp()
const router = require("../../../utils/router")
const company = require("../../../utils/company")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        name:"xxx公司",
        detail:"1231345",
        id:12313
      },
      {
        name:"xxx1公司",
        detail:"123134511",
        id:1231333
      }
    ],
    load:false,
    choose:1
  },
  QueryOtherCompany(ID){
    company.QueryOtherCompany(ID).then(res=>{

      console.log(res);
      this.setData({
        list:res.data
      })
    })
  },

  chooseIt(e){
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('company1', this.data.list[index]);
    wx.navigateBack({
      
    })
  },
  del(e){
    var _this= this;
    let index = e.currentTarget.dataset.index
    var id = this.data.list[index].id
    wx.showModal({
      title: '提示',
      content: '删除后该数据将无法恢复，是否继续?',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '删除中',
            task:true
          })
          company.DeleteOtherCompany(id).then(res=>{
                if(res.data.msg==true){
                  wx.hideLoading({
                    complete: (res) => {
                      app.globalData.Toast.showToast("删除成功")
                      _this.QueryOtherCompany();
                    },
                  })
                }
          })
        }
      }
    })
  },
  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path)
  },
  bj(e){
    wx.navigateTo({
      url: '/pages/mine/addressinfo/addressinfo?data='+JSON.stringify(this.data.list[e.currentTarget.dataset.index]),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     console.log(app)
    app.Toast.showToast("删除成功")
    _this = this
    _this.setData({
      choose: options.choose ? options.choose:0
    })
  },
  getList(){
    this.setData({
      load:true
    })
    app.com.post('user/address/get',{
      pageIndex:1,
      pageSize:1000,
      wheres:'is_delete=0 and wx_id='+wx.getStorageSync("user").id,
      sorts:'create_time desc'
    },function(res){
      if(res.code == 1){
        _this.setData({
          list:res.data.list,
          load:false
        })
      }
    })
  },
  onShow: function (){
     var company = wx.getStorageSync('company');
     if(company){
       this.QueryOtherCompany(company.id);
     }
  }
})