// pages/Create/getStudentStatistics/getStudentStatistics.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userStatistics:null
  },
  /**
   * 获取每个学生迟到，旷课，请假...的次数
   * @param roomid
   */
  getStuStatistics:function(roomid){
    let that = this;
    wx.showLoading();
    wx.request({
      method:'get',
      url:app.globalData.urlCreated('/room/getStudentStatistics',roomid),
      success(res) {
        console.log('服务端返回的学生信息',res.data)
        //如果数据为空
        if(res.data.code == 0){
          console.log('数据为空');
          wx.showToast({
            title:'无数据'
          })
        }else if (res.data.code == 1){
          that.setData({
            userStatistics:res.data.data.userStatistics
          })
        }

      },
      fail(res){
        wx.showToast({
          title: '服务器异常',
          image: "/images/warning.png"
        })
      },
      complete: function () {
        wx.hideLoading();
      }

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let roomid = options.roomid;
    this.getStuStatistics(roomid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})