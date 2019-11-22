// pages/createattence/createattence.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    distance: '',
    range: [5, 10, 20, 50, 100],
    switch1Checked: 0,
  },
  selectDis: function(event) {
    var index = event.detail.value;
    console.log(index);
    var disrange = this.data.range;
    this.setData({
      distance: disrange[index]
    })
  },
  selectnull: function() {
    wx.showToast({
      title: '亲，距离是必填项哦',
      image: '/images/help.png'
    })
  },
  formReset: function() {
    this.setData({
      distance: ''
    })
    console.log("发生了reset事件");

  },
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
  /**
   * 监听switch改变
   * @param e
   */
  switch1Change:function(e){
    console.log('switch发送change事件，携带值为',e.detail.value)
    this.setData({
      switch1Checked:e.detail.value?1:0
    })
  },
  formSubmit: function(e) {
    let that = this;
    //获取到表单数据
    let rname = e.detail.value.rname;
    let distance = this.data.distance;
    let ifcheck = this.data.switch1Checked;
    let note = e.detail.value.note;
    console.log("name:" + rname, "distance:" + distance, 'ifcheck'+ifcheck,"note:" + note);
    //如果输入合法
    if (rname != '' && distance != '') {
      //将数据保存到数据库
      wx.request({
        method: "post",
        url: app.globalData.urlCreated('/room/createRoom'),
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },

        data: {
          rname: rname,
          distance: distance,
          note: note,
          checked:ifcheck,
          userid: app.globalData.userid
        },
        success: function(res) {
          if (res.data.code === 1) {
            console.log('OK');
            wx.showToast({
              title: '创建成功'
            })
            that.backRefreash();
          }
        },
        fail: function() {
          wx.showToast({
            title: '创建失败请重试',
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
      //如果未输入课程名
    } else if (rname == '') {
      wx.showToast({
        title: '课程名不能为空',
        image: '/images/help.png'
      })
    } else if (distance == '') {
      wx.showToast({
        title: '距离不能为空',
        image: '/images/help.png'
      })
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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