let API = require('../config/api')
const util = require('./util');
const Toast =require("./Toast")
const AddSalesOrderUrl ='ebilling/salesorder/addsalesorder'
const GetSalesOrderInfoUrl ='ebilling/salesorder/getsalesorderinfo'
const SalesOrderListUrl ='ebilling/salesorder/salesorderlist'
const ChangeOrderStatusUrl ='ebilling/salesorder/changeorderstatus'
const RemoveSalesOrderItemUrl ='ebilling/salesorder/removesalesorderitem'
const RemoveSalesOrderUrl ='ebilling/salesorder/removesalesorder'
const ShipmoneyUrl =  'ebilling/salesorder/shipmoney' 
const CompareShipmoneyUrl =  'ebilling/salesorder/compareshipmoney' 
const KaiPiaoJudgeUrl = 'ebilling/salesorder/kaipiaojudge'
const SalesOrderStaticsUrl = 'ebilling/salesorder/salesorderstatics'
const changeorderconfirmstatusUrl ='ebilling/salesorder/changeorderconfirmstatus'
const changeorderconfirmstatusQuaqiUrl ='ebilling/salesorder/changeorderconfirmstatusGuaqi'
const changeorderconfirmstatusYKXJUrl ='ebilling/salesorder/changeorderconfirmstatusYKXJ'
const CancelApplyUrl = 'ebilling/salesorder/cancelapply'
const InvoiceOperationStatisticUrl = 'ebilling/salesorder/invoiceOperationStatistic'
const InvoiceOperationListUrl  = 'ebilling/salesorder/invoiceoperationList';
const taxRateUrl = 'ebilling/salesorder/taxRate';
const LoadHistoryTaxNameUrl ='ebilling/salesorder/loadhistorytaxname'
const minimessageUrl ='ebilling/salesorder/minimessage'
const sfinfoUrl ='ebilling/salesorder/sfinfo'
const querywaittipUrl  ='ebilling/salesorder/querywaittip'
const updateSalesOrderExpressSubStatusUrl  ='ebilling/salesorder/updateSalesOrderExpressSubStatus'
function SfInfo(oid){
  var params={
    url: sfinfoUrl,
    data:{
     oid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function CancelApply(oid,taxno){
  var params={
    url: CancelApplyUrl,
    data:{
     oid,taxno
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "POST").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}


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

function SalesOrderList(status,expressstatus,pageno,pagesize,json){
  var params={
    url: SalesOrderListUrl,
    data:{
      status,
      pageno,
      pagesize,
      expressstatus,
      json
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

function ChangeOrderConfirmStatus(orderid){
  var params={
    url: changeorderconfirmstatusUrl,
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

function ChangeOrderConfirmStatusGuaqi(orderid){
  var params={
    url: changeorderconfirmstatusQuaqiUrl,
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

function ChangeOrderConfirmStatusYKXJ(orderid){
  var params={
    url: changeorderconfirmstatusYKXJUrl,
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


function Shipmoney(name){
  var params={
    url: ShipmoneyUrl,
    data:{
     name
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function CompareShipmoney(cid,fee){
  var params={
    url: CompareShipmoneyUrl,
    data:{
    cid,fee
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function KaiPiaoJudge(cid){
  var params={
    url: KaiPiaoJudgeUrl,
    data:{
    cid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function SalesOrderStatics(cid,json){
  var params={
    url: SalesOrderStaticsUrl,
    data:{
    cid,json
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function InvoiceOperationStatistic(cid,json){
  var params={
    url: InvoiceOperationStatisticUrl,
    data:{
    cid,json
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function InvoiceOperationList(cid,type){
  var params={
    url: InvoiceOperationListUrl,
    data:{
    cid,type
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function LoadTaxRates(cid){
  var params={
    url: taxRateUrl,
    data:{
      cid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}


function LoadHistoryTaxName(str){
  var params={
    url: LoadHistoryTaxNameUrl,
    data:{
      str
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function minimessage(type){
  var params={
    url: minimessageUrl,
    data:{
      type
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}
function querywaittip(oid){
  var params={
    url:querywaittipUrl,
    data:{
    oid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function updateSalesOrderExpressSubStatus(id){
  var params={
    url:updateSalesOrderExpressSubStatusUrl,
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
  RemoveSalesOrder,
  Shipmoney,
  CompareShipmoney,
  KaiPiaoJudge,
  SalesOrderStatics,
  ChangeOrderConfirmStatus,
  CancelApply,
  InvoiceOperationList,
  InvoiceOperationStatistic,
  LoadTaxRates,
  LoadHistoryTaxName,
  minimessage,
  SfInfo,
  querywaittip,
  updateSalesOrderExpressSubStatus,
  ChangeOrderConfirmStatusGuaqi,
  ChangeOrderConfirmStatusYKXJ,
}
