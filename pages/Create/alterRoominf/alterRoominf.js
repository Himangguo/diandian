// pages/Create/alterRoominf/alterRoominf.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roominf: null,
    range: [20, 30, 40, 50, 100, 200, 500, 10000, 100000],
    distance: '',
    switch1Checked:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var roominf = JSON.parse(options.roominf);
    this.setData({
      roominf: roominf,
      distance: roominf.distance,
      switch1Checked:roominf.checked
    })
  },
  selectDis: function(event) {
    var index = event.detail.value;
    console.log(index);
    var disrange = this.data.range;
    this.setData({
      distance: disrange[index]
    })
  },
  backRefreash: function () {
    var pages = getCurrentPages(); // 获取当前页面的页桢
    console.log("当前页面帧："+pages.length);
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[0];
      //关键在这里,这里面是触发这个界面
      prePage.fetchData();
      wx.navigateBack({
        delta: 3 // 返回上三页
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
    console.log("name:" + rname, "distance:" + distance,"ifcheck:"+ifcheck, "note:" + note);
    //如果输入合法
    if (rname != '' && distance != '') {
      //将数据保存到数据库
      wx.request({
        method:'post',
        header:{
          "Content-Type": "application/x-www-form-urlencoded"
        },
        url: app.globalData.urlCreated('/room/updateRoom'),
        data:{
          id:that.data.roominf.id,
          rname:rname,
          distance:distance,
          checked:ifcheck,
          note:note,
          userid:app.globalData.userid
        },
        success: function(res) {
          if (res.data.code === 1) {
            console.log('OK');
            wx.showToast({
              title: '修改成功'
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
    } else if (name == '') {
      wx.showToast({
        title: '课程名不能为空',
        image: '/images/help.png'
      })
    }

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