// pages/Create/getStudentStatistics/getStudentStatistics.js
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userStatistics:null
  },
  /**
   * 获取每个学生迟到，旷课，请假...的次数
   * @param roomid
   */
  getStuStatistics:function(roomid){
    let that = this;
    wx.showLoading();
    wx.request({
      method:'get',
      url:app.globalData.urlCreated('/room/getStudentStatistics',roomid),
      success(res) {
        console.log('服务端返回的学生信息',res.data)
        //如果数据为空
        if(res.data.code == 0){
          console.log('数据为空');
          wx.showToast({
            title:'无数据'
          })
        }else if (res.data.code == 1){
          that.setData({
            userStatistics:res.data.data.userStatistics
          })
        }

      },
      fail(res){
        wx.showToast({
          title: '服务器异常',
          image: "/images/warning.png"
        })
      },
      complete: function () {
        wx.hideLoading();
      }

    })
  },
  /**
   * 查看某一用户单次考勤详情
   */
  viewStuDetail:function(e){
    let that = this;
    let userid = e.currentTarget.dataset.userid;
    let roomid = this.data.userStatistics[0].roomid;
    wx.navigateTo({
      url:'/pages/Join/checkMyattend/checkMyattend?roomid=' + roomid+'&userid='+userid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let roomid = options.roomid;
    this.getStuStatistics(roomid);
  },


})