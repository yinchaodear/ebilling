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



  bindinputtextarea(e){
      console.log(e);
      this.setData({
        companystr:e.detail.value
      })
  },

  companyinfostatic(){
      console.log("数据解析")
      company.Parse(this.data.companystr).then(res=>{
        if(res.data.msg==true){
          var detail ={}
          var companyinfo =res.data.companyinfo 
          detail.address =  companyinfo.address
          detail.name =companyinfo.companyName
          if(companyinfo.companyName!=null){
            this.GetCompanyInfo(companyinfo.companyName);
          }
          detail.code =companyinfo.taxno;
          detail.phone =companyinfo.phone;
          detail.bank =companyinfo.bank;
          detail.account =companyinfo.bankAccount;
          this.setData({
             detail
          })
        }

      })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    const value =e.detail.value.join("");
    var ItemList = this.data.ItemList;
    ItemList[e.currentTarget.dataset.index]['receiptarea'] =value;
    this.setData({
      ItemList:ItemList
    })
    this.setData({
      region: e.detail.value
    })
  },
  GetCompanyInfo(name){
    debugger
     var namenow=''
     if(typeof name =='string'){
         namenow=name;
     }else{
       namenow =this.data.detail.name;
     }
     console.log(namenow);
     this.setData({
      searchlist:[]
     })
     company.GetCompanyInfo(namenow).then(res=>{
       if(res.data.msg==true&&res.data.qcresult!=null){
         var qcresult =res.data.qcresult;
         var detail =this.data.detail;
         detail.code = qcresult.creditCode
         detail.name =qcresult.name;
         this.setData({
          detail
         })
         Notify({
          message: '该企业状态:'+qcresult.status,
          duration: 2000,
         });
       }else if(res.data.msg==false){
         this.GetCompanyOtherInfo(res.data.id);
       }else if(res.data.msg=="error"){
        Notify({
          message: '企业名称数据传入有错误,企查查接口调用失败',
          duration: 2000,
         });
      }
     })
  },


  GetCompanyInfo1(name){
    var namenow=''
    if(typeof name =='string'){
        namenow=name;
    }else{
      namenow =this.data.detail.name;
    }
    console.log(namenow);
    this.setData({
     searchlist:[]
    })
    company.GetCompanyInfo(namenow).then(res=>{
      debugger;
      if(res.data.msg==true&&res.data.qcresult!=null){
        var qcresult =res.data.qcresult;
        var detail =this.data.detail;
        detail.code = qcresult.creditCode
        detail.name =qcresult.name;
        this.setData({
         detail
        })
        Notify({
         message: '该企业状态:'+qcresult.status,
         duration: 2000,
        });
      }else if(res.data.msg==false){
        this.GetCompanyOtherInfo(res.data.id);
      }else if(res.data.msg=="error"){
        Notify({
          message: '企业名称数据传入有错误,企查查接口调用失败',
          duration: 2000,
         });
      }
       
    })
 },


  GetCompanyInfoList(name){
     company.GetCompanyInfoList(name).then(res=>{
       if(res.data.msg==true){
         this.setData({
          searchlist:res.data.list
         })
       }else{
        this.setData({
          searchlist:[]
         })
       }
     })
  },
  confirmname(e){
    var name =e.currentTarget.dataset.name;
    var detail =this.data.detail;
    detail.name =name;
    this.setData({
      detail,
      searchlist:[]
    })
    this.GetCompanyInfo1(name);
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
    if(name=='name'){
      this.GetCompanyInfoList(value);
    }
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
    if(detail.name==''||detail.name==undefined){
      app.globalData.Toast.showToast("企业名称为空");
      return;
    }

    if(detail.code==''||detail.code==undefined){
      app.globalData.Toast.showToast("社会信用代码为空");
      return;
    }

    detail.companyid = this.data.companyid
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
  
  },

  AddCompanyotherAddress(){
    console.log(this.data.ItemList)
    var List = this.data.ItemList;
    if(List[0].receipt==''||List[0].receipt==undefined||List[0].receiptel==''||List[0].receiptel==undefined){
      Notify({
        message: '至少创建一个收件信息',
        duration: 2000,
      });
      return;
    }
    
    wx.showLoading({
      title: '保存中',
    })
    company.AddCompanyotherAddress(this.data.detail,this.data.ItemList).then(res=>{
      if(res.data.msg==true){
         app.globalData.Toast.showToast("操作成功");
         this.GetCompanyOtherInfo(res.data.id);
      }else if(res.data.msg==false){
        Notify({
          message: '该单位已经创建过,请勿重复创建',
          duration: 2000,
        });
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
            otherid:otherid,
            companyid:options.companyid
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