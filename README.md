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
let modal=new Modal({callback:function(){
    console.log(modal.value());
    modal.close('提交成功')
}})

function openModal(){
    //打开弹窗
    modal.open()
}
```