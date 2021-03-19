const path = require("path");
const resolve = dir =>  path.join(__dirname, dir);

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    chainWebpack: config => {
        config.resolve.alias // 添加别名
            .set("@api", resolve("src/api"))
            .set("@assets", resolve("src/assets"))
            .set("@components", resolve("src/components"))
            .set("@mobile", resolve("src/assets/style/mobile_style"))
    }
}