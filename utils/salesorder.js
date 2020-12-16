let API = require('../config/api')
const util = require('./util');
const Toast =require("./Toast")
const AddSalesOrderUrl ='ebilling/salesorder/addsalesorder'
const GetSalesOrderInfoUrl ='ebilling/salesorder/getsalesorderinfo'
const SalesOrderListUrl ='ebilling/salesorder/salesorderlist'
const ChangeOrderStatusUrl ='ebilling/salesorder/changeorderstatus'
const RemoveSalesOrderItemUrl ='ebilling/salesorder/removesalesorderitem'
const RemoveSalesOrderUrl ='ebilling/salesorder/removesalesorder'

function AddSalesOrder(salesorder,salesorderitem) {
  //Map.phone map.pwd
  var params={
    url: AddSalesOrderUrl,
    data:{
      salesorder,
      salesorderitem
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "POST").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}


function GetSalesOrderInfo(orderid) {
  //Map.phone map.pwd
  var params={
    url: GetSalesOrderInfoUrl,
    data:{
      orderid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function SalesOrderList(status,expressstatus,pageno,pagesize,){
  var params={
    url: SalesOrderListUrl,
    data:{
      status,
      pageno,
      pagesize,
      expressstatus
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function ChangeOrderStatus(orderid){
  var params={
    url: ChangeOrderStatusUrl,
    data:{
      orderid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function RemoveSalesOrderItem(id){
  var params={
    url: RemoveSalesOrderItemUrl,
    data:{
     id
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function RemoveSalesOrder(id){
  var params={
    url: RemoveSalesOrderUrl,
    data:{
     id
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}


module.exports = {
  AddSalesOrder,
  GetSalesOrderInfo,
  SalesOrderList,
  ChangeOrderStatus,
  RemoveSalesOrderItem,
  RemoveSalesOrder
}