var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getLocation()//获取经纬度
    
    qqmapsdk = new QQMapWX({
      key: 'NO7BZ-3CT6S-RZ6OA-6FAHG-MHF6Z-QEB5N'
    });
    // this.getUserImg()
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.getTodayList()
  },
  //获取当前位置信息
  getLocation() {
    let _this = this
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.getToLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })

                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          _this.getToLocation()
        } else {
          //调用wx.getLocation的API
          _this.getToLocation()
        }
      }
    })
  },
  // 微信获得经纬度
  getToLocation: function () {
    let _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        _this.getLocal(latitude, longitude)
      },
      fail: function (err) {}
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res)
        let str = res.result.ad_info.city;
        let city = res.result.ad_info.city.slice(0, str.length - 1)
        that.setData({
          city: city,
          ser_type: that.data.ser_type,
          latitude: latitude,
          longitude: longitude
        })
        let cityInfo = {
          city: that.data.city,
          ser_type: that.data.ser_type,
          latitude: latitude,
          longitude: longitude,
        }
        wx.setStorageSync('cityInfo', cityInfo)
        wx.navigateTo({
          url: '../../pages/shopList/shopList?cityInfo=' + JSON.stringify(cityInfo),
        })
      },
      fail: function (res) {},
      complete: function (err) {}
    });
  },
  getUserImg(){
    let That =this
    // encryptedData, iv, login_key
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/login/getUserInfo',
      method:'POST',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success (res) {
        console.log(res.data)
        let list = res.data
        That.setData({
          list
        })
      }
    })
  },
getTodayList(){
  let That =this
  wx.request({
    url: 'https://coachorder.zen-x.com.cn/api/coach/CusToday/', 
    data: {
    },
    header: {
      'content-type': 'application/json' // 默认值
    },
    success (res) {
      console.log(res.data)
      let list = res.data
      That.setData({
        list
      })
    }
  })
},
  //获取输入值
  getInputValue: function (e) {
    let value = e.detail.value
    this.setData({
      inputValue: value,
    })
    this.getList(value)
  },
  //删除输入框值
  cancelInput: function () {
    this.setData({
      inputValue: ''
    })
  },
  getList(value) {
    var data = {
      isCustomer: 1,
      onSale: 1,
      page: 1
    }
    if (value != "" && value != undefined) {
      data.name = value
    } else {
      delete data.name
    }
    var that = this
    wx.request({
      // url: 'https://tybaby.kodin.cn/api/v1/products?isCustomer=1&=1&name='+value+'&page=1', //仅为示例，并非真实的接口地址
      url: 'https://tybaby.kodin.cn/api/v1/products',
      data: data,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data.data

        })
      }
    })
  },
  scan(){
    wx.scanCode({
      success (res) {
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})