import Web3 from "web3";
import {huiwanUsdtLoopAddr,huiwanTokenAddr,usdtTokenAddr,huiwanUsdtMdexAddr} from './token.js'
// huiwanUsdtLoopABI
import huiwanUsdtLoopABI from "@/apis/abi/huiwanUsdtLoop.abi";

// huiwanTokenABI
import huiwanTokenABI from "@/apis/abi/huiwanToken.abi";

// usdtTokenABI
import usdtTokenABI from "@/apis/abi/usdtToken.abi";

// usdtTokenMdexABI
import huiwanUsdtMdexABI from "@/apis/abi/huiwanUsdtMdex.abi";


var huiwanUsdtLoopContract;
var huiwanTokenContract;
var usdtTokenContract;
var huiwanUsdtMdexContract;



function init(callback) {
    setTimeout(function() {
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
                    // 创建合约
                    //
                    huiwanUsdtLoopContract = new web3.eth.Contract(huiwanUsdtLoopABI, huiwanUsdtLoopAddr);
                    //
                    huiwanTokenContract = new web3.eth.Contract(huiwanTokenABI,huiwanTokenAddr);
                    //
                    usdtTokenContract = new web3.eth.Contract(usdtTokenABI, usdtTokenAddr);
                    //
                    huiwanUsdtMdexContract = new web3.eth.Contract(huiwanUsdtMdexABI, huiwanUsdtMdexAddr);
                    //
                    window.accountAddress = accounts[0];
                    callback(accounts[0]);
                });
        }
    }, 500);
}

