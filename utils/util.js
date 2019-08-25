const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getSearchMusic: getSearchMusic  
}

function getSearchMusic( pageindex, callbackcount, callback) {
     wx.request({
       url:  'https://www.caozhongjue.top/main',
      data: {

             page: pageindex,
             size: callbackcount,  //返回数据的个数  
              
     },
    header: { 'content-Type': 'application/json' },
    success: function (res) {
        if (res.statusCode == 200) {
        callback(res.data);
      
    }
      
    }  
  })
 } 
