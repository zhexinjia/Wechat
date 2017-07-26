//logs.js
var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
  },
  onLoad: function () {

  },

  scanButton: function(){
    if (app.globalData.LOGGED_INFO == true){
      var sss = 123
      app.updateScore(app.globalData.PHONE_NUM, '', "321")
      wx.scanCode({
        success: (res) => {
          console.log("successful scaned")
          console.log(res.result)
          //FIXME: update database after scan
        }
      })
    }else{
      //not logged in, log in first
      app.showModalWindow("提示","扫码前请先登陆")
    }
    
  }
})
