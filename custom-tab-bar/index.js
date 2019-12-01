const app = getApp();
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#6bcb4a",
    "list": [
      {
        "pagePath": "/pages/myroom/myroom",
        "text": "创建房间",
        "iconPath": "/images/home.png",
        "selectedIconPath": "/images/home1.png"
      },
      {
        "pagePath": "/pages/getApplyMyRoomsMsgs/getApplyMyRoomsMsgs",
        "text": "申请列表",
        "iconPath": "/images/apply.png",
        "selectedIconPath": "/images/apply1.png"
      },
      {
        "pagePath": "/pages/joinedroom/joinedroom",
        "text": "加入房间",
        "iconPath": "/images/icon2.png",
        "selectedIconPath": "/images/icon21.png"
      },
      {
        "pagePath": "/pages/logs/logs",
        "text": "我的",
        "iconPath": "/images/usercenter.png",
        "selectedIconPath": "/images/usercenter1.png"
      }
    ]
  },
  /**
   * 周期函数
   */
  attached:function(){
    console.log("组件初始化完成")

  },
  detached:function(){
    console.log("组件消失")
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }


  }

})