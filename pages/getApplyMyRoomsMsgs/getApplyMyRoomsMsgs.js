// pages/Create/getApplyMyRoomsMsgs/getApplyMyRoomsMsgs.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    noApplyList:null,
    applyedList:null,
    applyedImageUrl:'/images/headImage.png',
    noApplyiImageUrl:'/images/applyImage.png',

  },

  /**
   * 获取所有申请加入我的房间的消息
   */
  getAllApply:function(){
    let that=this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      method:'get',
      url:app.globalData.urlCreated('/message/getApplyMyRoomsMsgs',app.globalData.userid),
      success(res) {
        console.log('服务端返回的数据：',res.data);
        if(res.data.code == 1){
          let noApplyList = res.data.data.filter((item) => {
            return item.roomapply.dealresult === null //当isread == 0时说明未审批
          })
          let applyedList = res.data.data.filter((item) => {
            return item.roomapply.dealresult !== null //当isread == 1时说明已审批
          })
          for(var item of noApplyList){
            item.sendtime = app.globalData.timeFormat.getTime(item.sendtime);
            item.roomapply.dealtime = app.globalData.timeFormat.getTime(item.roomapply.dealtime);
          }
          for (var item of applyedList) {
            item.sendtime = app.globalData.timeFormat.getTime(item.sendtime);
            item.roomapply.dealtime = app.globalData.timeFormat.getTime(item.roomapply.dealtime);
          }
          //修改data
          that.setData({
            noApplyList: noApplyList,
            applyedList: applyedList
          })
        }
        
      },
      fail(res){
        wx.showToast({
          title: '网络异常',
          image: "/images/warning.png"
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  sendApplyResult:function(applyid,result){
    let that=this;
    console.log(applyid,result)
    wx.request({
      method:'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url:app.globalData.urlCreated('/message/dealRoomapplyMessage'),
      data:{
        msgId:applyid,
        result:result
      },
      success(res) {
        console.log('成功，后台返回数据：',res.data)
        if (res.data.code === 1){
          wx.showToast({
            title:'操作成功'
          })
        }
      },
      fail(res) {
        console.log(res.data)
      }
    })
  },
  agree:function(e){
    console.log(e)
    let applyid=e.currentTarget.dataset.applyid;
    let result = 1;
    this.sendApplyResult(applyid,result)
  },
  disagree:function(e){
    let applyid=e.currentTarget.dataset.applyid;
    let result = 2;
    this.sendApplyResult(applyid,result)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.userInfo){
      wx.showModal({
        title: '用户未授权',
        content: '如需正常使用小程序，请按确定并且在【创建课程】页面中点击授权按钮',
        showCancel: false,
        success: function (res) {
          console.log('用户点击了确定');
          return;
        }
      })
    }else{
      this.getAllApply();
    }

  },
  /**
   * 监听页面显示
   */
  onShow(){
    if (app.globalData.ifNowAuth){
      this.getAllApply();
    }
  },


  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getAllApply(); //重新加载资源

  },
  /**
   * 滑动切换tab
   */
  bindChange: function(e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /**
   * 点击切换tab
   */
  swichNav: function(e) {

    let that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }

})