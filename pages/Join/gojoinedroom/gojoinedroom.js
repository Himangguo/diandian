// pages/gojoinedroom/gojoinedroom.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roominf: null
  },
  roomfunc: function() {
    wx.navigateTo({
      url: '/pages/Join/joinedFunction/joinedFunction?rname=' + this.data.roominf.rname + '&id=' + this.data.roominf.id,
    })
  },
  backRefreash: function () {
    var pages = getCurrentPages(); // 获取当前页面的页桢
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里,这里面是触发上个界面
      prePage.fetchData();
      wx.navigateBack({
        delta: 1 // 返回上一页
      });
    }
  },
  //用户点击了删除按钮
  deleteRoom: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '退出： ' + this.data.roominf.rname + '?',
      success: function(res) {
        console.log('userid:' + app.globalData.userid,
          'roomid:' + that.data.roominf.id
        )
        //如果用户点击了确认
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlCreated('/room/userDropOutRoom', that.data.roominf.id, app.globalData.userid),
            success: function(res) {
              //如果删除成功
              if (res.data.code === 1) {
                wx.showToast({
                  title: '退出成功',
                  duration: 2000,
                  success: function() {
                  that.backRefreash();
                  }
                })
              } else {
                wx.showToast({
                  title: '退出失败',
                  image: '/images/warning.png'
                })
              }
            },
            //服务器异常
            fail: function() {
              wx.showToast({
                title: '删除失败',
                image: '/images/warning.png'
              })
            },
            complete: function() {
              wx.hideLoading();
            }
          })
          wx.showLoading({
            title: '焚烧中',
          })
        } else if (res.cancel) { //如果用户点击了取消
        }


      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var room = JSON.parse(options.roominf);
    //将roominf存到data中
    this.setData({
      roominf: room
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