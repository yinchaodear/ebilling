const app = getApp()
const company =require("../../../utils/company")
import Notify from '../../../dist/notify/notify';
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    address:'',
    mo:false,
    activeNames: ['1'],
    ItemList:[{}]
  },

  GetCompanyInfo(){
     console.log(this.data.detail.name);
     company.GetCompanyInfo(this.data.detail.name).then(res=>{
       if(res.data.msg==true){
         var qcresult =res.data.qcresult;
         var detail =this.data.detail;
         detail.code = qcresult.creditCode
         detail.address= qcresult.address
         detail.phone =qcresult.tel
         this.setData({
          detail
         })
         Notify({
          message: '该企业状态:'+qcresult.status,
          duration: 2000,
         });
       }
     })
  },
  additem(){
    var obj ={};
    var ItemList = this.data.ItemList;
   
    ItemList.push(obj)
    this.setData({
      ItemList:ItemList
    })
  },
  deleteitem(e){
    var _this =this;
    var index = e.currentTarget.dataset.index;
    var addressid = this.data.ItemList[index].id;
    var ItemList =this.data.ItemList;
    if(addressid==''||addressid==undefined){
    ItemList.splice(index,1);
    this.setData({
      ItemList:ItemList
    })
  }else{
    company.DeleteCompanyOtherAddress(addressid).then(res=>{
      if(res.data.msg==true){
        app.globalData.Toast.showToast("删除成功");
        this.GetCompanyOtherInfo(this.data.otherid)
      }
    })
  }

  
  },

  onItemChange(event) {
    this.setData({
      activeNames: event.detail,
    });
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
  dchange(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var ItemList =this.data.ItemList;
    for(var i  in ItemList){
      if(index==i){
        if(ItemList[i].f_defaultflag==0){
          ItemList[i].f_defaultflag=1
        }else{
          ItemList[i].f_defaultflag=0
        }
        
      }else{
        ItemList[i].f_defaultflag=1
      }
    }
    this.setData({
      ItemList:ItemList
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
    console.log(this.data.detail);
    console.log(this.data.ItemList)
    var detail =this.data.detail;
    if(detail.name==''){
      app.globalData.Toast.showToast("企业名称为空");
      return;
    }

    if(detail.code==''){
      app.globalData.Toast.showToast("社会信用代码为空");
      return;
    }

    company.QccCompany(detail.name,detail.code).then(res=>{
         if(res.data.msg==1){
           console.log("企业查查对的");
           this.AddCompanyotherAddress();
         }else if(res.data.msg==0){
           Notify({
            message: '企业名称或者社会信用代码有误,无法保存',
            duration: 2000,
           });
           return;
         }else if(res.data.msg==4){
          Notify({
            message: '企业查询接口出错,请联系客服',
            duration: 2000,
          });
          this.AddCompanyotherAddress();
        }
    })
return;
  
  },

  AddCompanyotherAddress(){
    company.AddCompanyotherAddress(this.data.detail,this.data.ItemList).then(res=>{
      if(res.data.msg==true){
         app.globalData.Toast.showToast("操作成功");
         this.GetCompanyOtherInfo(res.data.id);
      }
})
  },
  
  GetCompanyOtherInfo(otherid){
    company.GetCompanyOtherInfo(otherid).then(res=>{
      if(res.data.msg==true){
        this.setData({
          otherid:otherid,
          detail:res.data.otherinfo[0],
          ItemList:res.data.addressinfo
        })
      }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        console.log(options)
        var  otherid  =options.otherid;
        if(otherid){
          this.setData({
            otherid:otherid
          })
          this.GetCompanyOtherInfo(otherid)
        }else{
          var detail =this.data.detail;
          detail.companyid = options.companyid
          this.setData({
            companyid:options.companyid,
            detail:detail
          })
        }

       

  },

  
})