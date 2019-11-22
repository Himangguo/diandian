//获取应用实例
const app = getApp();
var base1 = "/images/关于.png";
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},

    icon: ''
  },
  onLoad: function() {
   this.setData({
     userInfo:app.globalData.userInfo
   })
  },


})