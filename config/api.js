
var BaseUrl = 'https://qlife.yuqiaoerp.com/';  
BaseUrl ='http://localhost:9095/'
var PicBaseUrl = 'https://hhjc.yuqiaoerp.com/';  
var RpcUrl = BaseUrl + 'JSON-RPC';
var PicUrl = PicBaseUrl + 'attachment.action?method:showImageNew';
var VideoUrl = PicBaseUrl + 'attachment.action?method:downloadFile';
var PicUrlsku = PicBaseUrl + 'attachment.action?method:showItemProductImg';
var QRCodeUrl = BaseUrl + "TwoDimensionCode";

module.exports = {
  RpcUrl,
  PicUrl,
  BaseUrl,
  QRCodeUrl,
  PicUrlsku,
  VideoUrl
};