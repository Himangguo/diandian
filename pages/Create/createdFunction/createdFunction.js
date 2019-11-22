// pages/roomFunction/roomFunction.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: null,
    goUrl: '',
    lookallperson: '',
    getApplyMyRoomsMsgs:'',
    roominf:null
  },


  /**
   *   修改课程基本信息
   */
  alterRoom:function(){
      wx.navigateTo({
        url: '/pages/Create/alterRoominf/alterRoominf?roominf='+JSON.stringify(this.data.roominf),
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //将房间信息存入
    this.setData({
     roominf:JSON.parse(options.roominf)
    })
    this.setData({
      goUrl: "/pages/Create/checkRoomattend/checkRoomattend?roomid=" + that.data.roominf.id,
      lookallperson: "/pages/Create/getRoomAllUser/getRoomAllUser?roomid=" + that.data.roominf.id,
      getStudentStatistics: "/pages/Create/getStudentStatistics/getStudentStatistics?roomid=" + that.data.roominf.id
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let name = this.data.name;
    return {
      title: "向您推荐:" + name
    }
  }
})