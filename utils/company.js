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

function QueryOtherCompany(cid) {
  //Map.phone map.pwd
  var params={
    url:QueryMyCompanyOtherUrl,
    data:{
      cid:cid
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "POST").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function DeleteOtherCompany(otherid) {
  //Map.phone map.pwd
  var params={
    url:DeleteMyCompanyOtherUrl,
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




module.exports = {
  QueryMyCompany,
  QueryOtherCompany,
  DeleteOtherCompany,
  AddCompanyotherAddress,
  GetCompanyOtherInfo,
  DeleteCompanyOtherAddress,
  QccCompany
}