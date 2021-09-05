const { webpack } = require("webpack");
const prodOptions = require('./webpack.prod');
const serveOptions = require('./webpack.prod');

const build = () => webpack(prodOptions, (err, state) => {
    if (err) {
        console.log(`err`, err)
    } else {
        console.log(`state`, state.toJson({
            hash: true,
            assets: false
        }))
    }
})

const start = () => webpack(serveOptions, (err) => {
    if (err) {
        console.log(`err`, err);
    }
})

module.exports = {
    start,
    build
}