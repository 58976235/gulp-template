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
@import "../module_less/modal.less";
```
```javascript
let modal=new Modal({callback:function(){
    console.log(modal.value());
    modal.close('提交成功')
}})

function openModal(){
    //打开弹窗
    modal.open()
}
```