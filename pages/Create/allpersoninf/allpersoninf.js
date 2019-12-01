// pages/allpersoninf/allpersoninf.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomdetailid: null,
    personinf:null
  },
  fetchpersoninf: function() {
    var that = this;
    wx.request({
      url: app.globalData.urlCreated('/singledetail/SingledetailsByRId', that.data.roomdetailid),
      //将所有用户基本信息存到personinf中
      success: function(res) {
        console.log('单次考勤明细：',res.data);
        if(res.data.code===1){
          that.setData({
            personinf: res.data.data
          })
        }else if(res.data.code===0){
          console.log("记录为空");
          wx.showToast({
            title:'无数据'
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
    this.setData({
      roomdetailid: options.roomdetailid
    })
    console.log('房间考勤明细号：',options.roomdetailid);
    this.fetchpersoninf();
  },
})