let API = require('../config/api')
const util = require('./util');
const Toast =require("./Toast")
const QueryMyCompanyUrl = 'ebilling/companyaccount/companyList'
const QueryMyCompanyOtherUrl = 'ebilling/companyaccount/companyotherList'
const DeleteMyCompanyOtherUrl = 'ebilling/companyaccount/deletemycompanyother'
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




module.exports = {
  QueryMyCompany,
  QueryOtherCompany,
  DeleteOtherCompany
}