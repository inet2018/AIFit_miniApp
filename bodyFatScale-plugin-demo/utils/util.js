/**
 * banner数据
 */
function getBannerData() {

}


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute
}

function forNowTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
 * 对外暴露接口      必须与页面函数一一对应
 */

module.exports = {
  formatTime: formatTime,
  getBannerData: getBannerData,
  forNowTime: forNowTime,
}
