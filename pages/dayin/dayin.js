import * as API from "../../config/api";

const app = getApp()
const router = require('../../utils/router')
const Toast = require('../../utils/Toast')
const salesorder = require('../../utils/salesorder')
const company = require("../../utils/company")
import Notify from '../../dist/notify/notify';
import Dialog from '../../dist/dialog/dialog';
import dialog from "../../dist/dialog/dialog";
import {BaseUrl} from "../../config/api";
const originList = ["001", "002", "003", "004", "005", "006", "007", "008"]
let _this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redirect: '',
    showShare: false,
    title: '',
    apply: {},
    activeNames: 1,
    activeNames1: ['1'],
    activeNames2: ['1'],
    ItemList: [{
      taxno: 1
    }],
    forbidden: false,
    message: "",
    message1: '',
    FapiaoList: ['1', '2', '3', '4', '5', '6', '7', '8'],
    taxRates: [],
    multiArray: [],
    show: false,
    searchlist: [],
    currentindex: 0,
    tempidlist:[],
    imgFileList:[],
    fileList:[]
  },


  clearsearchlist() {
    this.setData({
      searchlist: []
    })
  },

  LoadHistoryTaxName(str) {
    salesorder.LoadHistoryTaxName(str).then(res => {
      if (res.data.msg == true) {
        this.setData({
          searchlist: res.data.list
        })
      }
    })
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var column = e.detail.column;
    var value = e.detail.value;
    var multiArray = this.data.multiArray;
    var first = this.data.first
    var second = this.data.second;
    var third = this.data.third;
    var secondtemp = this.data.secondtemp == undefined ? [] : this.data.secondtemp
    var thirdtemp = []

    switch (column) {
      case 0:
        console.log("改变第一行");
        secondtemp = [];
        thirdtemp = [];
        for (var i in second) {
          if (second[i].parent == first[value]) {
            secondtemp.push(second[i].name);
          }
        }
        multiArray[1] = secondtemp
        this.setData({
          multiArray,
          secondtemp
        })
        break;

      case 1:
        console.log("改变第二行");
      case 2:
        console.log("改变第三行");
        break;
    }
   console.log(multiArray)

  },


  bindtaxChange: function (e) {
    console.log(e);
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var index = e.currentTarget.dataset.index;
    var value = e.detail.value;
    var ItemList = this.data.ItemList;
    let quantity = 0;
    for (var i in ItemList) {
      if (this.data.FapiaoList[value] == ItemList[i].taxno) {
        quantity++;
      }
    }
    if (quantity > 7) {
      Notify({
        message: "票号为" + this.data.FapiaoList[value] + "的开票项已超过8条",
        duration: 2000,
      });
      return;
    }
    ItemList[index]['taxno'] = this.data.FapiaoList[value];
    this.setData({
      ItemList: ItemList
    })

  },
  bindinputItemListIndex(e) {
    this.setData({
      ItemListIndexValue: e.detail.value
    })
  },

  onConfirm(e) {
    console.log("确认")
    var ItemList = this.data.ItemList;
    ItemList[this.data.ItemListIndex]['tax'] = parseFloat(this.data.ItemListIndexValue).toFixed(2);
    this.setData({
      ItemList
    })
  },
  onClose() {
    console.log("关闭")
  },

  confirmname1(e) {
    debugger;
    var value = e.currentTarget.dataset.value;
    var ItemList = this.data.ItemList;
    var currentindex = this.data.currentindex;
    ItemList[currentindex].name = value;
    console.log(ItemList)
    this.setData({
      ItemList,
      searchlist: []
    })
  },

  bindtaxRateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var index = e.currentTarget.dataset.index;
    var multiArray = this.data.multiArray;
    var number = e.detail.value[1] == null ? 0 : e.detail.value[1];
    var tax = this.data.multiArray[1][number]
    if (tax == '自定义') {
      console.log("自己输入");
      this.setData({
        show: true,
        ItemListIndex: index
      })
      return;
    } else {
      const rateIndex = e.detail.value;

      var ItemList = this.data.ItemList;
      ItemList[index]['tax'] = parseFloat(tax).toFixed(2);
      this.setData({
        ItemList: ItemList
      })
    }

  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    const value = e.detail.value.join("");
    var nowarea = this.data.apply.area;
    var apply = this.data.apply;
    apply.area = value;
    this.setData({
      apply
    })
    if (value != nowarea) {
      this.Shipmoney()
    }
  },
  additem() {
    var obj = {};
    obj.taxno = "1";
    var ItemList = this.data.ItemList;
    if (ItemList.length > 0) {
      obj.taxno = ItemList[ItemList.length - 1].taxno;
    }
    // if (ItemList.length == 8) {
    //   Toast.showToast("最多添加8项");
    //   return;
    // }
    ItemList.push(obj)
    this.setData({
      ItemList: ItemList
    })
    console.log(this.data.currentindex);
  },

  confirmitemList(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      currentindex: index
    })
    var name = e.currentTarget.dataset.name;
    var value = e.detail.value;
    if (name == 'name') {
      this.LoadHistoryTaxName(value);
    }
    var ItemList = this.data.ItemList;
    ItemList[index][name] = value;
    
    if(name=="number"){
      if (ItemList[index].money && ItemList[index].money != '' && (!ItemList[index].unitprice||ItemList[index].unitprice=='')) {
        let unitprice = ItemList[index].money / ItemList[index].number
        if(!isNaN(unitprice)){
          ItemList[index].unitprice = parseFloat(unitprice).toFixed(4);
        }
      }
      else if (ItemList[index].unitprice && ItemList[index].unitprice != '') {
        let money = ItemList[index].number * ItemList[index].unitprice
        if(!isNaN(money)){
          ItemList[index].money = parseFloat(money).toFixed(2);
        }
      }
    }else if(name=="unitprice"){
      if (ItemList[index].money && ItemList[index].money != '' && (!ItemList[index].number||ItemList[index].number=='')) {
        let number = ItemList[index].money / ItemList[index].unitprice
        if(!isNaN(number)){
          ItemList[index].number = parseFloat(number).toFixed(4);
        }
      }
      else if (ItemList[index].number && ItemList[index].number != '') {
        let money = ItemList[index].number * ItemList[index].unitprice
        if(!isNaN(money)){
          ItemList[index].money = parseFloat(money).toFixed(2);
        }
      }
    }else if(name=="money"){
      if (ItemList[index].number && ItemList[index].number != '' && (!ItemList[index].unitprice||ItemList[index].unitprice =='') ) {
        let unitprice = ItemList[index].money / ItemList[index].number
        if(!isNaN(unitprice)){
          ItemList[index].unitprice = parseFloat(unitprice).toFixed(4);
        }
      }else if (ItemList[index].unitprice && ItemList[index].unitprice != '' && (!ItemList[index].number || ItemList[index].number == '')) {
        let number = ItemList[index].money / ItemList[index].unitprice
        if(!isNaN(number)){
          ItemList[index].number = parseFloat(number).toFixed(4);
        }
      }else{
        ItemList[index].unitprice = ItemList[index].number = "";
      }
    }
    
    this.setData({
      ItemList: ItemList
    })
    console.log(ItemList)
  },

  del() {
    Dialog.confirm({
        title: '删除确认',
        message: '删除后将无法恢复数据',
      })
      .then(() => {
        // on confirm
        salesorder.RemoveSalesOrder(this.data.apply.id).then(res => {
          if (res.data.msg == true) {
            wx.navigateBack({
              complete: (res) => {},
            })
          }
        })
      })
      .catch(() => {
        // on cancel

      });


  },

  deleteitem(e) {
    var index = e.currentTarget.dataset.index;
    var ItemList = this.data.ItemList;
    var item = ItemList[index];
    console.log(item);
    if (item.id) {
      console.log("数据删除");
      this.RemoveSalesOrderItem(item.id);
    } else {
      ItemList.splice(index, 1);
      this.setData({
        ItemList: ItemList
      })
    }
  },
  RemoveSalesOrderItem(id) {
    salesorder.RemoveSalesOrderItem(id).then(res => {
      if (res.data.msg == true) {
        this.GetSalesOrderInfo(this.data.apply.id);
      }
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
  onItemChange2(event) {
    this.setData({
      activeNames2: event.detail,
    });
  },


  applycomplete(e) {
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var value = e.detail.value;
    var apply = this.data.apply;
    apply[type] = value;
    this.setData({
      apply: apply
    })
    console.log(apply)
  },


  onClick(e) {
    var title = e.currentTarget.dataset.title;
    var options = []
    if (title == '取件方式') {
      options = [{
          name: '自取',
          icon: '../../img/ziqu.png',
        },
        {
          name: '邮寄',
          icon: '../../img/youji.png',
        },
      ]

    } else if (title == '票据种类') {
      options = [{
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
    } else if (title == '付款方式') {
      options = [{
          name: '寄付',
          icon: '../../img/jifu.png',
        },
        {
          name: '到付',
          icon: '../../img/daofu.png',
        },
      ]
    }
    this.setData({
      showShare: true,
      title: title,
      options: options
    });
  },
  onClose() {
    this.setData({
      showShare: false
    });
  },
  onSelect(event) {
    console.log(event.detail.name);
    var apply = this.data.apply;
    if (this.data.title == '票据种类') {

      apply.type = event.detail.name
      this.setData({
        apply: apply
      })
      this.InvoiceOperationList();
    } else if (this.data.title == '取件方式') {
      if (event.detail.name == '邮寄' && this.data.apply.company1) {
        //查找对方单位的默认地址
        this.AddressDetail();
      }
      apply.expressway = event.detail.name
      this.setData({
        apply: apply
      })
    } else if (this.data.title == '付款方式') {

      apply.paytype = event.detail.name
      if (event.detail.name == '寄付') {
        this.Shipmoney()
      }
      this.setData({
        apply: apply
      })
    }

    this.onClose();
  },

  Shipmoney() {
    if (this.data.apply.expressway == '邮寄' && this.data.apply.paytype == '寄付') {
      var reg = /.+?(省|市|自治区|自治州|县|区)/g;
      var city = this.data.apply.area.match(reg)
      console.log(city);
      salesorder.Shipmoney(city[0]).then(res => {
        if (res.data.msg == true) {
          var apply = this.data.apply;
          apply.expressmoney = res.data.postfee;
          this.setData({
            apply: apply
          })
        }
      })
    }
  },
  AddressDetail() {
    company.AddressList(this.data.apply.company1.id, true).then(res => {
      var apply = this.data.apply;
      if (res.data.msg == true && res.data.addressList.length != 0) {
        var obj = res.data.addressList[0]
        apply.receipt = obj.f_receipt;
        apply.receiptel = obj.f_receiptel;
        apply.area = obj.f_receiptarea;
        apply.addressdetail = obj.f_receiptaddress;
        apply.shipcode = obj.f_receiptecode;
      } else {
        var apply = this.data.apply;
        apply.receipt = ""
        apply.receiptel = ""
        apply.area = ""
        apply.addressdetail = ""
        apply.shipcode = ""
      }
      this.setData({
        apply: apply
      })
    })
  },


  navTo(e) {
    var path = e.currentTarget.dataset.path;
    router.navigateTo(path);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderid) {
      if (options.again == 'true') {
        this.GetSalesOrderInfo(options.orderid, true);
      } else {
        this.GetSalesOrderInfo(options.orderid, false);
      }
    }
    this.minimessage()
  },

  minimessage(){
    salesorder.minimessage("发票").then(res=>{
      console.log("程序模板")
      console.log(res)
      if(res.data.msg==true){
        if(res.data.list.length>0){
          this.setData({
            tempidlist:res.data.list
          })
        }else{
          this.setData({
            tempidlist:['mcQ6UDHFlQ-q9AaydO4icIQjeTQ8mwsZRWzDA8u3jkE']
          })
        }
      }
    })
  },

  onReady: function () {

  },

  GetSalesOrderInfo(id, flag) {
    salesorder.GetSalesOrderInfo(id).then(res => {
      if (res.data.msg == true) {
        var apply = res.data.orderdetail;
        var ItemList = res.data.orderitem;
        console.info(ItemList);
        for (var i in ItemList) {
            ItemList[i].tax = parseFloat(ItemList[i].tax).toFixed(2);
        }
        if (flag == true) {
          apply.id = '';
          apply.attachment = "";
          for (var i in ItemList) {
            ItemList[i].id = ''
          }
        }else {
          if(apply.attachment){
            var attachmentsUped = apply.attachment.split(",");
            this.setData({attachmentsUped})
          }
        }
        this.setData({
          apply,
          ItemList
        })
        debugger
        this.InvoiceOperationList()
      }
    })
  },

  onUnload() {
    console.log("我被销毁了");
    wx.removeStorageSync('company1');
    wx.removeStorageSync('address');
  },

  KaiPiaoJudge() {
    var cid = this.data.apply.company.id;
    salesorder.KaiPiaoJudge(cid).then(res => {
      if (res.data.msg == true) {

      } else {
        Notify({
          message: res.data.result,
          duration: 2000,
        });
        this.setData({
          forbidden: true,
          message: res.data.result
        })
      }
    })
  },


  onShow() {
    var company = wx.getStorageSync("company");
    var company1 = wx.getStorageSync("company1");
    var address = wx.getStorageSync('address');
    if (company) {
      var apply = this.data.apply;
      apply.company = company
      this.setData({
        apply: apply
      })
      this.KaiPiaoJudge();
      this.loadTaxRates(company.id);
    }else{
      //重新登录后，请到首页重新选择开票企业
      Dialog.alert({
        title: '提示',
        message: "重新登录后，请先到首页重新选择开票企业",
      }).then(() => {
        // on close
        router.switchTab("/pages/index/index"); 
      });
      return false;
    }
    if (company1) {
      var apply = this.data.apply;
      apply.company1 = company1;
      apply.phone = company1.phone;
      apply.address = company1.address;
      apply.bank = company1.bank;
      apply.bankaccount = company1.bankaccount;
      this.setData({
        apply: apply
      })
      wx.removeStorageSync('company1');
      
      //有可能是重新选了一个单位，不多做判断了，直接去掉邮寄信息
      apply.receipt = "";
      apply.receiptel = "";
      apply.area = "";
      apply.addressdetail = "";
      apply.shipcode = "";
      apply.expressmoney = "";
      apply.expressway = "";
      apply.paytype = "";
      this.setData({
        apply: apply
      })
    }
    
    if(address){
      if (this.data.apply.expressway == '邮寄' && address == '') {
        this.AddressDetail();
      } else {
        console.log("加载刚才存进来的");
        var apply = this.data.apply;
        var nowarea = apply.area;
        apply.receipt = address.f_receipt
        apply.receiptel = address.f_receiptel
        apply.area = address.f_receiptarea
        apply.addressdetail = address.f_receiptaddress
        apply.shipcode = address.f_receiptecode;
        this.setData({
          apply: apply
        })
        if (address.f_receiptarea != nowarea) {
          this.Shipmoney();
        }
      }
      wx.removeStorageSync('address');
    }

  },



  submit(e) {
    console.log(e);
    //先判断是否能开票 //先注释掉，然后后面再判断
    if (this.data.forbidden == true) {
      Dialog.alert({
        title: '联系客服',
        message: this.data.message + ",请联系小乐处理",
      }).then(() => {
        // on close
      });
      return
    }
    if (this.data.message1 != '') {
      Notify({
        message: this.data.message1,
        duration: 2000,
      });
      return
    }
    var _this = this;
    //再进行 页面上字段的校验
    var status = e.currentTarget.dataset.status;
    var apply = this.data.apply;
    apply.status = status;

    let tempidlist = _this.data.tempidlist;
    let ids = [];
    if(tempidlist.length>3){
      ids = tempidlist.slice(0, 3);
      wx.requestSubscribeMessage({
        tmplIds:ids,
        success(res) {
          console.log("订阅")
          _this.checkconfirm(apply)
        },
        fail(res) {
          console.log("不订阅")
          _this.checkconfirm(apply)
        }
      })
    }else{
      ids = tempidlist.slice(0, tempidlist.length);
      wx.requestSubscribeMessage({
        tmplIds:ids,
        success(res) {
          console.log("订阅")
          _this.checkconfirm(apply)
        },
        fail(res) {
          console.log("不订阅")
          _this.checkconfirm(apply)
        }
      })
    }
    
  },

  confirmdata(apply) {
    var _this =this
    if(this.data.maxMoney<this.data.totalmoney){
      
      Dialog.confirm({
        title: '金额超出',
        message: "申请金额超过库存发票可开金额,是否继续申请?",
        confirmButtonText: "继续申请",
        cancelButtonText: "返回修改开票金额"
      })
      .then(() => {
        // on confirm  
        setTimeout(() => {
          _this.confirmdatanext(apply);
        }, 500);

      })
      .catch(() => {
        // on cancel
      });
    }else{
      this.confirmdatanext(apply);
    }

   

  },

  confirmdatanext(apply){
    var _this = this;
    Dialog.confirm({
        title: '开票总数:' + this.data.totalqutity + ",开票总金额:" + parseFloat(this.data.totalmoney).toFixed(2),
        message: this.data.str,
        messageAlign: "left"
      })
      .then(() => {
        // on confirm  
        setTimeout(() => {
          _this.Checkcommit(apply, apply.status);
        }, 500);

      })
      .catch(() => {
        // on cancel
      });
  },


  checknum(item, apply) {
    console.log(item);
    console.log(apply);
    if(!item || item.length==0){
      return "未填写开票项";
    }
    var str = '';
    if (apply.company == undefined || apply.company == '') {
      return "未选择开票单位";
    }
    str += "开票单位:" + apply.company.accountname + "\n"
    if (apply.company1 == undefined || apply.company1 == '') {
      return "对方单位信息有误";
    }
    str += "对方单位:" + apply.company1.accountname + "\n\n"
    if (apply.type == undefined || apply.type == '') {
      return "票据种类未选择";
    } else {
      if (apply.type == '专票'||apply.type=='代开专票') {
        if (apply.phone == '' || apply.phone == undefined || apply.address == '' || apply.address == undefined || apply.bank == '' || apply.bank == undefined ||
          apply.bankaccount == '' || apply.bankaccount == undefined) {
          return "当前票据种类为专票,对方单位信息填写不全"
        }
      }
    }

    str += "票据种类:" + apply.type + "\n\n"


    var orderitem = [];
    var totalmoney = 0;
    var totalqutity = 0;
    for (var i in item) {
      var obj = {}
      var detailList = [];
      let name = item[i].name;
      if (name == '' || name == undefined) {
        return "开票项第" + (parseInt(i) + 1) + "项,项目名为空"
      }
      var taxno = item[i].taxno
      if (taxno == '' || taxno == undefined) {
        return "开票项第" + (parseInt(i) + 1) + "项,发票号未选择"
      }
      obj.taxno = taxno;
      var detail = {}
      detail.name = name;
      detail.money = item[i].money;
      detail.model = item[i].model;
      let unitprice = item[i].unitprice;
      if (unitprice == '' || unitprice == undefined) {
        return "开票项第" + (parseInt(i) + 1) + "项,单价为空"
      } else {
        if (isNaN(unitprice)) {
          return "开票项第" + (parseInt(i) + 1) + "项,单价填的不是数字"
        }
      }
      detail.unitprice = unitprice
      let number = item[i].number
      if (number == '' || number == undefined) {
        return "开票项第" + (parseInt(i) + 1) + "项,数量为空"
      } else {
        if (isNaN(number)) {
          return "开票项第" + (parseInt(i) + 1) + "项,数量填的不是数字"
        }
      }
      detail.number = number;
      totalmoney += item[i].money;

      let tax = item[i].tax;
      if (tax == '' || tax == undefined ) {
        return "开票项第" + (parseInt(i) + 1) + "项,税率为空"
      } else {
        if (isNaN(tax)) {
          return "开票项第" + (parseInt(i) + 1) + "项,税率填的不是数字"
        }
      }
      detail.tax = tax;
      detail.unit = item[i].unit;
      detail.remark = item[i].remark==undefined?"":item[i].remark
      detail.cancel = item[i].cancel;
      detailList.push(detail);
      obj.detailList = detailList
      if (orderitem.length == 0) {
        orderitem.push(obj);
        totalqutity += 1;
      } else {
        var flag = true;
        for (var j in orderitem) {
          if (obj.taxno == orderitem[j].taxno) {
            orderitem[j].detailList.push(detail);
            flag = false;
            break;
          }
        }
        if (flag) {
          orderitem.push(obj);
          totalqutity += 1;
        }
      }
    }
    if (apply.remark != '' && apply.remark != undefined) {
      str += "备注:" + apply.remark + "\n\n"
    }
    if (apply.expressway == '' || apply.expressway == undefined) {
      return "取件方式未填";
    } else {
      str += "取件方式:" + apply.expressway + "\n"
    }
    if (apply.expressway == '邮寄') {
      if (apply.receipt == '' || apply.receipt == undefined) {
        return "取件人未填";
      } else {
        str += "收件人:" + apply.receipt + "\n"
      }
      if (apply.receiptel == '' || apply.receiptel == undefined || apply.receiptel.length!=11) {
        return "取件人电话未填或格式不对";
      } else {
        str += "收件电话:" + apply.receiptel + "\n"
      }
      if (apply.area == '' || apply.area == undefined) {
        return "取件地区未填";
      } else {
        str += "取件地区:" + apply.area + "\n"
      }
      if (apply.addressdetail == '' || apply.addressdetail == undefined) {
        return "取件详细地址未填";
      } else {
        str += "取件地址:" + apply.addressdetail + "\n"
      }
      if (apply.paytype == '' || apply.paytype == undefined) {
        return "付款方式未选择";
      } else {
        str += "付款方式:" + apply.paytype + "\n"
        if (apply.paytype == '寄付') {
          str += "运费:" + apply.expressmoney + "\n"
        }
      }
    }
    str += "\n"
    console.log(orderitem)

    for (var i in orderitem) {
      var obj = orderitem[i];
      str += "票号" + obj.taxno + "\n"
      for (var j in orderitem[i].detailList) {
        var item = orderitem[i].detailList[j]
        str += '  项目名' + item.name
        str += '  数量' + item.number
        str += '  单价' + item.unitprice
        str += '  金额' + item.money
        str += '  备注' + item.remark
        str += '  税率' + item.tax + "%\n"
      }
      str += "\n"
    }
    console.log(str);
    this.setData({
      str: str,
      totalmoney,
      totalqutity
    })
    return "检验正确";
  },

  checkconfirm(apply) {

    var result = this.checknum(this.data.ItemList, apply)
    console.log(result);
    if (result != '检验正确') {
      Notify({
        message: result,
        duration: 2000,
      });
      return;
    }
    var _this = this;
    Dialog.confirm({
        title: '发票确认',
        message: '发票开具后是否需要确认',
        confirmButtonText: "否",
        cancelButtonText: "是"
      })
      .then(() => {
        // on confirm
        console.log("不需要")
        apply.commit = "否"
        setTimeout(() => {
          _this.confirmdata(apply)
        }, 500);


      })
      .catch(() => {
        // on cancel
        console.log("需要")
        apply.commit = "是"
        setTimeout(() => {
          _this.confirmdata(apply)
        }, 500);
      });
  },

  InvoiceOperationList() {
    var id = this.data.apply.company.id;
    var type = this.data.apply.type;

    var FapiaoList = [];
    FapiaoList.push("1");
    FapiaoList.push("2");
    FapiaoList.push("3");
    FapiaoList.push("4");
    FapiaoList.push("5");
    FapiaoList.push("6");
    FapiaoList.push("7");
    FapiaoList.push("8");
    this.setData({
      FapiaoList
    });
    salesorder.InvoiceOperationList(id,type).then(res=>{
          var FapiaoList =[];
          var message1 =''
           if(res.data.msg==true){
              var maxMoney =0;
              for(var i in res.data.list){
                maxMoney+=res.data.list[i].maxMoney;
              }
              Notify({
                message: "当前类型票据总金额为"+maxMoney,
                duration: 1000,
              });
              this.setData({
                maxMoney
              })
           }
       
    })
  },


  Checkcommit(apply, status) {
    this.setData({
      apply: apply
    })
    wx.showLoading({
      title: '提交中',
    })
    if (status == '暂存') {
      console.log("不做事");
      this.addSalesOrder(this.data.apply, this.data.ItemList);
    } else {
      console.log("进行一系列判断");
      this.CheckSalesOrder();
    }
  },

  CheckSalesOrder() {
    var apply = this.data.apply;
    var ItemList = this.data.ItemList;
    if (this.data.apply.expressway == '邮寄' && this.data.apply.paytype == '寄付' && this.data.apply.alreadypay != '是') {
      //先进行运费的判断,如果小于 先把订单保存为暂存状态,然后提示要去充值
      salesorder.CompareShipmoney(this.data.apply.company.id, this.data.apply.expressmoney).then(res => {
        if (res.data.msg == false) {
          Notify({
            message: '当前开票单位余额为' + res.data.leftmoney + ",订单转为暂存状态,请及时充值",
            duration: 2000,
          });
          apply.status = '暂存';
          this.setData({
            redirect: '充值'
          })
          this.addSalesOrder(apply, ItemList, res.data.leftmoney);
        } else {
          //余额充足,先扣除余额,
          this.addSalesOrder(apply, ItemList);
        }
      })
    } else {
      console.log("不用校验运费")
      this.addSalesOrder(apply, ItemList);
    }
    // this.addSalesOrder(this.data.apply,this.data.ItemList);

  },


  addSalesOrder(salesorder1, salesorderitem, leftmoney) {
    var that = this
    let tempFilePaths = this.data.tempFilePaths;
    let imgFileList = this.data.imgFileList;
    let redirect = this.data.redirect;
    salesorder1.attachment = "";
    let kefuid = wx.getStorageSync('kefuid');
    if(kefuid)salesorder1.userid = kefuid;
    this.uploadFilePre(salesorder1, tempFilePaths, imgFileList);
    salesorder.AddSalesOrder(salesorder1, salesorderitem).then(res => {
      if (res.data.msg == true) {
        //是否有附件需要上传
        let fileList = this.data.fileList;
        if (fileList != null && fileList.length>0) {
          let objectId = res.data.id;
          let objectType = "SalesOrder";
          this.upload(objectId, objectType, redirect, salesorder1, leftmoney);
        } else {
          that.finishKaiPiao(redirect, salesorder1, leftmoney);
        }
      } else {
        app.globalData.Toast.showToast("保存失败")
      }


    })
  },



  finishKaiPiao(redirect, salesorder1, leftmoney) {
    wx.removeStorageSync('company1')
    setTimeout(function () {
      if (redirect == '充值') {
        router.redirectTo("/pages/mine/cash/cash?leftmoney=" + leftmoney)
      } else {
        router.switchTab("/pages/banzu/banzu")
      }
    }, 1500)
  },

  loadTaxRates(id) {
    salesorder.LoadTaxRates(id).then(res => {
      var first = [];
      var second = [];
      var secondtemp = [];
      var third = [];
      var thirdtep = [];
      let taxRates = [];
      if (res.success == true) {
        if (res.data.list.length > 0) {
          var list = res.data.list;
          for (var i in list) {
            var item = list[i];
            item.rate = item.rate+"%";
            if (first.length == 0) {
              first.push(item.companyType);
            } else {
              var flag = true
              for (var j in first) {
                if (first[j] == item.companyType) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                first.push(item.companyType);
              }
            }
          }
          for (var m in list) {
            for (var k in first) {
              var obj = {};
              if (list[m].companyType == first[k]) {
                var flag1= true;
                for(var v in second){
                    if(second[v].name==list[m].rate&&second[v].parent==list[m].companyType){
                      flag1=false;
                      break;
                    }
                }
                if(second.length==0||flag1==true){
                  obj.parent = first[k]
                  obj.name = list[m].rate;
                  second.push(obj);
                }
              
              }
            }
          }
          for (var q in second) {
            if (second[q].parent == first[0]) {
              secondtemp.push(second[q].name);
            }
          }
       

          console.log(first);
          console.log(second);
    
          var multiArray = []
          multiArray.push(first);
          multiArray.push(secondtemp);
          this.setData({
            first,
            second,
            multiArray,
            secondtemp: secondtemp
          })
        } else {

        }
      }
      this.setData({
        taxRates
      })
      console.info(this.data.taxRates)
    })
  },

  chooseMessageFile() {
    let that = this;
    var tempFilePaths = this.data.tempFilePaths;
    if(!tempFilePaths)tempFilePaths = [];
    wx.chooseMessageFile({
      count: 10,
      type: 'all',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePathsNew = res.tempFiles
        tempFilePaths = tempFilePaths.concat(tempFilePathsNew);
        console.info(res);
        that.setData({
          tempFilePaths
        })
      }
    })
  },

  uploadFilePre(salesorder1, tempFilePaths, imgFileList) {
    let fileList = [];
    if (tempFilePaths != null) {
      for(var i in tempFilePaths){
        tempFilePaths[i].url = tempFilePaths[i].path;
        fileList.push(tempFilePaths[i]);
      }
    }
    
    if (imgFileList != null) {
      for(var i in imgFileList){
        var len = imgFileList[i].url.length;
        imgFileList[i].name = imgFileList[i].url.substring(len-20, len);
        fileList.push(imgFileList[i]);
      }
    }
    var atts = "";
    for(var i in fileList){
      if(atts=="")atts += fileList[i].name;
      else atts += ","+fileList[i].name;
    }
    salesorder1.attachment = atts;
    
    this.setData({fileList});
  },
    
  delTempFile(e) {
      var file = e.currentTarget.dataset.file;
      var tempFilePaths = this.data.tempFilePaths;
      console.info(file);
      for(var i in tempFilePaths){
        if(tempFilePaths[i].path == file.path){
          tempFilePaths.splice(i, 1);
        }
      }
      this.setData({
        tempFilePaths
      })
  },
  
  afterRead(event) {
    var _this = this;
    const { file } = event.detail;
    let imgFileList = this.data.imgFileList||[];
    imgFileList = imgFileList.concat(file);
    this.setData({imgFileList})
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  },
  
  afterdelete(e){
    console.log(e);
    var index = e.detail.index;
    var imgFileList = this.data.imgFileList;
    imgFileList.splice(index,1);
    this.setData({imgFileList})
  },

  upload : function(objectId, objectType, redirect, salesorder1, leftmoney){
    var that = this;
    var fileList = this.data.fileList;
    if(fileList.length==0){
      //app.globalData.Toast.showToast("照片为空")
      return;
    }
    for(var i in fileList){
      var file = fileList[i];
      console.info(file);
      // wx.uploadFile({
      //   url : api.UPLOADURL, // 仅为示例，非真实的接口地址
      //   filePath: file.url,
      //   name: 'file',
      //   formData: {
      //     objectId: itemid,
      //     objectType:"SalesOrderVoid",
      //     fileName: name
      //   },
      //   success(res) {
      //     // 上传完成需要更新 fileLis  
      //     var imgFileList  =_this.data.imgFileList;
      //     file.upload=true;
      //     _this.setData({
      //       imgFileList
      //     })
      //   },
      // });
      wx.uploadFile({
        url: BaseUrl + 'attachment/uploadFileAll', //此处换上你的接口地址
        filePath: file.url,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'accept': 'application/json',
        },
        formData: {
          objectId: objectId,
          objectType: objectType,
          fileName: file.name
        },
        success: function (res) {
          let data = res;
          console.log(data);
          // 上传完成需要更新 fileLis  
          var imgFileList = that.data.imgFileList;
          file.upload=true;
          that.setData({
            fileList
          })
        },
        fail: function (res) {
          console.log('fail');
        },
      })
    }
    this.checkupload(redirect, salesorder1, leftmoney)
  },

  checkupload(redirect, salesorder1, leftmoney){
      var that = this;
      var fileList = this.data.fileList;
      var flag = true;
      for(var i in fileList){
          var file = fileList[i];
          if(file.upload!=true){
            flag == false;
          }
      }
      if(flag){
        app.globalData.Toast.showToast("上传成功");
        that.finishKaiPiao(redirect, salesorder1, leftmoney);
      }else{
        setTimeout(() => {
          that.checkupload(redirect, salesorder1, leftmoney)
        }, 200);
      }
  },

})
