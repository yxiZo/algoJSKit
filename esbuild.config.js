// esbuild.config.js
import * as esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.js'], // 入口文件
    bundle: true,                  // 启用打包
    outdir: 'dist',                // 输出目录
    minify: true,                  // 启用压缩
    sourcemap: true,               // 启用源映射
});