Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    list: [],
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    list: [],
    page: 1,
    size: 20,
    totalPeges: 1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getList() {
    let that = this;
    let page = that.data.page;
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/CusBefore/',
      data: {
        page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          list: [...that.data.list, ...res.data.result]
        })
        console.log(that.data.list)
      }
    })
  },
  keywordQuery(value) {//根据keyword搜索
    let That = this
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/getCustomer/',
      data: {
        keyword:value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        let list = res.data.results
        That.setData({
          list
        })
        console.log(That.data.list)
      }
    })
  },
  //获取输入值
  getInputValue: function (e) {
    let value = e.detail.value
    this.setData({
      inputValue: value,
    })
    this.keywordQuery(value)
  },
  //删除输入框值
  cancelInput: function () {
    this.setData({
      inputValue: ''
    })
  },
  scan() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    console.log(e)
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (e) {
    console.log(e)
    // 显示导航栏loading  
    wx.showNavigationBarLoading();
    // 调用接口加载数据  
    this.setData({
      page: 0,
      list: []
    })
    this.getList();
    // 隐藏导航栏loading  
    wx.hideNavigationBarLoading();
    // 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新  
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    console.log("下拉")
    let that = this;
    let page = that.data.page;
    let totalPages = that.data.totalPages;
    //当前页大于总页数
    if (page >= totalPages) {
      wx.showToast({
        title: '没有下一页数据了',
      })
    } else {
      that.setData({
        page: that.data.page + 1, // 每次触发上拉事件，把pageNum+1
      });
      that.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})