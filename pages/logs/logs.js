let temp = require('../../template/wxmlTemp/newApply.js');
const app = getApp();
var base1 = "/images/关于.png";
Page({
  data: {
    ifAuth:false,
    motto: 'Hello World',
    userInfo: null,
    icon: '',


  },
    /**
     * 单选框改变事件
     * @param e
     *
     */
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },

    testAdd(){
        app.globalData.applyCount++;
    },
  onLoad: function() {
  
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
          this.setData({
              userInfo:app.globalData.userInfo
          })
      }

  },
    onShow(){
        let that =this;
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 3,
            messageCount:app.globalData.applyCount
        })
          // 设置被监听对象和计算属性
          app.observe(app.globalData,"applyCount",(newVal)=>{
              this.getTabBar().setData({
                  messageCount:newVal
              })
          })
        }
        if (app.globalData.ifNowAuth){
            this.setData({
                userInfo:app.globalData.userInfo
            })
            wx.getSetting({
                success(res){
                    //如果用户之前拒绝位置授权
                    if (res.authSetting['scope.userLocation'] == false) {
                        that.setData({
                            ifAuth:false
                        })
                    }else{
                        that.setData({
                            ifAuth:true
                        })
                    }
                }

            })
            }
    },
    /**
     * 授权按钮
     *
     */
  tapToAuthorize: function(){
      let that = this;
        //再授权
        wx.openSetting({
            success: (res) => {
                /*
                 * res.authSetting = {
                 *   "scope.userInfo": true,
                 *   "scope.userLocation": true
                 * }
                 */
                //因为openSetting会返回用户当前设置
                if (res.authSetting["scope.userLocation"]===true){
                    that.setData({
                        ifAuth:true
                    })
                    wx.showToast({
                        title:"授权成功"
                    })
                }
                else if(res.authSetting["scope.userLocation"] === false){
                    wx.showModal({
                        title: '用户未授权',
                        content: '如需正常使用小程序，请点击授权按钮，选择位置信息并勾选。',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            }
                        }
                    })
                }
            },
            fail(err) {
                console.log("打开设置页失败，",err)
            }
        })
    },






})