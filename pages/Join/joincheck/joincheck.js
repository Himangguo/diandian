// pages/Join/joincheck/joincheck.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'',
    ownuser: null,
    attendence:'持续考勤中'
  },
  backing: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定退出考勤？',
      success: function (res) {
        //如果点击了确认
        if (res.confirm) {
          //停止考勤
          clearInterval(that.data.time);
          //跳转到加入页面
          wx.reLaunch({
            url: '/pages/joinedroom/joinedroom'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      remarkname: app.globalData.userInfo.nickName,
      sex: app.globalData.userInfo.gender,
      roomid:options.roomid,
      teacherid:options.teacherid
    })
    //隔5秒钟发送自己的位置信息,防止延迟带来的误差所以设为5秒而不是6秒
    that.data.time = setInterval(that.refreshsign, 5000);
  },
  //签到考勤
  refreshsign: function() {
    var that=this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log('获取位置成功');
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: app.globalData.url +'joincheck/join',
          data: {
            teacherid: that.data.teacherid,
            roomid: that.data.roomid,
            userid: app.globalData.userid,
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            console.log(res.data);
         
            //签到成功
            if (res.data.code === 1) {
              console.log('签到成功!!!!!!!!!!!!!');
              that.setData({
                ownuser: res.data.data
              })
                //如果不在考勤范围
              if (res.data.data.status === "失败"){   
                console.log('超出考勤范围!!!!!!!!!!!!!');
                wx.showToast({
                  title: '超出考勤范围',
                  image: '/images/warning.png',
                  duration:3000
                })
              }
              //如果考勤已经结束
            } else if (res.data.code === 0) {
              console.log('考勤已结束！！！！！！！！！！');
              that.setData({
                attendence:'考勤已结束'
              })
              wx.showToast({
                title: '考勤已结束',
                duration:4000,
                success: function() {
                  console.log('即将返回！！！！！！！！！！');
                  clearInterval(that.data.time);
                  //跳转到加入房间页面
                  wx.navigateBack({
                    delta:3
                  })
                }
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
      }
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

  }
})