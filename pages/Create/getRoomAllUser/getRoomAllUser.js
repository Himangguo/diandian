// pages/getRoomAllUser/getRoomAllUser.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allPerson: []
  },
  getAllpersoninf: function(roomid) {
    var that = this;
    wx.request({
      url: app.globalData.urlCreated('/room/getUsersInRoom',roomid),
      success: function(res) {
        if (res.data.code === 1) {
          that.setData({
            allPerson: res.data.data
          })
          console.log(that.data.allPerson);
        } else if (res.data.code === -1) {
          wx.showToast({
            title: '出错了',
            image: '/images/warning.png'
          })
        }else if(res.data.code===0){
          console.log("数据为空");
          wx.showToast({
            title:'无数据'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '服务器异常',
          image: '/images/warning.png'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取roomid
    var roomid = options.roomid;
    this.getAllpersoninf(roomid);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})