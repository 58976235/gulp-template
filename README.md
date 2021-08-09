``` shell
npm i
```
```shell
gulp
```

使用弹窗
```html
<!--在html中-->
<script src="../js/public/jquery.js"></script>
<script src="../js/public/modal.js"></script>
```
```less
/* less中 */
@import "../module_less/modal.less";
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