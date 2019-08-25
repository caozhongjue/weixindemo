// pages/app/app.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curNav:1,
    region:"北京市,北京市，东城区",
    imgurl:"/images/100.png",
    now:""
  },
  /*把点击到的某一项 设为当前curNav */
  switchRightTab:function(e){
    let id = e.target.dataset.id;
    console.log(id);
    this.setData({
      curNav:id
    })
  },
  /*点击地名事件 */
  bindChangeWeather:function(res){
    console.log(res.detail.value)
    this.setData({
      region: res.detail.value
    })
    this.getNet();
  },
  getNet:function(res){
    var that = this;
    wx.request({
      url: 'https://free-api.heweather.net/s6/weather/now?',
      data:{
        location:that.data.region[1],
        key:"84e08f5287154eeaabfd3cae69c185a2"
      },
      success:function(res){
          console.log(res.data.HeWeather6)
          that.setData({
            now: res.data.HeWeather6[0].now
          })
      }
    })
  },
  // search:function(){
  //   wx.request({
  //     url: 'https://api.heweather.net/s6/weather/now',
  //     data:{
  //       location:name,
  //       key:"84e08f5287154eeaabfd3cae69c185a2"
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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