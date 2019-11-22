// pages/Create/attendancing/attendancing.js
const app = getApp();
let sendTime=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddens: true,
    changeButtonview:true,
    roominf:null,
    socketOpen:false,
    roomid: null,
    freshJoinedUser: null,
    checkingTime: null,
    roomdetail: null,
    userdetails: null,
    attendance: '持续考勤中',
    signed:0,
    nullSign:0,
    listNum:0,
    buttonColor_1:'green',
    fontColor_1: 'white',
    buttonStatus_1:true,
    buttonColor:'white',
    fontColor: 'green',
    buttonStatus: false,
    signedOrnullSignStu:null,
    signedStu:[],
    nullSignStu:[],
  },
  /**
   * 点击已签到按钮
   */
  chooseSigned:function(){
    //如果已签按钮为未选中状态
    if (this.data.buttonStatus === false){
      this.setData({
        buttonColor:'green',
        fontColor:'white',
        buttonStatus:true,
        buttonColor_1: 'white',
        fontColor_1: 'green',
        buttonStatus_1: false,
      })
    }
    //将页面数据转为已签到学生列表
    this.setData({
      signedOrnullSignStu: this.data.signedStu
    })
   
  },
    /**
     * 点击未签到按钮
     */
  chooseNullSign:function(){
     //如果未签按钮为未选状态
     if (this.data.buttonStatus_1 === false){
       this.setData({
         buttonColor_1: 'green',
         fontColor_1: 'white',
         buttonStatus_1: true,
         buttonColor: 'white',
         fontColor: 'green',
         buttonStatus: false,
       })
     }
     //将页面数据转为未签到学生列表
     this.setData({
       signedOrnullSignStu: this.data.nullSignStu
     })
  },
  /**
   * 点击返回按钮
   */
  backing: function() {
    wx.redirectTo({
      url:'/pages/Create/gocreatedroom/gocreatedroom?roominf=' + JSON.stringify(this.data.roominf)
    })

  },
  /**
   * 点击结束按钮
   */
  overing:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否结束考勤？',
      success: function(res) {
        //如果点击了确认
        if (res.confirm) {
          //停止发送位置信息
          clearInterval(sendTime);
          console.log('停止发送位置信息')
          //结束考勤
          let data={
            type:'end'
          }
          //end信息发送到服务端请求结束
          that.sendSocketMessage(data);


        }
      }
    })
  },
  /**
   * 手动修改学生考勤状态
   */
  changeStatus:function(){
    let that=this;
    //显示四个状态button
    this.setData({
      changeButtonview:false
    })

  },
  /**
   *修改学生考勤状态
   */
  changeStuStatus:function(stuid,status){
    wx.showLoading({
      title:'修改中',
    });
    let data={
      type:'status',
      status:status,
      studentId: stuid
    }
    wx.showLoading({
      title:'修改中'
    });
    this.sendSocketMessage(data);
  },
  /**
   * 修改为到达
   */
  forArrive:function(e){
    let stuid=e.currentTarget.dataset.stuid;
    this.changeStuStatus(stuid,1);
  },
  /**
   *修改为迟到
   */
  forLate:function(e){
    let stuid=e.currentTarget.dataset.stuid;
    this.changeStuStatus(stuid,2);
  },
  /**
   *修改为请假
   */
  forLeave:function(e){
    let stuid=e.currentTarget.dataset.stuid;
    this.changeStuStatus(stuid,3);
  },
  /**
   *修改为旷课
   */
  forAbsent:function(e){
    let stuid=e.currentTarget.dataset.stuid;
    this.changeStuStatus(stuid,4);
  },
  /**
   * 变为签到，列表改变
   */
  signChange:function(that,jsonRes){
    let studentList = that.data.nullSignStu;
    for (let index1 in studentList) {
      console.log(studentList[index1]);

      if (studentList[index1].id === jsonRes.studentId) {
        //将此学生加入已签到列表
        let stulist = that.data.signedStu;
        stulist.push(studentList[index1])
        that.setData({
          signedStu: stulist,
          changeButtonview: true  //隐藏改变按钮
        })
        //在未签到学生列表中移除此学生
        studentList.splice(index1, 1);
        that.setData({
          nullSignStu: studentList
        })
        that.setData({
          signedOrnullSignStu: that.data.signedStu,
          buttonColor: 'green',
          fontColor: 'white',
          buttonStatus: true,
          buttonColor_1: 'white',
          fontColor_1: 'green',
          buttonStatus_1: false,
          nullSign:that.data.nullSign - 1,
          signed:that.data.signed + 1
        })

      }
    }
  },
  /**
   * 变为未签到，列表改变
   */
  nullSignChange:function(that,jsonRes){
    let studentList = that.data.signedStu;  //已签到学生列表
    for (let index1 in studentList) {
      if (studentList[index1].id === jsonRes.studentId) {
        //将此学生加入未签到列表
        let nullstulist = that.data.nullSignStu;
        nullstulist.push(studentList[index1])
        that.setData({
          nullSignedStu: nullstulist,
          changeButtonview: true   //隐藏改变按钮
        })
        //在签到学生列表中移除此学生
        studentList.splice(index1, 1);
        that.setData({
          stulist: studentList
        })
        that.setData({
          signedOrnullSignStu: that.data.nullSignStu,
          buttonColor_1: 'green',
          fontColor_1: 'white',
          buttonStatus_1: true,
          buttonColor: 'white',
          fontColor: 'green',
          buttonStatus: false,
          nullSign:that.data.nullSign + 1,
          signed:that.data.signed - 1
        })

      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    var that = this;
    console.log("房间inf:" , options.roominf);
    this.setData({
      roominf: JSON.parse(options.roominf)
    })

    //进行socket连接
    this.socketConnection();

  },
  /**
   * socket连接
   */
  socketConnection: function() {

    var that = this;
    var remindTitle = this.data.socketOpen ? '正在关闭' : '正在连接';
    wx.showToast({
      title: remindTitle,
      icon: 'loading',
      duration: 10000
    })
    if (!this.data.socketOpen) {
      //创建一个 WebSocket 连接；
      //一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
      wx.connectSocket({
        url: app.globalData.wsUrlCreated('/attendance/single/teacher')
      })
      //监听WebSocket错误
      wx.onSocketError(function(res) {
        that.setData({
          socketOpen:false
        })
        console.log('WebSocket连接打开失败，请检查！');
        wx.hideToast();
      })
      //监听WebSocket连接打开事件。
      wx.onSocketOpen(function(res) {
        //如果连接成功，将socketOpen设置为true
        that.setData({
          socketOpen:true
        })
        console.log('WebSocket连接已打开！');
        wx.hideToast();
        //给服务端发送考勤初始数据
        let data = {
          type: 'start',
          data: that.data.roominf.id,
        }
        //发送开始考勤
        that.sendSocketMessage(data);

      })
      //监听WebSocket接受到服务器的消息事件
      wx.onSocketMessage(function(res) {
        wx.hideLoading();
        console.log('收到服务器内容：' , res.data);
        //将json字符串转为js对象
        let jsonRes=JSON.parse(res.data);
        /*******************监听考勤开始******************************/
        if (jsonRes.type === 'start') {
          //若没成功
          if (jsonRes.status === 0) {
            console.log('考勤未能成功');


            //若成功了
          } else if (jsonRes.status === 1) {
            //将学生列表存入data中
            that.setData({
              nullSignStu:jsonRes.data,
              signedOrnullSignStu:jsonRes.data,
              listNum:jsonRes.data.length,
              nullSign:jsonRes.data.length
            })

            //教师端开始发送自己的定位
            that.sendLocation();
          }
        }
        /*******************监听学生签到******************************/
        if (jsonRes.type === 'status') {
          if (jsonRes.status === 1) {//若签到成功
            //学生状态变为到达、请假（1）（3）
            if (jsonRes.data === 1 || jsonRes.data === 2 || jsonRes.data === 3) {
              that.signChange(that,jsonRes);
            }
            //学生状态变为迟到、旷课（2）（4）
            else if (jsonRes.data === 4) {
              that.nullSignChange(that,jsonRes);
            }
          }else{
            console.log('学生签到失败')
          }
        }
        if(jsonRes.type === 'location'&&jsonRes.status === 0){
          //若位置信息为null
             console.log('位置信息为null');
        }
        /*******************监听考勤结束******************************/
        if(jsonRes.type === 'end'){
          //如果考勤结束成功
             if (jsonRes.status === 1){
               console.log('考勤结束成功');
               //断开socket连接
               //关闭WebSocket连接。
               wx.closeSocket((res) => {
                 //如果成功关闭
                 if (jsonRes.status == "success") {
                   wx.showToast({
                     title: '成功结束',
                   })
                 } else if (jsonRes.status == "error") {
                   wx.showToast({
                     title: '遇到error',
                   })
                 }
               });
               //返回到房间信息页面
               wx.reLaunch({
                 url:'/pages/myroom/myroom'
               })
             }else{
               console.log('考勤结束失败')
             }
        }
      })
      //监听WebSocket关闭
      wx.onSocketClose(function(res) {
        that.setData({
          socketOpen:false
        })
        console.log('WebSocket 已关闭！');
        wx.hideToast();
      })
    } else {
      //关闭WebSocket连接。
      wx.closeSocket((res) => {
        //如果成功关闭
        if (res.status === "success") {
          wx.showToast({
            title: '成功结束',
          })
        } else if (res.status === "error") {
          wx.showToast({
            title: '遇到error',
          })
        }
      });
    }

  },
  /**
   *  通过socket给服务器发消息
   */
  sendSocketMessage: function(msg) {
    if (this.data.socketOpen) {
      //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
      console.log('向服务端发送:',msg)
      wx.sendSocketMessage({
        data:JSON.stringify(msg)
      })
    }
  },
  /**
   * 发送教师的定位
   */
  sendLocation: function() {
    let that = this;
 /*   //开启后台定位
    wx.startLocationUpdateBackground({
      success(res){
        console.log('开启后台定位',res);
        //监听位置的改变
        wx.onLocationChange((res)=>{
           let latitude=res.latitude;  //纬度
           let longitude=res.longitude;  //经度
           //发送到服务端的老师位置数据
           let locationData={
             type:'location',
             latitude:latitude,
             longitude:longitude
           }
           //向服务端发送位置信息
           that.sendSocketMessage(locationData)
            })
        },
      fail(res){console.log('开启后台定位失败',res)}
    });  */
    //前台开启定位
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: "true",
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        //发送到服务端的老师位置数据
        let locationData={
          type:'location',
          latitude:latitude,
          longitude:longitude
        }
        //设置计时器发送位置信息
        sendTime=setInterval(()=>{
          //向服务端发送位置信息
          that.sendSocketMessage(locationData);
        },5000)

      }
    })
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
    /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that=this;
    //监听位置的改变
 /*   wx.onLocationChange((res) => {
      var latitude = res.latitude;  //纬度
      var longitude = res.longitude;  //经度
      //发送到服务端的老师位置数据
      var locationData = {
        type: 'location',
        latitude: latitude,
        longitude: longitude
      }
      //向服务端发送位置信息
      that.sendSocketMessage(locationData)
    })*/
  },
})