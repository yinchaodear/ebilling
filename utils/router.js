function navigateTo( path){
    wx.navigateTo({
      url: path,
    })
}
  

function redirectTo( path){
  wx.redirectTo({
    url: path,
  })
}


function switchTab( path){
  wx.switchTab({
    url: path,
  })
}



module.exports={
  navigateTo,
  redirectTo,
  switchTab
}