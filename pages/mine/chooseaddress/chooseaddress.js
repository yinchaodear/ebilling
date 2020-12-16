const app = getApp()
const company =require("../../../utils/company")
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cate:[
      {
        name:'ccc'
      },
      {
        name:'dddd'
      }
    ],
    flag:0,
    load:false,
    list:[  
  ]
  },
  chooseIt(e){
    let index = e.currentTarget.dataset.index
    var address = this.data.list[index];
    wx.setStorageSync('address', address);
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  changeTag(e){
    this.setData({
      flag:e.currentTarget.dataset.index
    })
    this.getList(this.data.cate[e.currentTarget.dataset.index].id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.oid){
         this.AddressDetail(options.oid)
    }
  },
  AddressDetail(id){
    company.AddressList(id,false).then(res=>{
     if(res.msg=='操作成功'){
       this.setData({
         list:res.data.addressList
       })
     }
   })
  },

  getCate(){
    app.com.post('address/cate/get',{
      pageIndex:1,
      pageSize:1000,
      wheres:'is_delete=0 and is_show=1 and a_id='+wx.getStorageSync("area").pk_id,
      sorts:'sort asc'
    },function(res){
      if(res.code == 1){
        _this.setData({
          cate:res.data.list
        })
        _this.getList(res.data.list[0].id)
      }
    })
  },
  getList(cate_id){
    this.setData({
      load:true
    })
    app.com.post('address/get',{
      pageIndex: 1,
      pageSize: 1000,
      wheres: 'is_delete=0 and cate_id='+cate_id+' and a_id=' + wx.getStorageSync("area").pk_id,
      sorts: 'sort asc'
    },function(res){
      if(res.code == 1){
        _this.setData({
          list:res.data.list,
          load:false
        })
      }
    })
  }
})