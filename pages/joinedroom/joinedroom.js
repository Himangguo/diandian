// pages/joinedroom/joinedroom.js
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
    value: '',
    focus: true,

  },
  changeName: function() {
    //显示输入框
    this.setData({
      hiddens: false
    })
  },
  formSubmit: function(e) {
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
            title: '加入成功',
            duration:2000,
            complete(){
              wx.hideLoading()
            }
          })
          //刷新页面
          wx.startPullDownRefresh();
        } else if (res.data.code === -1) {
          wx.showToast({
            title: '不能加入你房间',
            image: '/images/warning.png',
            duration: 2000,
            complete() {
              wx.hideLoading()
            }
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
  //签到
  tosign: function(event) {
    var teacherid = event.currentTarget.dataset.createdid;
    var roomid = event.currentTarget.dataset.roomid;
    var latitude = null;
    var longitude = null;
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy:"true",
      success(res) {
        console.log('获取位置成功');
        latitude = res.latitude
        longitude = res.longitude
        wx.showLoading({
          title: '签到中',
        })
        wx.request({
          method:'POST',
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

          success: function(res) {
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
                console.log('签到失败：',res.data)
              wx.showToast({
                title: '签到失败',
                image: '/images/warning.png',
                duration: 2000
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
        wx.showLoading({
          title: '签到中',
        })
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
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    var that = this;
    this.setData({
      inputVal: e.detail.value
    });
    console.log(Number(e.detail.value));
    //如果输入的不是空值，且不是NaN（只有NaN不和自身相等）
    if (e.detail.value && Number(e.detail.value) === Number(e.detail.value)) {
      wx.request({
        url: app.globalData.urlCreated('/room/getRoomById', e.detail.value),
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
    }

  },




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
    var that = this;
    wx.request({
      url: app.globalData.urlCreated('/user/getJoinRoomsByUserId', app.globalData.userid),
      //给后端传userid
      success: function(res) {
        if (res.data.code === 1) { //如果用户有加入过的房间数据
          wx.showToast({
            title:''
          })
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
          wx.showToast({
            title: '数据为空',
            image: '/images/warning.png'
          })
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
    wx.showLoading({
      title: '加载中',
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      value: app.globalData.userInfo.nickName
    })
    //
    this.fetchData();
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