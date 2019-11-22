App({
  loginCon: function(res) {
    var that = this;
    // 发起网络请求
    if (res.code) {
      wx.request({
        url: that.globalData.urlCreated("/index/login", that.globalData.userInfo.nickName, res.code),
        method: 'get',
        /*header: {
          'content-type': 'application/x-www-form-urlencoded'
        },*/
        success: function(res) {
          console.log('登录->后端返回的数据' + JSON.stringify(res.data));
          if (res.data.code === 1) {
            console.log("登录成功");
            //将userid保存在全局app中
            that.globalData.userid = res.data.data;
           // that.sendUserinf(that); //更新用户信息
          }else if(res.data.code===-1){
            console.log("登录失败，失败信息："+res.data.message);
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
    }
  },
  onLaunch: function() {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        var time2 = setInterval(function() {
          if (that.globalData.userInfo) { //如果已经获得了userInfo
            console.log(that.globalData.userInfo);
            that.loginCon(res); //将登录信息发送到后台获取openid
            clearInterval(time2); //清除定时器
          }
        }, 1000)
      }

    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo


              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  sendUserinf: function(that) {
    wx.request({
      url: that.globalData.url + '/User/update',
      data: {
        id: that.globalData.userid,
        nickname: that.globalData.userInfo.nickName,
        sex: that.globalData.userInfo.gender
      },
      success: function(res) {
        console.log('用户个人信息更新成功');
      },
      fail: function() {
        wx.showToast({
          title: '信息更新失败',
          image: '/images/warning.png'
        })
      }
    })
  },
  globalData: {
    //普通http请求url制造器
    urlCreated(params, ...query) {
      let url = `http://${this.url}${params}`;
      for (let i = 0; i < query.length; i++) {
        url += `/${query[i]}`;
      }
      console.log(url);
      return url;
    },
    // ws请求url制造器
    wsUrlCreated(params){
      let url = `ws://${this.url}${params}`;
      console.log(url);
      return url;
    },
    // 处理时间戳为日期
    timeFormat(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();

      console.log(timestamp,Y + M + D + h + m + s);
      return Y + M + D + h + m + s;
    },
    userInfo: null,
    openid: null,
    userid: null,
    userdetails: [],
    url: '192.168.43.232:8080/diandian'
  }
})