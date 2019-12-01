// pages/checkMyattend/checkMyattend.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdetails: null,
    haveData:false
  },
  /**
   * 获取考勤详情
   * @param roomid
   * @param userid
   */
  getMyattendence: function(roomid,userid) {
    var that = this;
    wx.request({
      url: app.globalData.urlCreated('/singledetail/getOnStudentDetails/', roomid, userid),
      //返回该用户在这个房间的考勤记录
      success: function(res) {
        if (res.data.code ===1) { //如果存在该用户在该房间的考勤记录
          console.log(res.data.data);
          that.setData({
            userdetails: res.data.data,
            haveData:true
          })
        }  else if (res.data.code === -1) { //如果查询出错
          console.log("查询报错了");
        }else if(res.data.code===0){  //如果数据为空
        console.log('数据为空');
        that.setData({
          haveData:false
        })
        }

      },
      fail: function() {
        wx.showToast({
          title: '服务器异常',
          image: "/images/warning.png"
        })
      },
      complete: function() {
        wx.hideLoading();
      }
    })
    wx.showLoading({
      title: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyattendence( options.roomid,options.userid);
  }
})