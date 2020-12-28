let API = require('../config/api')
const LOGINAPI ='/rest/customer/login'

/*
用promise封装request方法
*/
function request(params,method = "GET") {
  return new Promise(function (resolve, reject) {
    let url = API.BaseUrl+params.url;
    let data = params.data;
    var cookie =""
    if(wx.getStorageSync('currentuser')!=''){
      cookie+="aid="+wx.getStorageSync('currentuser').f_id
    }
    if(wx.getStorageSync('kefuid')!=''){
      cookie+=";kefuid="+wx.getStorageSync('kefuid')
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-Nideshop-Token': wx.getStorageSync('token'),
        "cookie":cookie
      },
      
      success: function (res) {
        if (res.statusCode == 200) { 
            console.log("success");
            resolve(res.data);    
        } else {
          console.log("error");
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
        console.log("failed")
      }
    })
  });
}


function Login(){
  var params ={
    url:LOGINAPI
  }
  wx.login({
    complete: (res) => {
      console.log(res.code);
      params.data={
        code:res.code
      }
      request(params).then(res=>{
        console.error(res);
      })
    },
  })
}
module.exports = {
  request,
  Login
}