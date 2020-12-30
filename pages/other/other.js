//index.js
//获取应用实例
const app = getApp()
import Dialog from '../../dist/dialog/dialog';
import company from "../../utils/company"
let _this;
Page({
  data: {
    contractList:[
    
    ]
  },

  synchServiceContracts(cid){
     company.synchServiceContracts(cid).then(res=>{
       if(res.data.msg==true){
         var contractList =this.data.contractList;
         var item =JSON.parse(res.data.companyinfostr)
         var time =new Date(item.servicecontracts_start_date)
         var time1 =new Date(item.servicecontracts_end_date)
         item.starttime = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
         item.endtime= time1.getFullYear()+"-"+(time1.getMonth()+1)+"-"+time1.getDate();
         contractList.push(item)
         this.setData({
          contractList
         })
         console.log(item)
       }
     })
  },
  back(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  navTo(e) {
    app.com.navTo(e)
  },
  formSubmit(e) {
    let formId = e.detail.formId
    if (e.detail.value.des == '') {
      wx.showToast({
        title: '请填写帮助内容',
        icon: 'none'
      })
    } else if (e.detail.value.price == '') {
      wx.showToast({
        title: '请输入赏金',
        icon: 'none'
      })
    } else if (this.data.address == ''){
      wx.showToast({
        title: '请选择目的地',
        icon: 'none'
      })
    } else if (e.detail.value.price <1){
      wx.showToast({
        title: '输入金额不能小于1',
        icon: 'none'
      })
    }else {
      wx.showLoading({
        title: '加载中',
      })
      app.com.post('help/add', {
        openid: wx.getStorageSync("user").openid, 
        des: e.detail.value.des,
        wx_id: wx.getStorageSync("user").id,
        total_fee: e.detail.value.price,
        a_id: wx.getStorageSync("area").pk_id,
        title:this.data.title,
        mu: this.data.address,
        qi: e.detail.value.qi,
        form_id: e.detail.formId,
      }, function (res) {
        wx.hideLoading()
        if (res.code == 1) {
          _this.wxpay(res)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  wxpay(msg) {
    app.com.wxpay(msg)
  },
  navTo(e) {
    app.com.navTo(e)
  },
  navToArea() {
    wx.navigateTo({
      url: '/pages/area/area',
    })
  },
  publist() {
    wx.navigateTo({
      url: '/pages/pub/pub',
    })
  },
  tagsClick(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      price:this.data.msg.tagsFilter[index].price,
      des: this.data.msg.tagsFilter[index].label
    })
  },
  onLoad: function (options) {
      if(options.from=='index'){
        var company = wx.getStorageSync('company');
        if(company==''){
          Dialog.alert({
            title: '',
            message: "没有选择相关企业,请返回首页选择后再进行查看",
          }).then(() => {
            // on close
            wx.navigateBack({
              complete: (res) => {},
            })
          });
        }else{
          var cid =company.id;
          this.synchServiceContracts(cid);
        }
      }
  },
  onShow() {
    // this.checkcontracts();
  },
  checkcontracts(){
    debugger;
    let  contractList = this.data.contractList;
    let msg =""
    for(var i in contractList){
      if(contractList[i].type=='按次合同'&&contractList[i].left<3){
        msg+="编号为"+contractList[i].no+"的合同剩余次数为"+contractList[i].left
      }
    }
    Dialog.alert({
      title: '合同剩余',
      message: msg,
    }).then(() => {
      // on close
    });
  }

})
