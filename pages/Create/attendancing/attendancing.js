// pages/Create/attendancing/attendancing.js
const app = getApp();
let sendTime = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        itemId: null,
        itemStatus: null,
        hiddenmodalput: true,
        hiddens: true,
        lateTime: 30, // 迟到时间
        changeButtonview: true,
        roominf: null,
        socketOpen: false,
        roomid: null,
        freshJoinedUser: null,
        checkingTime: null,
        roomdetail: null,
        userdetails: null,
        attendance: '持续考勤中',
        signed: 0,
        nullSign: 0,
        listNum: 0,
        buttonColor_1: '#f36838',
        fontColor_1: 'white',
        buttonStatus_1: true,
        buttonColor: 'white',
        fontColor: '#f36838',
        buttonStatus: false,
        signedOrnullSignStu: null,
        signedStu: [],
        nullSignStu: [],
        hideModal: true, //模态框的状态  true-隐藏  false-显示
        animationData: {},
        items: [
            {name: '到达', value: '1'},
            {name: '迟到', value: '2'},
            {name: '请假', value: '3'},
            {name: '旷课', value: '4'}
        ]
    },
    /**
     * 点击已签到按钮
     */
    chooseSigned: function () {
        //如果已签按钮为未选中状态
        if (this.data.buttonStatus === false) {
            this.setData({
                buttonColor: '#f36838',
                fontColor: 'white',
                buttonStatus: true,
                buttonColor_1: 'white',
                fontColor_1: '#f36838',
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
    chooseNullSign: function () {
        //如果未签按钮为未选状态
        if (this.data.buttonStatus_1 === false) {
            this.setData({
                buttonColor_1: '#f36838',
                fontColor_1: 'white',
                buttonStatus_1: true,
                buttonColor: 'white',
                fontColor: '#f36838',
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
    /*backing: function() {
     wx.showModal({
       title: '提醒',
       content: '取消本次考勤？',
       success(res) {
         if (res.confirm) {
           wx.reLaunch({
             url: '/pages/myroom/myroom'
           })
         }
       }
     })

    },
    */

    /**
     * 点击结束按钮
     */
    overing: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否结束考勤？',
            success: function (res) {
                //如果点击了确认
                if (res.confirm) {
                    //停止发送位置信息
                    clearInterval(sendTime);
                    console.log('停止发送位置信息')
                    //结束考勤
                    let data = {
                        type: 'end'
                    }
                    //end信息发送到服务端请求结束
                    that.sendSocketMessage(data);
                }
            }
        })
    },
    /**
     * 单选框改变事件
     * @param e
     *
     */
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        // 当前显示的item的id
        let id = this.data.itemId;
        if (e.detail.value == "到达") {
            this.forArrive(id)
        } else if (e.detail.value == "迟到") {
            this.forLate(id)
        } else if (e.detail.value == "请假") {
            this.forLeave(id)
        } else if (e.detail.value == "旷课") {
            this.forAbsent(id)
        }


    },
    /**
     * 遍历lists修改默认选项
     */
    changeRadioOptions: function (opt) {
        let lists = this.data.items;
        for (let item of lists) {
            if (item.value == opt) {
                item.checked = 'true';
            } else {
                item.checked = '';
            }
        }

        this.setData({
            items: lists
        })
        console.log(this.data.items)
    },
    /**
     * 手动修改学生考勤状态
     */
    changeStatus: function (e) {
        // 当前点击的学生信息
        let stuinf = e.currentTarget.dataset.stuinf;
        this.setData({
            itemId: stuinf.id,
            itemStatus: stuinf.status
        })
        console.log("当前学生id：", this.data.itemId)
        console.log("当前学生status：", this.data.itemStatus)
        let status = this.data.itemStatus;
        // 修改当前lists中的默认选项
        this.changeRadioOptions(status)

        // 显示显示遮罩层
        this.showModal();


    },
    /**
     *修改学生考勤状态
     */
    changeStuStatus: function (stuid, status) {
        wx.showLoading({
            title: '修改中',
        });
        let data = {
            type: 'status',
            status: status,
            studentId: stuid
        }
        wx.showLoading({
            title: '修改中'
        });
        this.sendSocketMessage(data);
    },
    /**
     * 修改为到达
     */
    forArrive: function (stuid) {
        this.changeStuStatus(stuid, 1);
    },
    /**
     *修改为迟到
     */
    forLate: function (stuid) {
        this.changeStuStatus(stuid, 2);
    },
    /**
     *修改为请假
     */
    forLeave: function (stuid) {
        this.changeStuStatus(stuid, 3);
    },
    /**
     *修改为旷课
     */
    forAbsent: function (stuid) {
        this.changeStuStatus(stuid, 4);
    },
    // 显示遮罩层
    showModal: function () {
        var that = this;
        that.setData({
            hideModal: false
        })
        var animation = wx.createAnimation({
            duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease',//动画的效果 默认值是linear
        })
        this.animation = animation
        setTimeout(function () {
            that.fadeIn();//调用显示动画
        }, 200)
    },

    // 隐藏遮罩层
    hideModal: function () {
        var that = this;
        var animation = wx.createAnimation({
            duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease',//动画的效果 默认值是linear
        })
        this.animation = animation
        that.fadeDown();//调用隐藏动画
        setTimeout(function () {
            that.setData({
                hideModal: true
            })
        }, 720)//先执行下滑动画，再隐藏模块

    },

    //动画集
    fadeIn: function () {
        this.animation.translateY(0).step()
        this.setData({
            animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
        })
    },
    fadeDown: function () {
        this.animation.translateY(300).step()
        this.setData({
            animationData: this.animation.export(),
        })
    },
    /**
     * 变为签到，列表改变
     */
    signChange: function (that, jsonRes) {
        // 未签到的学生列表
        let studentList = that.data.nullSignStu;
        for (let index1 in studentList) {
            if (studentList[index1].id === jsonRes.studentId) {
                // 改变此学生的考勤状态和时间
                studentList[index1].status = jsonRes.data
                studentList[index1].attTime = app.globalData.timeFormat.getMHS(jsonRes.attTime)
                // 将此学生加入已签到列表
                let stulist = that.data.signedStu;
                stulist.push(studentList[index1])
                that.setData({
                    signedStu: stulist,
                })
                //在未签到学生列表中移除此学生
                studentList.splice(index1, 1);
                that.setData({
                    nullSignStu: studentList
                })
                that.setData({
                    signedOrnullSignStu: that.data.signedStu,
                    buttonColor: '#da7c0c',
                    fontColor: 'white',
                    buttonStatus: true,
                    buttonColor_1: 'white',
                    fontColor_1: '#da7c0c',
                    buttonStatus_1: false,
                    nullSign: that.data.nullSign - 1,
                    signed: that.data.signed + 1
                })
                break;
            }
        }
        // 已签到学生列表
        let studentList2 = that.data.signedStu;
        for (let index2 in studentList2) {
            if (studentList2[index2].id === jsonRes.studentId) {
                // 将其状态和时间改变
                studentList2[index2].status = jsonRes.data;
                studentList2[index2].attTime = app.globalData.timeFormat.getMHS(jsonRes.attTime)
                that.setData({
                    signedStu: studentList2,
                    signedOrnullSignStu: that.data.signedStu
                })
                break;
            }
        }
    },
    /**
     * 变为未签到，列表改变
     */
    nullSignChange: function (that, jsonRes) {
        //已签到学生列表
        let studentList = that.data.signedStu;
        for (let index1 in studentList) {
            if (studentList[index1].id === jsonRes.studentId) {
                // 改变此学生的考勤状态和时间
                studentList[index1].status = jsonRes.data
                studentList[index1].attTime = app.globalData.timeFormat.getMHS(jsonRes.attTime)
                //将此学生加入未签到列表
                let nullstulist = that.data.nullSignStu;
                nullstulist.push(studentList[index1])
                that.setData({
                    nullSignedStu: nullstulist,
                })
                //在签到学生列表中移除此学生
                studentList.splice(index1, 1);
                that.setData({
                    stulist: studentList
                })
                that.setData({
                    signedOrnullSignStu: that.data.nullSignStu,
                    buttonColor_1: '#da7c0c',
                    fontColor_1: 'white',
                    buttonStatus_1: true,
                    buttonColor: 'white',
                    fontColor: '#da7c0c',
                    buttonStatus: false,
                    nullSign: that.data.nullSign + 1,
                    signed: that.data.signed - 1
                })
                break;
            }
        }

        // 未签到学生列表
        let studentList2 = that.data.nullSignStu;
        for (let index2 in studentList2) {
            if (studentList2[index2].id === jsonRes.studentId) {
                // 将其状态和时间改变
                studentList2[index2].status = jsonRes.data;
                studentList2[index2].attTime = app.globalData.timeFormat.getMHS(jsonRes.attTime)
                that.setData({
                    nullSignStu: studentList2,
                    signedOrnullSignStu: that.data.nullSignStu
                })
                break;
            }
        }


    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        let that = this;
        console.log("房间inf:", options.roominf);
        this.setData({
            roominf: JSON.parse(options.roominf)
        })
        // 设置迟到时间
        wx.showModal({
            title: "迟到时间",
            content: "是否需要设置迟到时间？",
            cancelText: "不用了",
            success(res) {
                if (res.confirm) {
                    console.log("用户点击了确认");
                    // 弹框输入迟到时间
                    that.setData({
                        hiddenmodalput: false
                    })


                } else if (res.cancel) {
                    console.log("用户点击了取消");
                    //给服务端发送考勤初始数据
                    let data = {
                        type: 'start',
                        data: that.data.roominf.id,
                    }
                    // 进行socket连接
                    that.socketConnection(data);
                }


            },


        })


    },

    /**
     * 表单输入事件
     *
     */
    formLateTime: function (e) {
        console.log("改变lateTime:", e.detail.value)
        if (typeof e.detail.value === "number") {
            this.setData({
                lateTime: e.detail.value
            })
        }

    },
    /**
     * model确认事件
     *
     */
    confirm: function () {
        // 获取迟到时间
        let lateTime = this.data.lateTime;
        console.log("设置的迟到时间为：", lateTime)
        if (typeof lateTime === "number") {
            // 进行socket连接
            this.socketConnection();
            // 隐藏model
            this.setData({
                hiddenmodalput: true
            })
            //给服务端发送考勤初始数据
            let data = {
                type: 'start',
                data: this.data.roominf.id,
                lateTime: this.data.lateTime
            }
            // socket连接
            this.socketConnection(data);
        } else {
            wx.showToast({
                title: "时间不合法",
                image: "/images/warning.png"
            })
        }

    },
    /**
     * model取消事件
     *
     */
    cancel: function () {
        this.setData({
            hiddenmodalput: true
        });
        //给服务端发送考勤初始数据
        let data = {
            type: 'start',
            data: this.data.roominf.id,
            lateTime: this.data.lateTime
        }
        // socket连接
        this.socketConnection(data);
    },
    /**
     * socket连接
     */
    socketConnection: function (startData) {

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
            wx.onSocketError(function (res) {
                that.setData({
                    socketOpen: false
                })
                console.log('WebSocket连接打开失败，请检查！');
                wx.hideToast();
            })

            //监听WebSocket连接打开事件。
            wx.onSocketOpen(function (res) {
                //如果连接成功，将socketOpen设置为true
                that.setData({
                    socketOpen: true
                })
                console.log('WebSocket连接已打开！');
                wx.hideToast();


                //发送开始考勤
                that.sendSocketMessage(startData);

            })

            //监听WebSocket接受到服务器的消息事件
            wx.onSocketMessage(function (res) {
                wx.hideLoading();
                console.log('收到服务器内容：', res.data);
                //将json字符串转为js对象
                let jsonRes = JSON.parse(res.data);
                /*******************监听考勤开始******************************/
                if (jsonRes.type === 'start') {
                    // 若没成功
                    if (jsonRes.status === 0) {
                        console.log('考勤未能成功');
                        wx.showToast({
                            title: '出错拉',
                            images: "/pages/warning.png"
                        })


                        // 若成功了
                    } else if (jsonRes.status === 1) {
                        // 设置初始状态都为0（未签）
                        for (let item of jsonRes.data) {
                            item.status = 0;
                        }
                        console.log("初始化后的学生列表：", jsonRes.data)
                        // 将学生列表存入data中
                        that.setData({
                            nullSignStu: jsonRes.data,
                            signedOrnullSignStu: jsonRes.data,
                            listNum: jsonRes.data.length,
                            nullSign: jsonRes.data.length
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
                            that.signChange(that, jsonRes);
                        }
                        //学生状态变为迟到、旷课（2）（4）
                        else if (jsonRes.data === 4) {
                            that.nullSignChange(that, jsonRes);
                        }
                    } else {
                        console.log('学生签到失败')
                    }
                }
                if (jsonRes.type === 'location' && jsonRes.status === 0) {
                    //若位置信息为null
                    console.log('位置信息为null');
                }
                /*******************监听考勤结束******************************/
                if (jsonRes.type === 'end') {
                    //如果考勤结束成功
                    if (jsonRes.status === 1) {
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
                            url: '/pages/myroom/myroom'
                        })
                    } else {
                        console.log('考勤结束失败')
                    }
                }
            })
            //监听WebSocket关闭
            wx.onSocketClose(function (res) {
                that.setData({
                    socketOpen: false
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
    sendSocketMessage: function (msg) {
        if (this.data.socketOpen) {
            //通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
            console.log('向服务端发送:', msg)
            wx.sendSocketMessage({
                data: JSON.stringify(msg)
            })
        }
    },
    /**
     * 发送教师的定位
     */
    sendLocation: function () {
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
            success(res) {
                const latitude = res.latitude
                const longitude = res.longitude
                //发送到服务端的老师位置数据
                let locationData = {
                    type: 'location',
                    latitude: latitude,
                    longitude: longitude
                }
                //设置计时器发送位置信息
                sendTime = setInterval(() => {
                    //向服务端发送位置信息
                    that.sendSocketMessage(locationData);
                }, 5000)

            }
        })

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        var that = this;
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