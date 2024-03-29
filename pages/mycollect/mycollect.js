// pages/mycollect/mycollect.js

var app = getApp();
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    hasCollect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = options.token
    var that = this
      wx.request({
        url: app.globalData.url+'selectMyCollectByOpenid',
        method: 'POST',
        header: {
          'Authorization': JSON.parse(token),
          'content-type': "application/x-www-form-urlencoded",
        },
        success: function (res) {
          if(res.data.num===0){
            hasCollect: false
          }else{
            console.log(res)
            that.setData({
              items: res.data.questions,
              hasCollect: true
            })
          }
        }
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