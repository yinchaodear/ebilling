const app = getApp()
const company =require("../../../utils/company")
import Notify from '../../../dist/notify/notify';
import Dialog from '../../../dist/dialog/dialog';
const api =require("../../../config/api")
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
    ItemList:[{}],
    imagelist:[]
  },

  choseimage(){
    var _this =this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        const tempFilePaths = res.tempFilePaths
        _this.setData({
          tempFilePaths
        })
        wx.showLoading({
          title: '图片解析中',
        })
        wx.uploadFile({
          url: api.BaseUrl+"ebilling/companyaccount/sysfile", //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
          },
          success (res){
            const data = res.data
            console.log(res);
            if(res.statusCode==200){
              var jsonstr =res.data;
              jsonstr =JSON.parse(jsonstr);
              console.log(jsonstr);
              if(jsonstr.data.msg==true){
                wx.hideLoading({
                  complete: (res) => {
                    _this.setData({
                      companystr:jsonstr.data.companyinfostr
                    })
                      _this.companyinfostatic(jsonstr.data.companyinfostr);
                  },
                })
                
              }
            }
          }
        })
      }
    })
  },

  


  afterdelete(e){
    console.log(e);
    var _this =this;
    let index=e.detail.index;
    var file =e.detail.file;
    Dialog.confirm({
      title: '确认删除',
      message: '删除后无法恢复数据',
      confirmButtonText:"确定",
      cancelButtonText:"取消"
    })
    .then(() => {
      // on confirm
      wx.showLoading({
        title: '删除中',
      })
      company.Delete(this.data.detail.id,'CompanyOther',file.name).then(res=>{
        if(res.code==0){
          wx.hideLoading({
            complete: (res) => {
              _this.GetCompanyOtherInfo(_this.data.detail.id);
            },
          })
         
        }
     })
    })
    .catch(() => {

    });
 
  },

  afterRead(event) {
    var _this= this;
    const { file } = event.detail;
    this.upload(file);
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  
  },

  uploadtempFilePaths(id){
    wx.showLoading({
      title: '上传中',
    })
    var _this =this;
    var tempFilePaths =this.data.tempFilePaths
      wx.uploadFile({
        url: api.UPLOADURL, // 仅为示例，非真实的接口地址
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          objectId: id,
          objectType:"CompanyOther"
        },
        success(res) {
          // 上传完成需要更新 fileLis  
            wx.hideLoading({
              complete: (res) => {
                _this.GetCompanyOtherInfo( _this.data.detail.id)
              },
            })
           
        },
      });
  },


  upload:function(file){
    wx.showLoading({
      title: '上传中',
    })
    var _this =this;
      wx.uploadFile({
        url: api.UPLOADURL, // 仅为示例，非真实的接口地址
        filePath: file.url,
        name: 'file',
        formData: {
          objectId: _this.data.detail.id,
          objectType:"CompanyOther"
        },
        success(res) {
          // 上传完成需要更新 fileLis  
            wx.hideLoading({
              complete: (res) => {
                _this.GetCompanyOtherInfo( _this.data.detail.id)
              },
            })
           
        },
      });
   

  },



  bindinputtextarea(e){
      console.log(e);
      this.setData({
        companystr:e.detail.value
      })
  },

  companyinfostatic(){
      console.log("数据解析")
      wx.showLoading({
        title: '数据解析中',
      })
      company.Parse(this.data.companystr).then(res=>{
        if(res.data.msg==true){
          setTimeout(() => {
            wx.hideLoading({
              complete: (res) => {},
            })
          }, 1500);
       
          var detail ={}
          var companyinfo =res.data.companyinfo 
          detail.address =  companyinfo.address
          detail.name =companyinfo.companyName
          detail.code =companyinfo.taxno;
          detail.phone =companyinfo.phone;
          detail.bank =companyinfo.bank;
          detail.account =companyinfo.bankAccount;
          detail.json =this.data.companystr
          detail.isnew ="是"
          this.setData({
             detail
          })
          if(companyinfo.companyName!=null){
            this.GetCompanyInfo(companyinfo.companyName);
          }
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
    debugger;
     var namenow=''
     if(typeof name =='string'){
         namenow=name;
     }else{
       namenow =this.data.detail.name;
     }
     if(namenow==''||namenow==undefined){
      Notify({
        message: '企业名称为空,无法查询',
        duration: 2000,
       });
       return
     }
     console.log(namenow);
     this.setData({
      searchlist:[]
     })
     company.GetCompanyInfo(namenow).then(res=>{
         let detail = this.data.detail;
      if(res.data.msg==true&&res.data.qcresult!=null){
        this.setData({
          searchlist:res.data.qcresult
        })
        
        // Notify({
        //  message: '该企业状态:'+qcresult.status,
        //  duration: 2000,
        // });
      }else if(res.data.msg==false){
          //这里可以保持解析到的字段，只处理name和code，不然白解析了
         detail.name =res.data.companyinfo.name;
         detail.code =res.data.companyinfo.code;
         this.setData({
           detail
         })
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
      if(res.data.msg==true&&res.data.qcresult!=null){
        this.setData({
          searchlist:res.data.qcresult
        })
        
        // Notify({
        //  message: '该企业状态:'+qcresult.status,
        //  duration: 2000,
        // });
      }else if(res.data.msg==false){
         var detail ={};
         detail.name =res.data.companyinfo.name;
         detail.code =res.data.companyinfo.code;
         this.setData({
           detail
         })

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
    if(detail.id ==''||detail.id==undefined){
      detail.isnew=='是'
    }
    detail.json =this.data.companystr;
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
    wx.showLoading({
      title: '保存中',
    })
    company.AddCompanyotherAddress(this.data.detail,this.data.ItemList).then(res=>{
      if(res.data.msg==true){
         app.globalData.Toast.showToast("操作成功");
         this.GetCompanyOtherInfo(res.data.id);
         var tempFilePaths =this.data.tempFilePaths;
     
         if(tempFilePaths!=''&&tempFilePaths!=undefined){
          Notify({
            message: '正在上传解析的图片，即将返回上一页',
            duration: 2000,
          });
           this.uploadtempFilePaths(res.data.id)
         }
         setTimeout(() => {
           wx.navigateBack();
         }, 2000);
      }else if(res.data.msg==false){
        Notify({
          message: '该单位已经创建过,请勿重复创建',
          duration: 2000,
        });
      }
})
  },
  
  GetCompanyOtherInfo(otherid,flag){
    company.GetCompanyOtherInfo(otherid).then(res=>{
      if(res.data.msg==true){
        debugger;
        var detail =res.data.otherinfo[0]
        var ItemList =res.data.addressinfo;
        var  imagelist =res.data.imagelist;
        if(flag==false){
            detail.id ='';
            detail.phone='';
            detail.addressinfo='';
            detail.bank=''
            detail.account=''
            detail.address=''
            ItemList = [{}]
        }else{
          for(var i in imagelist){
            imagelist[i].url =api.PicUrl("CompanyOther",detail.id,imagelist[i].name)
          }
        }

      
        // detail.id ='';
        // for(var i in res.data.addressinfo){
        //   ItemList[i].id=''
        // }
        this.setData({
          otherid:otherid,
          detail,
          ItemList,
          imagelist
        })
        console.log(this.data);
      }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        wx.removeStorageSync("company1");
        console.log(options)
        var  otherid  =options.otherid;
        if(otherid){
          this.setData({
            otherid:otherid,
            companyid:options.companyid
          })
          this.GetCompanyOtherInfo(otherid)
        }else{
          var detail = this.data.detail;
          detail.companyid = options.companyid
          this.setData({
            companyid:options.companyid,
            detail:detail
          })
        }
  },
    
    del(){
        var id = this.data.otherid;
        var companySelf = wx.getStorageSync("company");
        if(!companySelf){
            Notify({
                message: '请先选择开票企业，再删除关联的客户',
                duration: 1000,
            });
            return;
        }
        var companyid = companySelf.id;
        wx.showModal({
          title: '提示',
          content: '删除后该数据将无法恢复，是否继续?',
          success(res){
            if(res.confirm){
              wx.showLoading({
                title: '删除中',
                task:true
              })
              company.DeleteOtherCompany(id, companyid).then(res=>{
                if(res.data.msg==true){
                  wx.hideLoading({
                    complete: (res) => {
                      app.globalData.Toast.showToast("删除成功")
                      wx.navigateBack();
                    },
                  })
                }else{
                    
                }
              })
            }
          }
        })
    },

  
})
