
var BaseUrl = 'https://ebilling.yuqiaoerp.com/';  
//BaseUrl ='http://localhost:9095/'
var PicBaseUrl = 'https://hhjc.yuqiaoerp.com/';  
var RpcUrl = BaseUrl + 'JSON-RPC';
var VideoUrl = PicBaseUrl + 'attachment.action?method:downloadFile';
var PicUrlsku = PicBaseUrl + 'attachment.action?method:showItemProductImg';
var QRCodeUrl = BaseUrl + "TwoDimensionCode";
var UPLOADURL =BaseUrl +'attachment/uploadFile'

function PicUrl(objectType,objectId,name){
  if(name && (name.indexOf("attachment")>-1||name.indexOf("objectId")>-1)){
    if(name.startsWith("/")){
      return BaseUrl.substring(0, BaseUrl.length-1) + name;
    }else{
      return BaseUrl + name;
    }
    
  }
  return BaseUrl +"attachment/showImage?objectId="+objectId+"&objectType="+objectType+"&fileName="+name;
}

module.exports = {
  RpcUrl,
  PicUrl,
  BaseUrl,
  QRCodeUrl,
  PicUrlsku,
  VideoUrl,
  UPLOADURL
};
