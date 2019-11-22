// pages/joinedFunction/joinedFunction.js
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
      goUrl: "/pages/Join/checkMyattend/checkMyattend?roomid=" + that.data.id,
    })
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
    var name = this.data.name;
    return {
      title: "向您推荐:" + name
    }
  }
})