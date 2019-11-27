App({
  /**
   * 监听属性 并执行监听函数
   * params beObservedVal(被监听者),fn(计算回调函数)
   */
  observe(beObservedObj,key,fn){
    let val = beObservedObj[key]; // 设置默认值
    Object.defineProperty(beObservedObj, key,{
      configurable:true,
      enumerable:true,
      set:function(newVal){
        console.log("app.globalData.applyCount被修改为",newVal)
        val = newVal;
        fn&&fn(newVal);
      },
      get:function(){
        return val;
      }
    })
  },
    /**
     *接收申请信息
     */
  receiveApply:function(){
    console.log("开始监听申请消息");
      let that = this;
        // 监听申请信息
        wx.request({
            method:'get',
            url:that.globalData.urlCreated('/message/receiveMessage',that.globalData.userid),
            success(res) {
              console.log(res.data);
              if(res.data.code == 1){
                console.log("接收到申请");
                console.log(res.data.data);
                // 未读消息
                that.globalData.applyCount = res.data.data;
              }

            },
            complete(res){
              console.log("一轮查询结束",res);
              // 隔10秒查一次申请情况
              setTimeout(()=>{
                that.receiveApply();
              },10000);
            }
        })
      } ,
  loginCon: function(res) {
    var that = this;
    // 发起网络请求
    if (res.code) {
      wx.request({
        url: that.globalData.urlCreated("/index/login", that.globalData.userInfo.nickName, res.code),
        method: 'get',
        success: function(res) {
          console.log('登录->后端返回的数据' + JSON.stringify(res.data));
          if (res.data.code === 1) {
            console.log("登录成功");
            // 将userid保存在全局app中
            that.globalData.userid = res.data.data;
            // 开始轮询申请消息
            that.receiveApply();
          }else if(res.data.code === -1){
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
            that.globalData.ifNowAuth = true;
            that.loginCon(res); //将登录信息发送到后台获取openid
            clearInterval(time2); //清除定时器
          }
        }, 0)
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
    timeFormat:{
      /**
       * @params timestamp-时间戳
       * @returns {string} 11:24
       */
      getMS(timestamp){
        let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let h = date.getHours() + ":";
        let m = date.getMinutes();
        console.log(timestamp, h + m );
        return  h + m ;
      },
      /**
       * @params timestamp-时间戳
       * @returns {string} 今天，昨天，更早之前
       */
      getYMD(timestamp){
        let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let nowdate = new Date()
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();
        let nY = nowdate.getFullYear();
        let nM = nowdate.getMonth() + 1;
        let nD = nowdate.getDate();
        // 如果是今天
        if ( nY === Y && nM === M && nD === D){
            return "今天";
        }
        // 如果是昨天
        else if ( nY === Y && nM === M && nD === ( D + 1 ) ){
            return "昨天";
        }
        // 更久之前
        else{
          return "更早之前"
        }

      },
        /**
         * @params timestamp-时间戳
         * @returns {string} 2019-11-10
         */
        getTime(timestamp){
            var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + "-";
            var M =
                (date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1) + "-";
            var D = date.getDate() + " ";

            console.log(timestamp,Y + M + D);
            return Y + M + D ;
        },
      /**
       * @params timetamp-时间戳
       * @return {string} 11-10 13:02
       */
      getMHS(timestamp){
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var M =
            (date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1) + "-";
        var D = date.getDate() + " ";
        let h = date.getHours() + ":";
        let m = date.getMinutes();
        console.log(timestamp,M + D + h + m)
        return M + D + h + m ;

      }

    },
    userInfo: null,
    openid: null,
    userid: null,
    ifNowAuth:false, // 标记用户信息权限
    applyCome:false, // 标记申请消息
    applyCount:0,
    url: '192.168.1.106:8080/diandian'
  }
})