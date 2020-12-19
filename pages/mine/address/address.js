const app = getApp()
const router = require("../../../utils/router")
const company = require("../../../utils/company")
import Dialog from '../../../dist/dialog/dialog';
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
    ],
    
    choose:1,
    companyid:'',
    pageno:0,
    pagesize:10,
    load:true,
    end:false,
    value:'',
    show: false,
    actions: [
      
    ],
  },

  fast(e){
     console.log(e.currentTarget.dataset.id);
     const index = e.currentTarget.dataset.index;
     console.log(this.data.list[index]);
     this.setData({
       company1:this.data.list[index]
     })
     this.setData({
       show:true
     })
     this.GetCompanyAccountInfoList(e.currentTarget.dataset.id);
  },

  GetCompanyAccountInfoList(ID){
    company.GetCompanyAccountInfoList(ID).then(res=>{
        if(res.data.msg==true){
          this.setData({
            actions:res.data.list
          })
        }
    })
  },
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
    var company ={}
    company.id=event.detail.id
    company.accountname=event.detail.name
    company.accountcode=event.detail.subname
    wx.setStorageSync('company', company);
    wx.setStorageSync('company1', this.data.company1)
    router.navigateTo("/pages/dayin/dayin")
  },
  
  onChange(e) {
    this.setData({
      value: e.detail,
     
    });
    if(e.detail==''){
      this.setData(
        {
          list:[]
        }
      )
      this.SearchChose()
    }
  },
  
  onSearch(e) {
    console.log(e.detail)
    if(e.detail ==''){
      app.globalData.Toast.showToast("输入为空")
      return;
    }
    this.setData({
      value:e.detail,
      list:[]
    })
    this.SearchChose()
  },
  QueryOtherCompany(ID){
    if(this.data.load==true&&this.data.end==false){
    company.QueryOtherCompany(ID,this.data.pageno,this.data.pagesize,this.data.value).then(res=>{
      this.setData({
        load:false
       })
      var list =this.data.list;
      if(res.msg=='操作成功'&&res.data.length>0){
        list= list.concat(res.data);
        this.setData({
          list:list,
          load:true
        })
      } else if(res.msg=='操作成功'&&res.data.length==0){
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
    if(this.data.from=='form'){
      this.QueryOtherCompany(this.data.companyid);
    }else{
      this.QueryOtherCompany()
    }
    

 },

  chooseIt(e){
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('company1', this.data.list[index]);
    if(this.data.from=='form'){
      wx.navigateBack({   
      })
    }else{
        
    }

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
          company.DeleteOtherCompany(id,_this.data.companyid).then(res=>{
                if(res.data.msg==true){
                  _this.setData({
                    pageno:0,
                    pagesize:10,
                    load:true,
                    end:false,
                    list:[]
                  })
                  wx.hideLoading({
                    complete: (res) => {
                      app.globalData.Toast.showToast("删除成功")
                      _this.QueryOtherCompany(_this.data.companyid);
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
  navToAdd(e) {
    var path = e.currentTarget.dataset.path;
    path+="?companyid="+this.data.companyid;
    router.navigateTo(path)
  },
  bj(e){
    let index = e.currentTarget.dataset.index
    var id = this.data.list[index].id
    wx.navigateTo({
      url: '/pages/mine/addressinfo/addressinfo?otherid='+id+"&companyid="+this.data.companyid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       if(options.from=='form'){
        var company = wx.getStorageSync('company');//当前选择的公司
        if(company!=''){
          this.setData({
            companyid:company.id,
            from:options.from
          })
          //this.QueryOtherCompany(company.id);
        }else{
          Dialog.alert({
            title: '',
            message: "没有选择开票单位,请返回上一页选择后再进行查看",
          }).then(() => {
            // on close
            wx.navigateBack({
              complete: (res) => {},
            })
          });
        }
       }else if(options.from=='index'){
            console.log("加载全部的");
            this.setData({
              from:options.from
            })
            // this.QueryOtherCompany();
       }
  },
 
  onShow: function (){
    this.setData({
      pageno:0,
      pagesize:10,
      load:true,
      end:false,
      list:[]
    })
      this.SearchChose()
    
  },

  SearchChose(){
    if(this.data.companyid!=''&&this.data.from=='form'){   
      this.QueryOtherCompany(this.data.companyid);
    }else{
      this.QueryOtherCompany()
    }
  }
})