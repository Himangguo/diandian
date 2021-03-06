let temp = require('../../template/wxmlTemp/newApply.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lineHeight: '',
    haveData: false,
    joinroom: null,
    inputShowed: false,
    inputVal: "",
    roominf: null,
    hiddens: true,
    value: null,
    focus: true,

  },
  testAdd(){
    app.globalData.applyCount++;
  },

  changeName: function() {
    //显示输入框
    this.setData({
      hiddens: false
    })
  },
  formSubmit: function(e) {
    if (e.detail.value.nickname == ""){
      wx.showToast({
        title:"备注为必填项",
        image:"/images/warning.png"
      })
      return;
    }
    //获取到表单数据
    var name = e.detail.value.nickname;
    this.setData({
      value: name
    })
    //加入房间
    this.joining();
    this.setData({
      hiddens: true
    })
  },
  cancel: function() {
    //隐藏输入框
    this.setData({
      hiddens: true
    })
  },
  /**
   * 加入课程
   */
  joining: function() {
    var that = this;
    wx.showLoading({
      title: '加入中',
    })
    wx.request({
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url: app.globalData.urlCreated('/room/userJoinRoom'),
      data: {
        remarkname: that.data.value,
        roomid: that.data.roominf.id,
        userid: app.globalData.userid
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code === 1) {
          wx.showToast({
            title: res.data.message,
          })
          //刷新页面
          wx.startPullDownRefresh();
        } else if (res.data.code === -1) {
          wx.showToast({
            title: res.data.message,
            image: '/images/warning.png',
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '服务器出错',
          image: '/images/warning.png'
        })
      }
    })
  },
  autoheight: function() {
    var query = wx.createSelectorQuery();
    var that = this;
    query.select('.roomgo').boundingClientRect(function(rect) {
      var time = setInterval(function() {
        if (rect) {
          that.setData({
            lineHeight: rect.height + 'px'
          })
          clearInterval(time);
        }
      }, 500)

    }).exec();
  },
  /**
   * 签到
   * @param roomid
   */
  signing: function(roomid){
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
        if (err.errCode == 2){
          wx.showToast({
            title: "检查GPS状态",
            image: "/images/warning.png"
          })
        }else{
          wx.showToast({
            title: "获取位置失败",
            image: "/images/warning.png"
          })
        }

      }
    })
  },
  //检查位置授权情况
  tosign: function(event) {
    let that = this;
    var roomid = event.currentTarget.dataset.roomid;
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
              that.signing(roomid);
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
          // 如果已经授权
        } else {
          that.signing(roomid);
        }


      }
    })

  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false,
      roominf:null
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: "",
      roominf:null
    });
  },
  inputTyping: function(e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value
    });
    console.log(Number(e.detail.value),typeof(e.detail.value));
    //如果输入的不是空值，且不是NaN（只有NaN不和自身相等）
    if (e.detail.value && Number(e.detail.value) === Number(e.detail.value)) {
      wx.request({
        url: app.globalData.urlCreated('/room/getRoomByRoomNumber', e.detail.value),
        success: function(res) {
          console.log(res.data);
          if (res.data.code === 1 && res.data.data) {
            that.setData({
              roominf: res.data.data
            })
          } else if (res.data.code === -1) {
            wx.showToast({
              title: '查询失败',
              image: "/images/warning.png"
            })
          }
        }
      })
    }else{
      this.setData({
        roominf:null
      });
    }
  }

  ,



  joinroominf: function(event) {
    var that = this;
    var index = event.currentTarget.dataset.index; //获取到用户点击房间的房间的index
    console.log("index:" + index);
    var roominf = that.data.joinroom[index]; //点击的房间信息
    wx.navigateTo({
      url: '/pages/Join/gojoinedroom/gojoinedroom?roominf=' + JSON.stringify(roominf),
    })
  },
  fetchData: function() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.urlCreated('/user/getJoinRoomsByUserId', app.globalData.userid),
      //给后端传userid
      success: function(res) {
        if (res.data.code === 1) { //如果用户有加入过的房间数据
          wx.hideLoading();
          console.log(res.data.data);
          that.setData({
            joinroom: res.data.data,
            haveData: true
          })
          //自适应高度
          that.autoheight();
        } else if (res.data.code === -1) { //后端查询出错
          wx.showToast({
            title: '查询出错',
            image: '/images/warning.png',
          })
        }else if(res.data.code===0){  //如果数据为空
          wx.hideLoading();
          that.setData({
            haveData:false
          })
        }

      },
      fail: function(res) {
        wx.showToast({
          title: '服务器异常',
          image: "/images/warning.png"
        })
      },
      complete: function(res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
    })
   
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.userInfo){
      this.setData({
        isload:false
      })
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序，请按确定并且在【创建课程】页面中点击授权按钮',
        showCancel: false,
        success: function (res) {
          console.log('用户点击了确定');
          return;
        }
      })
    }else{
     
      this.setData({
        value: app.globalData.userInfo.nickName
      })
      //
      this.fetchData();
    }

  },
  /**
   * 监听页面显示
   */
  onShow(){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        messageCount:app.globalData.applyCount
      })
      // 设置被监听对象和计算属性
      app.observe(app.globalData,"applyCount",(newVal)=>{
        this.getTabBar().setData({
          messageCount:newVal
        })
      })
      }
    if (app.globalData.ifNowAuth){
      this.fetchData();
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.fetchData();
    this.autoheight();
  }
})