// 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
function getInitreward(callback, errorCallBack) {
    huiwanUsdtLoopContract.methods
        .initreward()
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 查询用户是否授权
function getAccountStakedStatus(callback, errorCallBack) {
    huiwanUsdtMdexContract.methods
        .allowance(window.accountAddress,huiwanUsdtLoopAddr)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}


// 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
function getTotalSupply(callback, errorCallBack) {
    huiwanUsdtLoopContract.methods
        .totalSupply()
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 查询某个用户在 huiwanUsdtLoop 池子中的当前收益
function getEarned(account,callback, errorCallBack) {
    huiwanUsdtLoopContract.methods
        .earned(account)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}


// 查询 mdex 中配对合约拥有 huiwanToken 的数量
function getBalanceFromHuiwanTokenContract(account,callback, errorCallBack) {
    huiwanTokenContract.methods
        .balanceOf(account)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 查询 mdex 中配对合约拥有 usdtToken 的数量
function getBalanceFromUsdtTokenContract(account,callback, errorCallBack) {
    usdtTokenContract.methods
        .balanceOf(account)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 授权 huiwanUsdtLoop 池子合约可以帮我在 mdex 配对合约花费我的 100000000 个 lp 份额
function approveHuiwanUsdtLoopAddr(callback, errorCallBack) {
    let data = huiwanUsdtMdexContract.methods
    .approve(huiwanUsdtLoopAddr, web3.utils.toWei("100000000"))
    .encodeABI();
    sendTransfer(accountAddress, huiwanUsdtMdexAddr, data, callback, errorCallBack);
}

// 在 mdex 配对合约中获取我的 lp 数量
function getBalanceFromhuiwanUsdtMdexContract(account,callback, errorCallBack) {
    huiwanUsdtMdexContract.methods
        .balanceOf(account)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 抵押 lp 到 huiwanUsdtLoop 池子
function stakingToHuiwanUsdtLoopContract(amount, callback, errorCallBack) {
    let data = huiwanUsdtLoopContract.methods
        .stake(amount)
        .encodeABI();
    sendTransfer(window.accountAddress, huiwanUsdtLoopAddr, data, callback, errorCallBack);
}

// 查询某个用户在 huiwanUsdtLoop 池子中的余额
function getBalanceFromHuiwanUsdtLoopContract(account,callback, errorCallBack) {
    huiwanUsdtLoopContract.methods
        .balanceOf(account)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 解押
function withdrawFromHuiwanUsdtLoopContract(amount, callback, errorCallBack) {
    let data = huiwanUsdtLoopContract.methods
        .withdraw(amount)
        .encodeABI();
    sendTransfer(window.accountAddress, huiwanUsdtLoopAddr, data, callback, errorCallBack);
}


// 查询某个用户在 huiwanUsdtLoop 池子中的当前LP余额
function getPoolLP(account,callback, errorCallBack) {
    huiwanUsdtLoopContract.methods
        .balanceOf(account)
        .call(function(error, res) {
            if (error) {
                errorCallBack(handleError(error));
            } else {
                callback(res);
            }
        });
}

// 通过交易哈希查询 交易是否成功
function getDealStatusByHash(hash,callback){
    web3.eth.getTransactionReceipt(hash,callback)
}

export default {
    getDealStatusByHash,
    getPoolLP,
    init,
    getInitreward,
    getTotalSupply,
    getEarned,
    getAccountStakedStatus,
    getBalanceFromHuiwanTokenContract,
    getBalanceFromUsdtTokenContract,
    approveHuiwanUsdtLoopAddr,
    getBalanceFromhuiwanUsdtMdexContract,
    stakingToHuiwanUsdtLoopContract,
    getBalanceFromHuiwanUsdtLoopContract,
    withdrawFromHuiwanUsdtLoopContract,
}

//
// // 购买HE3算力
// function buyHeThreeHashrate(token, account, callback, errorCallBack) {
//     let num = web3.utils.toWei(token.toString(), "ether").toString();
//     let data = hackerContract.methods
//         .buyHashRateWithHE3(num, account)
//         .encodeABI();
//     sendTransfer(accountAddress, hackerFederation, data, callback, errorCallBack);
// }
//
// // 授权HE1
// function HeOneRoot(callback, errorCallBack) {
//     let data = heOneContract.methods
//         .approve(hackerFederation, web3.utils.toWei("210000000"))
//         .encodeABI();
//     sendTransfer(accountAddress, heOneToken, data, callback, errorCallBack);
// }
//
// // 授权HE3
// function HeThreeRoot(callback, errorCallBack) {
//     let data = heThreeContract.methods
//         .approve(hackerFederation, web3.utils.toWei("210000000"))
//         .encodeABI();
//     sendTransfer(accountAddress, heThreeToken, data, callback, errorCallBack);
// }
//
// // 购买HE1算力
// function buyHeOneHashrate(token, account, callback, errorCallBack) {
//     console.log(account);
//     console.log(token);
//     let num = web3.utils.toWei(token.toString(), "ether").toString();
//     let data = hackerContract.methods
//         .buyHashRateWithHE1(num, account)
//         .encodeABI();
//     sendTransfer(accountAddress, hackerFederation, data, callback, errorCallBack);
// }
//
// // 查HE3授权数量
// function getRootNumT(callback, errorCallBack) {
//     heThreeContract.methods
//         .allowance(accountAddress, hackerFederation)
//         .call(function(error, res) {
//             if (error) {
//                 errorCallBack(handleError(error));
//             } else {
//                 callback(res);
//             }
//         });
// }
//
// // 查HE1授权数量
// function getRootNum(callback, errorCallBack) {
//     heOneContract.methods
//         .allowance(accountAddress, hackerFederation)
//         .call(function(error, res) {
//             if (error) {
//                 errorCallBack(handleError(error));
//             } else {
//                 callback(res);
//             }
//         });
// }
//
// // 获取账户HE3余额
// function getHeOneNum(account, callback, errorCallBack) {
//     heOneContract.methods.balanceOf(account).call(function(error, res) {
//         if (error) {
//             errorCallBack(handleError(error));
//         } else {
//             callback(res);
//         }
//     });
// }
//
// // 获取账户HE1余额
// function getHeThreeNum(account, callback, errorCallBack) {
//     heThreeContract.methods.balanceOf(account).call(function(error, res) {
//         if (error) {
//             errorCallBack(handleError(error));
//         } else {
//             callback(res);
//         }
//     });
// }
//
// // 获取HE3销毁总量
// function getHeThreeBurnCoin(callback, errorCallBack) {
//     heThreeContract.methods.balanceOf(destroyAddress).call(function(error, res) {
//         if (error) {
//             errorCallBack(handleError(error));
//         } else {
//             callback(res);
//         }
//     });
// }
//
// // 获取当前市场流通总量
// function getMarketCoin(callback, errorCallBack) {
//     heThreeContract.methods._currentSupply().call(function(error, res) {
//         if (error) {
//             errorCallBack(handleError(error));
//         } else {
//             callback(res);
//         }
//     });
// }
//
// // 获取发行总量
// function getMarketAllCoin(callback, errorCallBack) {
//     heThreeContract.methods.totalSupply().call(function(error, res) {
//         if (error) {
//             errorCallBack(handleError(error));
//         } else {
//             callback(res);
//         }
//     });
// }
//
// // 获取市场流通总量
// function getTotalBalance(callback, errorCallBack) {
//     heThreeContract.methods._totalMintBalance().call(
//         {
//             to: heThreeToken,
//         },
//         function(error, res) {
//             if (error) {
//                 errorCallBack(handleError(error));
//             } else {
//                 callback(res);
//             }
//         }
//     );
// }
//
// function getMintData(account) {
//     // 加密data 用法
//     let data = heThreeContract.methods
//         .mint(account, 10000000000, 1000000000)
//         .encodeABI();
//     return data;
// }
//
// // 获取每个 he3 兑换多少个 usdt
// function getUsdtToHEThree(callback, errorCallBack) {
//     hackerContract.methods.getDaiPerHe3().call(
//         {
//             to: hackerFederation, // contract address
//         },
//         function(error, res) {
//             if (error) {
//                 errorCallBack(handleError(error));
//             } else {
//                 //TODO Dai 为 18 位
//                 res = parseFloat(web3.utils.fromWei(res, "ether")).toFixed(6);
//                 callback(res);
//             }
//         }
//     );
// }
//
// // 判断是否为平台用户
// function isUser(account, callback, errorCallBack) {
//     hackerContract.methods.isUser(account).call(
//         {
//             to: hackerFederation, // contract address
//         },
//         function(error, res) {
//             if (error) {
//                 console.log(error)
//                 errorCallBack(handleError(error));
//             } else {
//                 callback(res);
//             }
//         }
//     );
// }
//
// // 获取手续费
// function getMinGasFree(address, data, callback, errorCallBack) {
//     web3.eth.estimateGas(
//         {
//             from: rootAddress,
//             to: address,
//             data: data,
//         },
//         function(error1, gaslimit) {
//             if (error1) {
//                 // alert(error1);
//                 errorCallBack(handleError(error1));
//             } else {
//                 //获取gasprice
//                 web3.eth.getGasPrice(function(error2, gasPrice) {
//                     if (error2) {
//                         alert(error2);
//                         errorCallBack(handleError(error2));
//                     } else {
//                         let res = gasPrice * gaslimit;
//                         callback(res);
//                     }
//                 });
//             }
//         }
//     );
// }
//
// /**
//  * 发送交易
//  * @param {Object} account 用户地址
//  * @param {Object} to 合约地址
//  * @param {Object} data 数据
//  * @param {Object} callback 返回hash
//  * @param {Object} errorCallBack 返回的错误
//  */
function sendTransfer(account, to, data, callback, errorCallBack) {
    let value = 0x0;
    //获取gaslimit
    web3.eth.estimateGas(
        {
            from: account,
            to: to,
            data: data,
            value: value,
        },
        function(error1, gaslimit) {
            if (error1) {
                // alert(error1);
                errorCallBack(handleError(error1));
            } else {
                //获取gasprice
                web3.eth.getGasPrice(function(error2, gasPrice) {
                    if (error2) {
                        errorCallBack(handleError(error2));
                    } else {
                        gaslimit -= -10000;
                        let params = [
                            {
                                gasPrice: gasPrice,
                                gasLimit: gaslimit,
                                to: to,
                                from: account,
                                data: data,
                                value: value,
                            },
                        ];
                        //提交交易
                        ethereum.sendAsync(
                            {
                                method: "eth_sendTransaction",
                                params: params,
                                from: account,
                            },
                            function(error, hash) {
                                console.log(JSON.stringify(hash))
                                if (error) {
                                    console.log("发起交易失败：");
                                    errorCallBack(handleError(error));
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

function handleError(errorMsg) {
    if ("message" in errorMsg) {
        return errorMsg.message;
    }
    errorMsg = errorMsg.toString();
    errorMsg = errorMsg.replace(/\s+/g, " ");
    errorMsg = errorMsg.replace(/.+\\"message\\"\\:\s*\\"(.+)\\".+/, "$1");
    return errorMsg;
}
//
// export default {
//     init,
//     getMinGasFree,
//     getMintData,
//     heThreeToken,
//     getUsdtToHEThree,
//     getTotalBalance,
//     getMarketCoin,
//     getHeThreeBurnCoin,
//     getHeThreeNum,
//     getHeOneNum,
//     buyHeThreeHashrate,
//     buyHeOneHashrate,
//     HeOneRoot,
//     getRootNum,
//     getRootNumT,
//     HeThreeRoot,
//     isUser,
//     peakAddress,
//     getMarketAllCoin,
//     getInitreward,
// };

