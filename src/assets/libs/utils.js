import Web3 from "web3";
export default {
  isMobile: function () {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  },
  prefixZero: function (num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },
  // 将bignumber转换
  wei_fn:function(str){
    return Web3.utils.fromWei(str,'ether')
  },
  towei_fn(str){
    return Web3.utils.toWei(str,'ether')
  }
}