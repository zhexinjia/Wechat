
var app = getApp()
Page({
  data:{
    testing:false,
    SIZE:null,
    buttonText: "点击开始考试",
    score:[],
    result:null, //单选题数组
    multiResult:null, //多选题数组
    tfResult:null, //判断题数组
    score2:[],
    score3:[],
    disButton:false
  },

  onLoad: function(){
    console.log(app.globalData.PERSON_NAME)
    console.log(app.globalData.PHONE_NUM)
    console.log(app.globalData.LOGGED_INFO)
    console.log(app.globalData.TEST_QUALIFY)
  },

  //submit button
  submitButton: function(){
    if (this.data.testing){
      var singleScore = this.sum(this.data.score)
      var multiScore = this.sum(this.data.score2)
      var tfScore = this.sum(this.data.score3)
      var testScore = singleScore+multiScore+tfScore
      this.setData({
        buttonText: "点击开始考试",
        result: null,
        multiResult:null,
        tfResult:null,
        testing: false
      })
      app.globalData.TEST_QUALIFY = "0"
      wx.setStorageSync('qualify', "0")

      console.log("test score: "+ testScore)
      app.updateScore(app.globalData.PHONE_NUM, testScore, null);
      
    }else{
      var that = this
      //FIXME: app.globalData.TEST_QUALIFY == '1' && 
      if (app.globalData.LOGGED_INFO == true) {
        //start test
        //get singleChoice
        this.getQuestions('http://zhexinj.gotoip2.com/getQuestions.php', app.getArray(), function(data){
          that.setData({result:data})
        })
        //get multiple choice
        this.getQuestions('http://zhexinj.gotoip2.com/getMulti.php', app.getArray(), function(data){
          that.setData({multiResult:data})
        })
        //get true/false question
        this.getQuestions('http://zhexinj.gotoip2.com/getTF.php', app.getArray(), function(data){
          that.setData({
            tfResult:data,
            testing: true,
            buttonText: "提 交",
            //disButton: true
            })
        })
        /*
        that.setData({
          testing: true,
          buttonText: "提 交",
          disButton: true
        })
        */

        
      } else {
        app.showModalWindow("未登陆或未获得考试许可","请重新登录获得考试许可")
      }
      
    }
  },

  //radio button
  radioChange:function(e){
    var added = false
    if (this.data.score.length == 0){
      this.data.score.push({ id: e.currentTarget.id, value: e.detail.value })
      added = true
    }else{
      //var added = false
      for (var i = 0; i < this.data.score.length; i++) {
        if (e.currentTarget.id == this.data.score[i].id) {
          console.log("equal")
          this.data.score[i].value = e.detail.value
          added = true
        } else if (i == this.data.score.length-1 && added == false ){
          console.log("not equal")
          added = true
          this.data.score.push({ id: e.currentTarget.id, value: e.detail.value })
        }
      }
    }
  },

  tfChange:function(e){
    var index = e.currentTarget.id
    var value = e.detail.value
    var array = this.data.score3
    console.log(index)
    console.log(value)
    this.addToArray(index, value, array)
  },

  //checkBox button
  checkboxChange:function(e){
    var index = e.currentTarget.id
    //console.log(e)
    console.log(e.detail.value)
    console.log(index)
    var answerArray = this.getArray(index)
    if (this.compareArray(answerArray, e.detail.value)){
      this.addToArray(index, 2, this.data.score2)
    }else{
      this.addToArray(index, 0, this.data.score2)
    }

    
  },

  sum:function(array){
    var x = 0
    for (var i = 0; i< array.length; i++){
      x += parseInt(array[i].value)
    }
    return x
  },

  getQuestions:function(url, array, cb){
    wx.request({
      url: url,
      data: {
        idArray: array
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        cb(res.data)
      }
    })
  },




  //return the answer array for multiple questions
  getArray:function(index){
    for (var i = 0; i < this.data.multiResult.length; i++){
      console.log(this.data.multiResult[i].id)
      if (this.data.multiResult[i].id == index){
        var result = this.data.multiResult[i].result.split(',')
        return result
      }
    }
  },

  //compare two array see if they contains exactlly same items
  compareArray:function(array1, array2){
    //array1 int array, array2 string array
    var length = array1.length
    var counter = 0
    if (array1.length != array2.length){
      return false
    }else{
      for (var i = 0; i < length; i++){
        for (var j = 0; j < length; j++){
          if (array1[i] == array2[j]){
            if (++counter == length){
              return true
            }
          }
        }
      }
    }
    return false
  },

  //add id and scores to array
  addToArray:function(index, value, array){
    var added = false
    if (array.length == 0) {
      array.push({ id: index, value: value })
      added = true
    } else {
      //var added = false
      for (var i = 0; i < array.length; i++) {
        if (index == array[i].id) {
          array[i].value = value
          added = true
        } else if (i == array.length - 1 && added == false) {
          console.log("not equal")
          added = true
          array.push({ id: index, value: value })
        }
      }
    }
  }








  
})