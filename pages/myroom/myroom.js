let temp = require('../../template/wxmlTemp/newApply.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    haveData: false,
    openid: '',
    roomlist: null,
    messageCount:app.globalData.applyCount
  },
  openToast: function (e) {
    // 当前申请数
    let count = e.currentTarget.dataset.count;
    wx.showModal({
      title: '新申请',
      content: '如需查看请前往【申请列表】查看',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
  testAdd(){
    app.globalData.applyCount++;
  },
  //用户点击了某房间
  gocreatedroom: function(event) {
    var that = this;
    var roomid = event.currentTarget.dataset.roomid; //获取到用户点击房间的房间的id
    console.log("roomid:" + roomid);
    wx.navigateTo({
      url: '/pages/Create/gocreatedroom/gocreatedroom?roomid=' + roomid
    })
  },
  //用户点击了创建
  createattence: function() {
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序，请按确定并且在【创建课程】页面中点击授权',
        showCancel: false,
        success: function (res) {
          console.log('用户点击了确定');
          return;
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/Create/createattence/createattence',
      })
    }

   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  fetchData: function() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.urlCreated('/user/getMyRoomsById', app.globalData.userid),
      success: function(res) {
        console.log("获取创建的房间列表" + JSON.stringify(res.data));
        //如果该用户创建过房间数据
        if (res.data.code === 1) {
          that.setData({
            roomlist: res.data.data,
            haveData: true
          })
          wx.showToast({
            title: '加载成功',
          })
        } else if (res.data.code === 0) { // 如果数据为空
          wx.hideLoading();
          that.setData({
            haveData: false
          })
          
        } else {
          wx.showToast({
            title: '加载失败',
            image: '/images/warning.png'
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
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })


  },
  onLoad: function(options) {
    console.dir(temp.temp)
    let that = this;
    // 设置被监听对象和计算属性
    //app.observe(app.globalData,"applyCount",this.computer["applyCount"].bind(this))
    this.ifuserinfo();
    //监听用户信息是否获取到，如果获取到则隐藏授权栏
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
    //监听userid是否拿到，如果拿到就获取考勤房间信息
    var time1 = setInterval(function() {
      if (app.globalData.userid) { //如果已经获得了userid
        clearInterval(time1); //清除定时器
        //拿所有创建房间数据
        that.fetchData();

      }
    }, 1000)

  },
  /**
   * 页面显示事件
   */
  onShow:function(){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        messageCount:app.globalData.applyCount
      })
      // 设置被监听对象和计算属性
      app.observe(app.globalData,"applyCount",(newVal)=>{
        this.getTabBar().setData({
          messageCount:newVal
        })
      })
      if (app.globalData.ifNowAuth){
        this.fetchData();
      }
  }
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        hasUserInfo: true
      })
    }else{
      console.log("用户拒绝获取权限");
    }

  },
  ifuserinfo: function() {
    var that = this;
    if (!app.globalData.userInfo) {
      console.log("用户没有数据");
    } else if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          icon: base1
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.fetchData(); //重新加载资源

  }
})