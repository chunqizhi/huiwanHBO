import Web3 from "web3";
class Contract {
    constructor(options) {
        // addr
        this.huiwanUsdtLoopAddr = options.huiwanUsdtLoopAddr
        this.huiwanTokenAddr = options.huiwanTokenAddr
        this.usdtTokenAddr = options.usdtTokenAddr
        this.huiwanUsdtMdexAddr = options.huiwanUsdtMdexAddr
        this.huiwanSinglePoolAddr=options.huiwanSinglePoolAddr
        // 合约abi
        this.huiwanUsdtLoopABI = options.huiwanUsdtLoopABI
        this.huiwanTokenABI = options.huiwanTokenABI
        this.usdtTokenABI = options.usdtTokenABI
        this.huiwanUsdtMdexABI = options.huiwanUsdtMdexABI
        this.huiwanSinglePoolABI=options.huiwanSinglePoolABI
        // 合约对象
        this.huiwanUsdtLoopContract = null
        this.huiwanTokenContract = null
        this.usdtTokenContract = null
        this.huiwanUsdtMdexContract = null
        this.huiwanSinglePoolContract=null

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
                .catch(function (reason) {
                    if (reason === "User rejected provider access") {
                        // 用户不想登录，你看该怎么办？
                    } else {
                        // 本不该执行到这里，但是真到这里了，说明发生了意外
                        alert("There was an issue signing you in.");
                    }
                })
                //如果用户同意了登录请求，你就可以拿到用户的账号
                .then(function (accounts) {
                    //创建web3对象;
                    window.web3 = new Web3(ethereum);
                    // 创建合约
                    //
                    _this.huiwanUsdtLoopContract = new web3.eth.Contract(_this.huiwanUsdtLoopABI, _this.huiwanUsdtLoopAddr);
                    //
                    _this.huiwanTokenContract = new web3.eth.Contract(_this.huiwanTokenABI, _this.huiwanTokenAddr);
                    //
                    _this.usdtTokenContract = new web3.eth.Contract(_this.usdtTokenABI, _this.usdtTokenAddr);
                    //
                    _this.huiwanUsdtMdexContract = new web3.eth.Contract(_this.huiwanUsdtMdexABI, _this.huiwanUsdtMdexAddr);
                    //
                    _this.huiwanSinglePoolContract =  new web3.eth.Contract(_this.huiwanSinglePoolABI, _this.huiwanSinglePoolAddr);
                    
                    window.accountAddress = accounts[0];
                    callback(accounts[0]);
                });
        }
    }

    // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
    getInitreward(callback, errorCallBack) {
        this.huiwanSinglePoolContract.methods
            .initreward()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询用户是否授权
    getAccountStakedStatus(callback, errorCallBack) {
        this.huiwanTokenContract.methods
            .allowance(window.accountAddress, this.huiwanSinglePoolAddr)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }


    // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
    getTotalSupply(callback, errorCallBack) {
        this.huiwanSinglePoolContract.methods
            .totalSupply()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询某个用户在 huiwanUsdtLoop 池子中的当前收益
    getEarned(account, callback, errorCallBack) {
        this.huiwanSinglePoolContract.methods
            .earned(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }


    // 查询 mdex 中配对合约拥有 huiwanToken 的数量
    getBalanceFromHuiwanTokenContract(account, callback, errorCallBack) {
        this.huiwanTokenContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询 mdex 中配对合约拥有 usdtToken 的数量
    getBalanceFromUsdtTokenContract(account, callback, errorCallBack) {
        this.usdtTokenContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 授权 huiwanUsdtLoop 池子合约可以帮我在 mdex 配对合约花费我的 100000000 个 lp 份额
    approveHuiwanUsdtLoopAddr(callback, errorCallBack) {
        let data = this.huiwanTokenContract.methods
            .approve(this.huiwanSinglePoolAddr, web3.utils.toWei("100000000"))
            .encodeABI();
        this.sendTransfer(window.accountAddress, this.huiwanTokenAddr, data, callback, errorCallBack);
    }

    // 在 mdex 配对合约中获取我的 lp 数量
    getBalanceFromhuiwanUsdtMdexContract(account, callback, errorCallBack) {
        this.huiwanTokenContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 抵押 lp 到 huiwanUsdtLoop 池子
    stakingToHuiwanUsdtLoopContract(amount, callback, errorCallBack) {
        let data = this.huiwanSinglePoolContract.methods
            .stake(amount)
            .encodeABI();
        this.sendTransfer(window.accountAddress, this.huiwanSinglePoolAddr, data, callback, errorCallBack);
    }

    // 查询某个用户在 huiwanUsdtLoop 池子中的余额
    getBalanceFromHuiwanUsdtLoopContract(account, callback, errorCallBack) {
        this.huiwanSinglePoolContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 解押
    withdrawFromHuiwanUsdtLoopContract(amount, callback, errorCallBack) {
        let data = this.huiwanSinglePoolContract.methods
            .withdraw(amount)
            .encodeABI();
        this.sendTransfer(window.accountAddress, this.huiwanSinglePoolAddr, data, callback, errorCallBack);
    }


    // 查询某个用户在 huiwanUsdtLoop 池子中的当前LP余额
    getPoolLP(account, callback, errorCallBack) {
        this.huiwanSinglePoolContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 通过交易哈希查询 交易是否成功
    getDealStatusByHash(hash, callback) {
        web3.eth.getTransactionReceipt(hash, callback)
    }

  // 获取所有收益
  getReward(callback,errorCallBack) {
    let data = this.huiwanSinglePoolContract.methods.getReward()
        .encodeABI();
    this.sendTransfer(window.accountAddress, this.huiwanSinglePoolAddr, data, callback, errorCallBack);
}


// 获取&解押
getExit(callback,errorCallBack){
    let data = this.huiwanSinglePoolContract.methods.exit()
    .encodeABI();
this.sendTransfer(window.accountAddress, this.huiwanSinglePoolAddr, data, callback, errorCallBack);
}


    // /**
    //  * 发送交易
    //  * @param {Object} account 用户地址
    //  * @param {Object} to 合约地址
    //  * @param {Object} data 数据
    //  * @param {Object} callback 返回hash
    //  * @param {Object} errorCallBack 返回的错误
    //  */
    sendTransfer(account, to, data, callback, errorCallBack) {
        // let _this = this
        let value = 0x0;
        //获取gaslimit
        web3.eth.estimateGas({
                from: account,
                to: to,
                data: data,
                value: value,
            },
            function (error1, gaslimit) {
                if (error1) {
                    // alert(error1);
                    errorCallBack(handleError(error1));
                } else {
                    //获取gasprice
                    web3.eth.getGasPrice(function (error2, gasPrice) {
                        if (error2) {
                            errorCallBack(handleError(error2));
                        } else {
                            gaslimit -= -10000;
                            let params = [{
                                gasPrice: gasPrice,
                                gasLimit: gaslimit,
                                to: to,
                                from: account,
                                data: data,
                                value: value,
                            }, ];
                            //提交交易
                            ethereum.sendAsync({
                                    method: "eth_sendTransaction",
                                    params: params,
                                    from: account,
                                },
                                function (error, hash) {
                                    console.log(JSON.stringify(hash))
                                    if (error) {
                                        console.log("发起交易失败：");
                                        errorCallBack && errorCallBack(handleError(error));
                                    } else {
                                        console.log("交易参数params:");
                                        console.log(params);
                                        console.log(`${hash}`);
                                        callback(JSON.parse(JSON.stringify(hash)));
                                    }
                                }
                            );
                        }
                    });
                }
            }
        );
    }


}

function handleError(errorMsg) {
    if ("message" in errorMsg) {
        return errorMsg.message;
    }
    errorMsg = errorMsg.toString();
    errorMsg = errorMsg.replace(/\s+/g, " ");
    errorMsg = errorMsg.replace(/.+\\"message\\"\\:\s*\\"(.+)\\".+/, "$1");
    return errorMsg;
}

export default Contract
