let API = require('../config/api')
const util = require('../utils/util');
const Toast =require("../utils/Toast")
const router= require("../utils/router")
const SystemMessageUrl = 'ebilling/message/data'
const SystemMessageMarkUrl = 'ebilling/message/batchMark'

function SystemMessage(pageno,pagesize){
  var params={
    url:SystemMessageUrl,
    data:{
      page:pageno,
      limit:pagesize
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

function batchMark(ids){
  var params={
    url:SystemMessageMarkUrl+"/"+ids,
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
    })
  })
}

module.exports = {
  SystemMessage,
  batchMark,
}
