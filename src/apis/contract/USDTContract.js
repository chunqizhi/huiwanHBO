import Web3 from "web3";
import {
    usdtTokenAddr,
    HBOUSDTMdexAddr
} from '../token'
import usdtTokenABI from '../abi/usdtToken.abi'
class Contract {
    constructor() {
        this.usdtTokenAddr = usdtTokenAddr
        this.usdtTokenABI = usdtTokenABI
        this.HBOUSDTMdexAddr = HBOUSDTMdexAddr
        this.usdtTokenContract = null

    }

    // 初始化
    init(callback) {
        let _this = this
        if (typeof window.ethereum === "undefined") {
            alert("Looks like you need a Dapp browser to get started.");
            alert("Consider installing MetaMask!");
        } else {
            //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
            ethereum
                .enable()
                //如果用户拒绝了登录请求
                .catch(function(reason) {
                    if (reason === "User rejected provider access") {
                        // 用户不想登录，你看该怎么办？
                    } else {
                        // 本不该执行到这里，但是真到这里了，说明发生了意外
                        alert("There was an issue signing you in.");
                    }
                })
                //如果用户同意了登录请求，你就可以拿到用户的账号
                .then(function(accounts) {
                    //创建web3对象;
                    window.web3 = new Web3(ethereum);

                    _this.usdtTokenContract = new web3.eth.Contract(_this.usdtTokenABI, _this.usdtTokenAddr);

                    window.accountAddress = accounts[0];
                    callback(accounts[0]);
                });
        }
    }

    // 
    getBalanceFromusdtTokenContract(callback, errorCallBack) {
        this.usdtTokenContract.methods
            .balanceOf(this.HBOUSDTMdexAddr)
            .call(function(error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    getHBOUSDTBalance() {
        return new Promise((resolve, reject) => {
            this.init(() => {
                this.getBalanceFromusdtTokenContract((res) => {
                    resolve(res)
                }, (error) => {
                    reject(reject)
                })
            })
        })
    }

}


export default new Contract()