const app = getApp()
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    address:'',
    mo:false
  },
  dchange(e){
    this.setData({
      mo:e.detail.value
    })
  },
  navTo(e){
    app.com.navTo(e)
  },
  bInput(e){
    console.log(e);
    var value =e.detail.value;
    var name =e.currentTarget.dataset.name;
    var detail =this.data.detail;
    detail[name]=value;
    this.setData({
      detail:detail
    })

  },
  submit(){
    console.log(this.data.detail)
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 

  },

  
})