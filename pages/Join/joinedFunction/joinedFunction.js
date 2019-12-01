// pages/joinedFunction/joinedFunction.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rname:'',
    id:null,
    goUrl: '',
    lookallperson:''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var that=this;
    //将房间信息存入
    this.setData({
      id: options.id,
      rname:options.rname
    })
    this.setData({
      goUrl: "/pages/Join/checkMyattend/checkMyattend?roomid=" + that.data.id+"&userid="+app.globalData.userid,
      lookallperson: "/pages/Create/getRoomAllUser/getRoomAllUser?roomid=" + that.data.id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var name = this.data.name;
    return {
      title: "向您推荐:" + name
    }
  }
})