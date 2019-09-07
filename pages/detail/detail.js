// pages/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    src: "../../images/icon/yedu1.png",
    title: "",
    md: "",
    name: "",
    viewCount: "",
    collected: false,
    isLike: false,
    isCollect: false,
    scrollH: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let scrollH2 = res.windowHeight;
        let scrollH = scrollH2 - 50
        that.setData({
          scrollH: scrollH
        });
        //console.log(scrollH)
      }
    });
    
    var postId = options.id;//要先在对应的数据文本中对每个栏目定义postId、比如postId: 0 postId:1
    this.setData({
      id: postId
    })
    this.data.currentPostId = postId; //借助顶部data作为中转，拿到上面这行postid后，将它放到下面var postCollected = postsCollected[]
    //用户收藏功能,通过wx.getStorageSyc("openid")查询先
    var token = wx.getStorageSync("token")
    if (token) {
      wx.request({
        url: app.globalData.url+'selectCollectById',//
        method: 'POST',
        header: {
          'Authorization': JSON.parse(token),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          id: this.data.currentPostId
        },
        success: (res) =>{
          console.log(res.data.code+"c")
          if (res.data.code==1){
            this.setData({
              collected: true, //当前的collected为postCollected
              isCollect: true
            })
            var postsCollected1 = {}
            if (that.data.isCollect)
              postsCollected1[this.data.currentPostId] = that.data.collected
              wx.setStorageSync('collected', postsCollected1)
          }
        }
      })
      //用户收藏功能
      var postsCollected = wx.getStorageSync('collected') //从缓存中读取所有的缓存状态
      var postCollected = postsCollected[this.data.currentPostId]//读取其中一个缓存状态
      if (postCollected) {   //postsCollected为真的情况，在缓存中存在
        this.setData({
          collected: postCollected //将是否被收藏的状态上绑定到collected这个变量上
        })
      }
      else {       //为假的情况，缓存中为空的情况
        var postsCollected = {}; //对postsCollected进行一个赋值操作，从而防止为空，从而省掉后面对它是否为空进
        postsCollected[this.data.currentPostId] = false; // 让当前的这篇文章状态为false，从而收藏星星不点亮
        wx.setStorageSync('collected', postsCollected);//将postsCollected对象放到缓存中
      }
    }
    wx.request({
      url: app.globalData.url+'selectQuestionById?id=' + options.id,//
      success: function (res) {
        res.data //这是请求获得的数据  打印看看
        that.setData({
          title: res.data.title,
          md: res.data.description,
          id: res.data.id,
          viewCount: res.data.viewCount
        })
      }
    })
    //用户点赞功能
    var postsLike = wx.getStorageSync('isLike') //从缓存中读取所有的缓存状态
    // console.log(postsLike)
    if (postsLike) {   //postsCollected为真的情况，在缓存中存在
      var postCollected = postsLike[postId]//读取其中一个缓存状态
      this.setData({
        isLike: postCollected //将是否被点赞的状态上绑定到collected这个变量上
      })
    }
    else {       //为假的情况，缓存中为空的情况
      var postsCollected = {}; //对postsCollected进行一个赋值操作，从而防止为空，从而省掉后面对它是否为空进
      postsCollected[postId] = false; // 让当前的这篇文章状态为false，从而点赞星星不点亮
      wx.setStorageSync('isLike', postsCollected);//将postsCollected对象放到缓存中
    }
   
  }
  ,
  onCollectionTap: function (event) {　　　　// 定义onCollectionTap事件用来确定文章是否收藏，如果没收藏就能点亮星星进行收藏
    var token = wx.getStorageSync("token")
    if (token){
      var postsCollected = wx.getStorageSync('collected');   //获取缓存的方法
      var postCollected = postsCollected[this.data.currentPostId];   //确定当前文章是否有缓存的状态，传递参数方法、借助其他参数来传递变量，如上的dat
      var postCollected1 = !postCollected;// 取反操作，收藏变成未收藏、未收藏变为收藏
      if (postCollected1){
        wx.request({
          url: app.globalData.url+'addCollect' ,
          data: {
            id: this.data.id,
          },
          header: {
            'Authorization': JSON.parse(token),
            'content-type': "application/x-www-form-urlencoded",
          },
          method: 'POST'
        })
        postsCollected[this.data.currentPostId] = postCollected1;//整体缓存的某一篇文章的缓存值等于postCollected从而更新一个变量
        wx.setStorageSync('collected', postsCollected);//更新文章是否收藏的缓存值,相当于在数据库中做了一次更新。
        //更新Data的数据绑定变量,从而实现图片切换
        this.setData({
          collected: postCollected1 //当前的collected为postCollected
        })
      }else{
        wx.request({
          url: app.globalData.url+'deleteCollect',
          data: {
            id: this.data.id,
          },
          header: {
            'Authorization': JSON.parse(token),
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST'
        })
        postsCollected[this.data.currentPostId] = postCollected1;//整体缓存的某一篇文章的缓存值等于postCollected从而更新一个变量
        wx.setStorageSync('collected', postsCollected);//更新文章是否收藏的缓存值,相当于在数据库中做了一次更新。
        //更新Data的数据绑定变量,从而实现图片切换
        this.setData({
          collected: postCollected1 //当前的collected为postCollected
        })
      }
      wx.showToast({
          title: this.data.collected ? "收藏成功" : "收藏取消",
          duration: 1000,
          icon: "sucess",
          make: true
      })
    }else{
      wx.showToast({
        title: "请登录",
        duration: 1000,
        icon: "sucess",
        make: true
      })
      return;
    }
  }
  ,
  onCommentTap: function(event){
    var token = wx.getStorageSync("token")
    console.log(event.currentTarget.id)
    if(token){
      wx.navigateTo({
        url: '../comment/comment?id=' + event.currentTarget.id
      })
    }
    else {
      wx.showToast({
        title: "请登录",
        duration: 1000,
        icon: "sucess",
        make: true
      })
      return;
    }
  }
  ,
  handleLike: function (event) {
    var token = wx.getStorageSync("token")
    if (token) {
      var postsCollected = wx.getStorageSync('isLike');   //获取缓存的方法
      //console.log(postsCollected)
      var postCollected = postsCollected[this.data.currentPostId];   //确定当前文章是否有缓存的状态，传递参数方法、借助其他参数
      var postCollected1 = !postCollected;// 取反操作，收藏变成未收藏、未收藏变为收藏
      if (postCollected1) {
        wx.request({
          url: app.globalData.url+'addLike',
          data: {
            id: this.data.id,
          },
          header: {
            'Authorization': JSON.parse(token),
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST'
        })
        postsCollected[this.data.currentPostId] = postCollected1;//整体缓存的某一篇文章的缓存值等于postCollected从而更新一个变量
        wx.setStorageSync('isLike', postsCollected);//更新文章是否点赞的缓存值,相当于在数据库中做了一次更新。
        //更新Data的数据绑定变量,从而实现图片切换
        this.setData({
          isLike: postCollected1 //当前的collected为postCollected
        })
      } else {
        wx.request({
          url: app.globalData.url+'deleteLike',
          data: {
            id: this.data.id,
          },
          header: {
            'Authorization': JSON.parse(token),
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'POST'
        })
        var postCollected1 = !postCollected;// 取反操作，收藏变成未收藏、未收藏变为收藏
        postsCollected[this.data.currentPostId] = postCollected1;//整体缓存的某一篇文章的缓存值等于postCollected从而更新一个变量
        wx.setStorageSync('isLike', postsCollected);//更新文章是否点赞的缓存值,相当于在数据库中做了一次更新。
        //更新Data的数据绑定变量,从而实现图片切换
        this.setData({
          isLike: postCollected1 //当前的collected为postCollected
        })
      }
    } else {
      wx.showToast({
        title: "请登录",
        duration: 1000,
        icon: "sucess",
        make: true
      })
      return;
    }
  }
 ,
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }

})