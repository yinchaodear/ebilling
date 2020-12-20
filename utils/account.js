let API = require('../config/api')
const util = require('./util');
const Toast =require("./Toast")
const router= require("./router")

const AccountInfoUrl = 'ebilling/account/accountinfo'
const StaticsUrl  ='ebilling/account/statics'
function AccountInfo(){
  var params={
    url:AccountInfoUrl,
    data:{
    }
  }
  return new Promise(function (resolve, reject) {
    util.request(params, "Get").then(res => {
      console.log(res);
      resolve(res);
   
    })
  })
}

function Statics(name,id,json){
  var params={
    url:StaticsUrl,
    data:{
      name,id,json
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
  AccountInfo,
  Statics
}