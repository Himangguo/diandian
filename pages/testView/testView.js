// pages/testView/testView.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddens:false,
    focus:true,
    value:'默认微信名',
    freshJoinedUser: [{
        id: 0,
        remarkname: '周学辰xxx',
        sex: 1
      },
      {
        id: 1,
        remarkname: '附近的',
        sex: 0
      },
      {
        id: 2,
        remarkname: '安监局',
        sex: 1
      },
      {
        id: 3,
        remarkname: '啊姐姐',
        sex: 0
      }
    ]
  },
  confirm_one:function(event){
  
       },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // var time=setInterval(function(){
    //  that.setData({
    //    freshJoinedUser:that.data.freshJoinedUser.concat(
    // {
    //   id:0,
    //   remarkname:'周学辰',
    //   sex:1
    // }
    //    )
    // })
    // },2000)
    setTimeout(function() {
      that.setData({
        freshJoinedUser: [{
            id: 0,
            remarkname: '周学辰',
            sex: 1
          },
          {
            id: 1,
            remarkname: '附近的',
            sex: 0
          },
          {
            id: 2,
            remarkname: '安监局',
            sex: 1
          },
          {
            id: 3,
            remarkname: '啊姐姐',
            sex: 0
          },
          {
            id: 3,
            remarkname: '啊姐姐',
            sex: 0
          }
        ]
      })
      }, 5000)

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})