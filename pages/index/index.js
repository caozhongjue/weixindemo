//index.js
const util = require('../../utils/util.js')
var app = getApp();
Page({
  
  data: {
    items: [],
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    scrollH: 0 ,
    totalPages: 0,
  },
  onLoad: function () {
    this.indexData();//
    var self = this;
    //console.log(wx.getStorageSync("openid"))
    wx.getSystemInfo({
      success: function (res) {
        let scrollH = res.windowHeight;
        self.setData({
          scrollH: scrollH
        });
        //console.log(scrollH)
      }
    });
  },
  indexData:function(){
    var that = this;
    wx.request({
      url: app.globalData.url+'main',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       //console.log(res)
        that.setData({
          items: res.data.questions,
          searchPageNum: 1,   //第一次加载，设置1 
          isFromSearch: false,  //第一次加载，设置true  
          searchLoading: true,  //把"上拉加载"的变量设为true，显示  
          searchLoadingComplete: false //把“没有数据”设为false，隐藏
          
        })
      }
    })
  },
  //滚动到顶部事件
  topLoad: function () {
    var that = this;
    //console.log("aaaaaa")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      that.indexData()//
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //滚动到底部事件
  searchScrollLower: function(){
    let that = this;
    //console.log("aaa")
      if (that.data.searchLoading && !that.data.searchLoadingComplete) {
         that.setData({
            searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1  
            isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false 
            });
          that.fetchSearchList();
    }  
  },
  fetchSearchList:function(){
    let that = this;  
    let searchPageNum = that.data.searchPageNum;//把第几次加载次数作为参数  
    let callbackcount = that.data.callbackcount; //返回数据的个数 
    //访问网络  
    //console.log(searchPageNum)
    util.getSearchMusic(searchPageNum, callbackcount, function (data) {
    //console.log(data)
    //判断是否有数据，有则取数据  
    if (data.questions.curnum != 0 & searchPageNum <= data.totalPages) {
        let searchList = [];
      //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
      that.data.isFromSearch ? searchList = data.questions : searchList = that.data.items.concat(data.questions)
      that.setData({
        items: searchList, //获取数据数组  
        searchLoading: true   //把"上拉加载"的变量设为false，显示  
      });
    //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
        
    } else {
      that.setData({
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
      });
     }
    })  
  },
  bindTap: function (event) {
    wx.navigateTo({
      url: '../detail/detail?id=' + event.currentTarget.id,
      // success: function (e) {
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) return;
      //   page.onLoad();
      // }
      
    })
    
  },
  onShow: function () {
    //this.indexData();
  }
})
