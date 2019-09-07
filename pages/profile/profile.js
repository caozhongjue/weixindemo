
//logs.js
//获取应用实例
//const app = getApp()
var app = getApp();
Page({
  data: {
    motto: '按钮',
    userInfo: {},
    imagesrc: '/images/0.png',
    textattr: '获取头像昵称',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //在小程序界面那里点击登录，调用此方法
  getMyInfo: function (e) {
    var that = this;
    //使用
    //console.log(e)
    this.getUserInfo()
    //第一次打开微信小程序，授权录，查看是否授权
    wx.getSetting({
      success: res => {
        // 用户点击登录
        if (res.authSetting['scope.userInfo']) {
          //调用登录方法获取code
          wx.login({
            success: function (res) {
              var code = res.code;//登录凭证code
              //console.log(code)
              if (code) {
                //2、弹框后，点允许，调用获取用户信息方法
                wx.getUserInfo({
                  success: function (res) {
                    //3、调用我的服务器api，向数据库保存数据
                    wx.request({
                      url: app.globalData.url+'login',//自己的服务接口地址
                      method: 'post',
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                      success: function (data) {
                        console.log(data)
                        var token = JSON.stringify(data.data.token)
                        console.log(token)
                        wx.setStorageSync("token", token)
                        var wxuser = wx.getStorageSync("token")
                        
                      
                      },
                      fail: function () {
                        console.log('系统错误')
                      }
                    })
                  },
                  fail: function () {
                    console.log('获取用户信息失败')
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + r.errMsg)
              }
            },
            fail: function () {
              console.log('登陆失败')
            }
          })
        } else {
          console.log('获取用户信息失败')
        }
      }
    })
    
  },
  onLoad: function () {
    this.getUserInfo()
  },
  onShow:function(){
    var openid1 = wx.getStorageSync("openid")
    console.log(openid1)//这有bug
    this.setData({
      openid: openid1
    })
  },
  myCollect: function (event){
    var token = wx.getStorageSync("token")
    console.log(token);
    wx.navigateTo({
      url: '../mycollect/mycollect?token=' + token
    })
    
  },
  getUserInfo:function(){
    var that = this
    //判断是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            hasUserInfo: true
          })
        }
        //获取用户信息
        wx.getUserInfo({
          success: (res) => {
            //console.log(res)
            that.setData({
              imagesrc: res.userInfo.avatarUrl,
              textattr: res.userInfo.nickName
            })
          }
        })
      }
    })
  }
})
