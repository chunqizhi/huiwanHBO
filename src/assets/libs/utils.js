export default {
  isMobile: function () {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  },
  prefixZero: function (num, n) {
    return (Array(n).join(0) + num).slice(-n);
  }

}