// pages/checkRoomattend/checkRoomattend.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveData: false,
    roomdetailList: null,
    roomid: null
  },
  checkPersonRecord: function(event) {
    var roomdetailid = event.currentTarget.dataset.roomdetailid;
    console.log(roomdetailid);
    wx.navigateTo({
      url: '/pages/Create/allpersoninf/allpersoninf?roomdetailid=' + roomdetailid,
    })
  },
  getRoomdetail: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlCreated('/roomdetail/getRoomdetail', that.data.roomid),
      success: function(res) {
        console.log(JSON.stringify(res.data));
        //如果考勤明细不为空
        if (res.data.code === 1) {
          //将房间考勤明细存到data中
          that.setData({
            roomdetailList: res.data.data,
            haveData: true
          })
        } else if (res.data.code === 0) {
          console.log("数据为空");
          wx.showToast({
            title:'无数据'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取roomid
    this.setData({
      roomid: options.roomid
    })
    //获取房间明细
    this.getRoomdetail();
  },
})