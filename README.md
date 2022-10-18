# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

## install 全局安装

pnpm install

## install 局部安装

pnpm -F <package_selector> <command> pnpm -F sc-twin add loadsh

## dev

pnpm -F sc-twin dev

## scss

@use "@runafe/sc-style" as _;
使用 as_，那么这一模块就处于全局命名空间。

```
corners.scss
$radius: 3px;
@mixin rounded {
    border-radius: $radius;
}

index.scss
@use "src/corners" as *;
.button {
    @include rounded;
    padding: 5px + $radius;
}
```
## Vite 单个项目静态资源文件导入
``` 
正确
通过vite 提供import.meta.url 加载器加载地址
const url = new URL('../assets/venice_sunset_1k.hdr', import.meta.url).href
scene.environment = new RGBELoader().load(url, () => {})
错误
scene.environment = new RGBELoader().load('../assets/venice_sunset_1k.hdr', () => {}) 文件引入404

```
## monorepo package项目引入问题
问题：packageA 加载packageB 局部安装过程中出现包找不到情况 
方法：将所以包 装在根目录下

## element-admin 集成问题
```
问题：
type": "module" which defines all .js files in that package scope as ES modules.
Instead rename .eslintrc.js to end in .cjs, change the requiring code to use import(), or remove "type": "module"
原因： 设置package.json type": "module" 模块化方案为esm 不支持支持commonjs 
方法：
需设置文件后缀为cjs 或者 删除 "type": "module"配置
```

```
$ pnpm -F admin exec eslint . --fix 格式化文件
```
