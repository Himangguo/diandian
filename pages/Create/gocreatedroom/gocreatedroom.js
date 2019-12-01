// pages/gocreatedroom/gocreatedroom.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roominf: null,
    roomdetailid: null,
    attendtime: null,
    presenttime: null,
  },
  //返回上一个页面刷新
  backRefreash: function() {
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
  //开始考勤
  startattendance: function() {
    var that = this;
    console.log("点击开始考勤");
    wx.getSetting({
      success(res) {
        console.log(res.authSetting);
       // 如果房间人数为0
        if (that.data.roominf.personcount == 0){
          wx.showToast({
            title: '课程人数为零',
            image: '/images/warning.png'
          })
          return;
        }
         //如果还没授权用户位置信息或者拒绝授权
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序获取位置信息
              console.log("用户已经同意小程序获取位置信息");
              wx.reLaunch({
                url: '/pages/Create/attendancing/attendancing?roominf=' + JSON.stringify(that.data.roominf)
              })
            },
            fail: function(){
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

        } else {
          wx.reLaunch({
            url: '/pages/Create/attendancing/attendancing?roominf=' + JSON.stringify(that.data.roominf)
          })
        }
        /*
         //如果用户还没授权后台更新位置信息
        if (!res.authSetting['scope.userLocationBackground']) {
          wx.showModal({
            title: '提示',
            content: '设置后台获取位置',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定');
                //打开设置页
                wx.openSetting({
                  success(res) {
                    console.log('用户授权好了后台位置信息获取',res.authSetting)
                    //进入考勤页
                    wx.reLaunch({
                      url: '/pages/Create/attendancing/attendancing?roominf='+JSON.stringify(that.data.roominf)
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }

            }

          });

        }else{
          //进入考勤页
          wx.reLaunch({
            url: '/pages/Create/attendancing/attendancing?roominf=' + JSON.stringify(that.data.roominf)
          })
        }
        */
      }
    })



  },
  //用户点击了功能按钮
  roomfunc: function() {
    var roominf = this.data.roominf;
    wx.navigateTo({
      url: '/pages/Create/createdFunction/createdFunction?roominf=' + JSON.stringify(roominf)
    })
  },
  //用户点击了删除按钮
  deleteRoom: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '将删除： ' + this.data.roominf.rname + '?',
      success: function(res) {
        console.log('userid:' + app.globalData.userid,
          'roomid:' + that.data.roominf.id
        )
        //如果用户点击了确认
        if (res.confirm) {
          wx.request({
            url: app.globalData.urlCreated('/room/deleteRoom', that.data.roominf.id),
            //将userid和房间id传给后端
            success: function(res) {
              //如果删除成功
              if (res.data.code === 1) {
                wx.showToast({
                  title: '删除成功',
                  duration: 2000,
                  success: function() {
                    that.backRefreash();
                  }
                })
              } else {
                wx.showToast({
                  title: '删除失败',
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
   * 根据房间id获取房间信息
   * @param roomid
   */
  getRoominf:function(roomid){
    let that = this;
    wx.request({
      method:'get',
      url:app.globalData.urlCreated('/room/getRoomById',roomid),
      success(res) {
        console.log("success");
        that.setData({
          roominf:res.data.data
        })
      },
      fail(res) {
        console.log("fail",res.data)
        wx.showToast({
          title:'网络异常',
          image:'/pages/warning.png'
        })
      },
      complete(res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var roomid = JSON.parse(options.roomid);
    // 根据roomid获取房间信息
    this.getRoominf(roomid)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getRoominf(this.data.roominf.id) //重新加载资源

  }


})