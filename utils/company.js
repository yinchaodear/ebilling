let API = require('../config/api')
const util = require('./util');
const Toast =require("./Toast")
const QueryMyCompanyUrl = 'ebilling/companyaccount/companyList'

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



module.exports = {
  QueryMyCompany
}