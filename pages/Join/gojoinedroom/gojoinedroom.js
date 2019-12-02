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
   * 复制房间号
   */
  copyRoomNumber:function(){
    wx.setClipboardData({
      data: this.data.roominf.roomnumber,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  //签到
  tosign: function () {
    let that = this;
    var roomid = this.data.roominf.id;
    var latitude = null;
    var longitude = null;
    wx.getSetting({
      success(res) {
        //如果还没授权用户位置信息或者拒绝授权
        console.log(res.authSetting);
        if (!res.authSetting['scope.userLocation']) {
          console.log('ssssssssssssss')
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序获取位置信息
              console.log("用户已经同意小程序获取位置信息");
              // 签到
              that.tosign();
            },
            fail: function () {
              wx.showModal({
                title: '用户未授权',
                content: '如需正常使用小程序功能，请按确定并且在【我的】页面中点击授权按钮，点击位置信息勾选。',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          })
          // 如果已经授权
        } else {

          wx.showLoading({
            title: '签到中',
          })
          wx.getLocation({
            type: 'gcj02',
            // isHighAccuracy: "true",
            // highAccuracyExpireTime: 4000,
            success(res) {
              console.log('获取位置成功');
              latitude = res.latitude
              longitude = res.longitude
              wx.request({
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                url: app.globalData.urlCreated('/attendance/single/student'),
                data: {
                  roomId: roomid,
                  studentId: app.globalData.userid,
                  latitude: latitude,
                  longitude: longitude
                },

                success: function (res) {
                  //如果在考勤范围内
                  if (res.data.status === 1) {
                    wx.showToast({
                      title: '签到成功',
                      duration: 2000,
                    })
                  } else if (res.data.status === 2) {
                    wx.showToast({
                      title: '签到过了',
                      duration: 2000,
                    })
                  } else if (res.data.status === 0) {
                    console.log('签到失败：', res.data)
                    wx.showToast({
                      title: res.data.data,  // 显示失败信息
                      image: '/images/warning.png',
                      duration: 2000
                    })
                  }
                },
                fail: function () {
                  wx.showToast({
                    title: '服务器异常',
                    image: '/images/warning.png'
                  })
                }
              })
              wx.showLoading({
                title: '签到中'
              })
            },
            // 位置获取失败
            fail(err) {
              console.log("获取位置失败：", err)
              // 如果是GPS信号不好或者没开GPS
              if (err.errCode == 2) {
                wx.showToast({
                  title: "检查GPS状态",
                  image: "/images/warning.png"
                })
              } else {
                wx.showToast({
                  title: "获取位置失败",
                  image: "/images/warning.png"
                })
              }

            }
          })

        }
      }
    })

  }
})