let API = require('../config/api')
const util = require('./util');
const Toast =require("./Toast")
const QueryMyCompanyUrl = 'ebilling/companyaccount/companyList'
const QueryMyCompanyOtherUrl = 'ebilling/companyaccount/companyotherList'
const DeleteMyCompanyOtherUrl = 'ebilling/companyaccount/deletemycompanyother'
const AddCompanyotherAddressUrl = 'ebilling/companyaccount/addcompanyotheraddress'
const GetCompanyOtherInfoUrl = 'ebilling/companyaccount/getcompanyotherinfo'
const DeleteCompanyOtherAddressUrl = 'ebilling/companyaccount/deletecompanyotheraddress'
const QccCompanyUrl = 'ebilling/companyaccount/qcccompany'
const AddressListUrl = 'ebilling/companyaccount/addresslist'
const GetCompanyInfoUrl ='ebilling/companyaccount/getcompanyinfo'
const GetCompanyInfoListUrl ='ebilling/companyaccount/getcompanyinfolist'
const GetCompanyAccountInfoListUrl ='ebilling/companyaccount/getcompanyaccountinfolist'
const ChargeUrl = 'ebilling/companyaccount/charge'
const WxPayUrl = 'ebilling/companyaccount/wxpay'
const ParseUrl = 'ebilling/companyaccount/parse'
const DeleteUrl = 'attachment/deleteFile'
function QueryMyCompany() {
  //Map.phone map.pwd
  var params={
    url:QueryMyCompanyUrl,
    data:{}
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "POST").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function QueryOtherCompany(cid,pageno,pagesize,value) {
  //Map.phone map.pwd
  var params={
    url:QueryMyCompanyOtherUrl,
    data:{
      cid:cid,
      pageno,
      pagesize,
      value
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "POST").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function DeleteOtherCompany(otherid,cid) {
  //Map.phone map.pwd
  var params={
    url:DeleteMyCompanyOtherUrl,
    data:{
      otherid:otherid,
      cid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function AddCompanyotherAddress(detail,itemlist) {
  //Map.phone map.pwd
  var params={
    url:AddCompanyotherAddressUrl,
    data:{
      detail:detail,
      itemlist:itemlist
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "POST").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function GetCompanyOtherInfo(otherid){
  var params={
    url:GetCompanyOtherInfoUrl,
    data:{
      otherid:otherid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function DeleteCompanyOtherAddress(addressid){
  var params={
    url:DeleteCompanyOtherAddressUrl,
    data:{
      addressid:addressid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function QccCompany(name,code){
  var params={
    url:QccCompanyUrl,
    data:{
      name:name,
      code:code,
      type:1
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}




function AddressList(oid,flag){
  var params={
    url:AddressListUrl,
    data:{
      oid,
      flag
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}


function GetCompanyInfo(companyname){
  var params={
    url:GetCompanyInfoUrl,
    data:{
      companyname
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function GetCompanyInfoList(companyname){
  var params={
    url:GetCompanyInfoListUrl,
    data:{
      companyname
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function GetCompanyAccountInfoList(otherid){
  var params={
    url:GetCompanyAccountInfoListUrl,
    data:{
      otherid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}


function Charge(cid,Money){
  var params={
    url: ChargeUrl,
    data:{
    cid,Money
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "GET").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function WxPay(cid,fee){
  var params={
    url: WxPayUrl,
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

 function  Parse(str){
  var params={
    url: ParseUrl,
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



function Delete( objectId, objectType,fileName){
  var params={
    url: DeleteUrl,
    data:{
      objectId,
      objectType,
      fileName
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
  QueryMyCompany,
  QueryOtherCompany,
  DeleteOtherCompany,
  AddCompanyotherAddress,
  GetCompanyOtherInfo,
  DeleteCompanyOtherAddress,
  QccCompany,
  AddressList,
  GetCompanyInfo,
  GetCompanyInfoList,
  GetCompanyAccountInfoList,
  Charge,
  WxPay,
  Parse,
  Delete
}