/**
 * loader是一个函数，参数是上一个loader的内容或者模块的源代码
 * 经过处理，吧结果返回给下一个loader或者webpack
 */
const Px2rem =require('../doc/px2rem');

/** 安装了webpack就会有loader-utils */
const loaderUtils = require('loader-utils');

function loader(source) {

    /** 获取loader中的options参数对象 */
    const options = loaderUtils.getOptions(this);

    /** this.resource 表示当前正在转换模块的绝对路径 */
    if (options.exclude && options.exclude.test(this.resource)) {
        return source; //不转换
    }

    const px2rem = new Px2rem(options);

    const targetSource = px2rem.generateRem(source);

    return targetSource;
}


module.exports = loader;