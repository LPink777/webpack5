## webpack

### 新特性

- 持久化缓存 cache配置 写到本地node_module的.cache文件中
- tree-shaking
- 联邦模块
- 资源模块配置 asset
- URIs
- moduleIds & chunkIds的优化
- 移除nodejs的polyfill

### 性能优化

- webpack-bundle-analyzer 进行包分析
- 缩小查找范围
  - extensions
  - alias
  - modules
  - mainFiles // 更改包启动的入口文件
  - oneOf //当匹配到 rules 中的 loader 时停止往下匹配
  - external
  - resolveLoader //自定义 loader
  - ignorePlugin //忽略某些多余文件的编译
  - cache-loader
  - thread-loader //启动多线程
  - webpack 自带的缓存
- 编译体积优化
  - 压缩 js：terser-webpack-plugin
  - 压缩 css：css-minimizer-webpack-plugin
  - 压缩 html：html-webpack-plugin
  - 压缩 image：image-webpack-loader
  - 移除无用内容：purgecss-webpack-plugin
- tree-shanking
  - webpack5 默认开启 mode 改为 production 即可
- lazyload 懒加载
  - ```javascript
    btn.addEventListener("click", () => {
      import("./src/components/HeadBar/index.js").then((res) =>
        console.log(res)
      );
    });
    ```
- prefetch 预获取，在浏览器空闲的时候加载，不会抢占浏览器资源 与 preload 不同，preload 优先级较高，一定会加载资源，会与浏览器抢占资源
  - ```javascript
    btn.addEventListener("click", () => {
      import(
        /* webpackChunkName: 'video , webpackPrefetch: true */ "./src/components/HeadBar/index.js"
      ).then((res) => console.log(res));
    });
    ```

### 环境

- mode //开发模块中 process.env.NODE_ENV，配置文件获取不到 process.env.NODE_ENV

### Babel

- npm i @babel/core @babel/cli @babel/preset-env -D
- .browserslistrc 目标环境
- polyfill
  - useBuiltIns: 'usage' 按需引入垫片 但是会污染全局环境
  - babel-runtime 按需引入，不会污染全局环境，适合开发工具类库
    ```shell
      $ npm i @babel/plugin-transform-runtime @babel/runtime-corejs3 -D
    ```
- preset 预设是 plugins 插件的集合 插件会先执行，再执行plugins, **插件是从前往后执行，预设是从后往前执行**
