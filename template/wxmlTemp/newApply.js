/**
   * 申请提示点击事件
   */
  let temp={
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
    }
  }
  exports.temp = temp
