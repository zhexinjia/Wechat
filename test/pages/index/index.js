//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    phone: null,
    password: null,
    phoneText: null,
    pwText: null
  },

  //get name from name input box
  phoneInput: function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  //get phone number from input box
  pwInput: function(e){
    this.setData({
      password: e.detail.value
    })
  },

  registerButton:function(){
    wx.navigateTo({
      url: '../register/register',
    })
  },

  //log in using phone number and name
  loginButton:function(){
    app.requestUserInfo(this.data.phone, this.data.password)
    this.setData({
      phoneText: null,
      pwText: null
    })
  },

  clearCache:function(){
    app.clearCache()
  },

  onLoad: function () {
    //FIXME: verify global data to see if login needed
    console.log('Index onLoad')
    console.log(app.globalData.PERSON_NAME)
    console.log(app.globalData.PHONE_NUM)
    console.log(app.globalData.LOGGED_INFO)
    console.log(app.globalData.TEST_QUALIFY)
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfoCB){
      //更新数据
      that.setData({
        userInfo:userInfoCB
      })
      //console.log(userInfo)
    })
  }

})
