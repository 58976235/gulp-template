<!--
 * @Author: your name
 * @Date: 2021-08-30 16:38:33
 * @LastEditTime: 2021-08-31 11:15:44
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /gulp-template/README.md
-->
[TOC]

## 使用说明

``` shell
npm i
```
```shell
gulp
```
## 目录说明

- components--公共组件
  - xxx
    - xxx.html
    - xxx.less
    - xxx.js
- pages--页面
  - xxx
    - xxx.html
    - xxx.less
    - xxx.js
- public--公共样式/js
  - less
  - js
- static--静态资源（公共的css直接放到这里）
  - css 
  - font
  - Images

------

所有页面全部放在pages文件夹内
除了a标签，所有资源引用路径按照正常引入
a标签跳转页面，路径都是相对于页面的同级路径
例如 a.html跳到b.html 只需   href='./b.html'

## 使用下拉框

```html
<!--在html中-->
<select id="select">
    <option value="1">选择一</option>
    <option value="2">选择二</option>
    <option value="3">选择三</option>
    <option value="4">选择四</option>
    <option value="5">选择五</option>
    <option value="6">选择六</option>
</select>
```
---
## 使用弹窗

```html
<!--在html中-->
<script src="../../public/js/public_jquery.js"></script>
<script src="../../public/js/public_module.js"></script>
```
```less
/* less中 */
@import "../module_less/public_module.less";
```
```javascript
/*js中 传递一个提交按钮点击事件过去，通过modal.value()可获取输入框的值*/
// {标题，信息，信息，协议名，协议地址，提交按钮点击事件}
// new Modal({title,msg1,msg2,agreement,url,callback})

// 公共的信息可以在 new 的时候传过去  按钮点击的方法必传
let modal=new Modal({callback:function(){
    console.log(modal.value());
    modal.close('提交成功')
}})

function openModal(){
    //打开弹窗
    //modal.open() 或 ⬇️    这个弹窗独有的信息及点击事件可以按下面这种写法
    modal.open('标题','信息<span>120</span>条','信息2','协议名','javascript:;',function(){modal.close('提交成功222')})
}
```