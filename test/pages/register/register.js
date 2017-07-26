// pages/register/register.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    major:['医疗','护理','医技','药学'],
    majorIndex: 4,
    level: ['N0', 'N1', 'N2', 'N3', 'N4', 'N5'],
    levelIndex: 6,
    levelDisable: false,
    profession: ['初级职称','中级职称','副高级职称','正高级职称'],
    professionIndex: 4,
    //may add more positions depends on major
    positionIndex: 4,
    position: null,
    position_one: ['无','总住院医师','副主任','主任'],
    position_two: ['无','副护士长','护士长','科护长','护理部副主任','护理部主任'],

    //person data entry
    name_s: '',
    phone_s:'',
    password_s:'',
    password1_s:'',
    major_s:'',
    level_s:'',
    profession_s:'',
    position_s:'',
  },

  onLoad: function (options) {
  
  },

  onReady: function () {
  
  },

  onShow: function () {
  
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  },

  nameInput:function(e){
    this.setData({
      name_s:e.detail.value
    })
  },

  phoneInput:function(e){
    this.setData({
      phone_s: e.detail.value
    })
  },

  pwInput: function (e) {
    this.setData({
      password_s: e.detail.value
    })
  },

  pwReInput: function (e) {
    this.setData({
      password2_s: e.detail.value
    })
    console.log(e.detail.value)
  },


  majorPicker:function(e){
    if(e.detail.value != 1){
      this.setData({
        levelIndex: 6,
        levelDisable: true,
        majorIndex: e.detail.value,
        major_s: this.data.major[e.detail.value],
        position: this.data.position_one,
      })
    }else{
      this.setData({
        levelDisable: false,
        majorIndex: e.detail.value,
        major_s: this.data.major[e.detail.value],
        position: this.data.position_two,
      })
    }
  },
  levelPicker:function(e){
    this.setData({
      levelIndex: e.detail.value,
      level_s: this.data.level[e.detail.value]
    })
  },
  professionPicker:function(e){
    this.setData({
      professionIndex: e.detail.value,
      profession_s:this.data.profession[e.detail.value]
    })
  },
  positionPicker:function(e){
    this.setData({
      positionIndex: e.detail.value,
      position_s:this.data.position[e.detail.value]
    })
  },

  registerButton:function(){
    if (this.passwordCheck() && this.entryCheck()){
      this.registerCallBack()
      
    }
  },

  //check if two password match
  passwordCheck:function(){
    if (this.data.password_s.length > 5){
      if (this.data.password_s == this.data.password2_s){
        return true
      }
    }else{
      this.showDialog("密码错误", "确认密码必须和密码一致")
      //password have to be at least 6
    }
    //password doesn't match
    this.showDialog("密码错误", "密码至少为6位数")
    
    return false
  },

  //entry check
  entryCheck:function(){
    if (this.data.name_s.length==0){
      this.showDialog("姓名不能为空","请填写姓名")
      return false
    }
    if (this.data.phone_s.length==0){
      this.showDialog("电话不能为空","请填写在医院登记的电话号码")
      return false
    }
    if (this.data.major_s.length==0){
      this.showDialog("专业不能为空","请填写专业")
      return false
    }
    if (this.data.position_s.length==0){
      this.showDialog("职务不能为空","请填写职务")
      return false
    }
    if (this.data.profession_s.length==0){
      this.showDialog("职称不能为空","请填写职称")
      return false
    }
    return true
  },

  registerCallBack:function(){
    var that = this
    wx.request({
      url: 'http://zhexinj.gotoip2.com/register.php',
      data: {
        name: this.data.name_s,
        phone: this.data.phone_s,
        password: this.data.password_s,
        major: this.data.major_s,
        level: this.data.level_s,
        profession: this.data.profession_s,
        position: this.data.position_s
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data == "注册成功"){
          that.showDialog(res.data, "返回登陆")
        }else{
          that.showDialog(res.data, "")
        }
      }
    })
  },

  showDialog:function(title, content){
    wx.showModal({
      title: title,
      content: content,
      success: function (res) {
        if (res.confirm) {
          if(title == "注册成功"){
            wx.navigateBack({
            })
          }
        }
      }
    }) 
  },




})