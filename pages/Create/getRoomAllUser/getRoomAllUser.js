// pages/getRoomAllUser/getRoomAllUser.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allPerson: [],
    roomid:''
  },
  /**
   * 获取所有房间人员信息
   * @param {*} roomid 
   */
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
          that.setData({
            allPerson:[]
          })
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
      },
      complete: function() {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 删除房间成员
   */
  viewKickOut: function(e){
    let userid = e.currentTarget.dataset.userid;
    let remarkname = e.currentTarget.dataset.remarkname;
    console.log(userid,remarkname)
    var that = this;
   
    wx.showModal({
      title: '提示',
      content: '删除成员：' + remarkname + '?',
      success: function(res) {
        //如果用户点击了确认
        if (res.confirm) {
          wx.showLoading({
            title:'删除中'
          })
          wx.request({
            url: app.globalData.urlCreated('/room/userDropOutRoom', that.data.roomid, userid),
            success: function(res) {
              //如果删除成功
              if (res.data.code === 1) {
                wx.showToast({
                  title: '删除成功',
                  duration: 2000,
                  success: function() {
                  that.getAllpersoninf(that.data.roomid);
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
            }
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
    //获取roomid
    var roomid = options.roomid;
    this.setData({
      roomid:roomid
    })
    this.getAllpersoninf(roomid);

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getAllpersoninf(this.data.roomid); //重新加载资源

  }


})