//app.js
App({

  onLaunch: function() {

  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  //update users infomation
  requestUserInfo: function (phone, password) {
    var that = this
    //read mySQL user info through php server, save to cache if match
    wx.request({
      url: 'http://zhexinj.gotoip2.com/getUser.php',
      data: {
        password: password,
        phone: phone
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data != null) {
          var temp = res.data
          that.saveCache(temp.pname, temp.phone, temp.qualifaction, true, temp.major, temp.profession, temp.position, temp.level, temp.testsize)
          that.updateGlobal()
          that.showModalWindow("登陆成功", "")
        } else {
          //FIXME: change to popup
          that.showModalWindow("登陆失败", "手机号码或密码错误")
        }
      }
    })
  },
  
  globalData: {
    userInfo: null,
    PERSON_NAME: wx.getStorageSync('name'),
    PHONE_NUM: wx.getStorageSync('phone'),
    PERSON_PASSWORD: wx.getStorageSync('password'),
    
    MAJOR: wx.getStorageSync('major'),
    PROFESSION: wx.getStorageSync('profession'),
    POSITION: wx.getStorageSync('position'),
    LEVEL: wx.getStorageSync('level'),
    TESTSIZE: wx.getStorageSync('testsize'),
    //string, '1' = qualify, '0'=not qualify
    TEST_QUALIFY: wx.getStorageSync('qualify'),
    //logged = true, not logged = false
    LOGGED_INFO: wx.getStorageSync('logged')
  },

  saveCache:function(name, phone, qualify, logged, major, profession, position, level, testsize){
    wx.setStorageSync('name', name)
    wx.setStorageSync('phone', phone)
    wx.setStorageSync('qualify', qualify)
    wx.setStorageSync('logged', logged)

    wx.setStorageSync('major', major)
    wx.setStorageSync('profession', profession)
    wx.setStorageSync('position', position)
    wx.setStorageSync('level', level)
    wx.setStorageSync('testsize', testsize)
  },

  updateGlobal:function(){
    this.globalData.PERSON_NAME = wx.getStorageSync('name'),
    this.globalData.PHONE_NUM = wx.getStorageSync('phone'),
    this.globalData.TEST_QUALIFY= wx.getStorageSync('qualify'),
    this.globalData.LOGGED_INFO= wx.getStorageSync('logged'),
    
    this.globalData.MAJOR = wx.getStorageSync('major'),
    this.globalData.PROFESSION = wx.getStorageSync('profession'),
    this.globalData.POSITION = wx.getStorageSync('position'),
    this.globalData.LEVEL = wx.getStorageSync('level'),
    this.globalData.TESTSIZE = wx.getStorageSync('testsize')
  },

  clearCache:function(){
    try {
      wx.clearStorageSync()
      console.log("清理缓存")
      this.updateGlobal()
    } catch (e) {
      // Do something when catch error
    }
  },

  getArray:function(){
    var array = this.createArray()
    var result = new Array()
    while (array.length != 0){
      var tempIndex = Math.floor(Math.random() * array.length)
      var tempValue = array[tempIndex]
      array[tempIndex] = array[array.length-1]
      array[array.length-1] = tempValue
      result.push(array.pop())
    }
    return result  
  },

  createArray:function(){
    var size = 10
    var array = new Array()
    for (var i = 1; i < size+1; i++) {
      array.push(i)
    }
    return array
  },

  showModalWindow:function(title, content){
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          if (title == '登陆成功'){
            wx.switchTab({
              url: '../scan/scan',
            })
          }else{
            wx.switchTab({
              url: '../index/index'
            })
          }
          
        }
      }
    })
  },

  updateScore:function(phone, currentScore, qrCode){
    wx.request({
      url: 'http://zhexinj.gotoip2.com/updateScore.php',
      data: {
        code:qrCode,
        currentScore:currentScore,
        phone:phone
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data != null) {
          console.log(res)
        } else {
          //FIXME: change to popup
          that.showModalWindow("上传失败", "手机号码或密码错误")
          
        }
      }
    })
  }

  
})
